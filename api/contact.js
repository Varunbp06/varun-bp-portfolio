import { Resend } from 'resend';

const TO = 'varunbpvarunbp@gmail.com';
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ ok: false, error: 'email_not_configured' });
  }
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: 'bad_request' });
    }
  }
  const name = String(body?.name ?? '').trim().slice(0, 100);
  const email = String(body?.email ?? '').trim().slice(0, 150);
  const message = String(body?.message ?? '').trim().slice(0, 5000);
  // Honeypot — bots fill it, humans never see it.
  if (body?.company) return res.status(200).json({ ok: true });
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'bad_email' });
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: TO,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio contact from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
      html: `<p>${esc(message).replace(/\n/g, '<br>')}</p><p>— ${esc(name)} (${esc(email)})</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}
