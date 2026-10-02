import { Resend } from 'resend';

/** Recipient inbox. The visitor's address goes in Reply-To, never here. */
const TO = 'varunbpvarunbp@gmail.com';

/**
 * `onboarding@resend.dev` is Resend's shared sender. Without a verified custom
 * domain it is the only address Resend will accept, and it can deliver to the
 * account owner's inbox — which is this same Gmail. Move to
 * `Portfolio <contact@yourdomain>` once a domain is verified.
 */
const FROM = 'Portfolio Contact <onboarding@resend.dev>';

const MAX_BODY_BYTES = 16 * 1024; // hard ceiling on the raw request body
const MAX_NAME = 100;
const MAX_EMAIL = 150;
const MAX_MESSAGE = 5000;

// Best-effort per-instance throttle. Serverless instances are recycled, so this
// is a spam dampener, not a guarantee — the honeypot still does most of the work.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const clientIp = (req) => {
  const fwd = req.headers['x-forwarded-for'];
  const first = Array.isArray(fwd) ? fwd[0] : String(fwd ?? '').split(',')[0];
  return (first || req.socket?.remoteAddress || 'unknown').trim();
};

const rateLimited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const declared = Number(req.headers['content-length'] ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return res.status(413).json({ ok: false, error: 'payload_too_large' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ ok: false, error: 'email_not_configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    if (body.length > MAX_BODY_BYTES) {
      return res.status(413).json({ ok: false, error: 'payload_too_large' });
    }
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: 'bad_request' });
    }
  }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ ok: false, error: 'bad_request' });
  }

  // Honeypot — bots fill it, humans never see it. Answer 200 so bots learn nothing.
  if (body.company) return res.status(200).json({ ok: true });

  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const name = String(body.name ?? '').trim().slice(0, MAX_NAME);
  const email = String(body.email ?? '').trim().slice(0, MAX_EMAIL);
  const message = String(body.message ?? '').trim().slice(0, MAX_MESSAGE);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'bad_email' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // v6 returns `{ data, error }` and does NOT throw on API-level rejections
    // (invalid sender, unverified recipient, revoked key). Checking only for a
    // throw would report success while nothing was sent — the exact bug being
    // fixed here.
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio Contact — ${name}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}\n\n` +
        `— Sent from varunbp-portfolio.vercel.app at ${new Date().toISOString()}`,
      html:
        `<p><strong>Name:</strong> ${esc(name)}<br>` +
        `<strong>Email:</strong> ${esc(email)}</p>` +
        `<p>${esc(message).replace(/\n/g, '<br>')}</p>` +
        `<p style="color:#888;font-size:12px">Sent from varunbp-portfolio.vercel.app at ${new Date().toISOString()}</p>`,
    });

    if (error) {
      console.error('[contact] resend rejected the send:', error?.name, error?.message);
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
    return res.status(200).json({ ok: true, id: data?.id ?? null });
  } catch (err) {
    console.error('[contact] transport failure:', err?.name, err?.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}
