import { useState, type FormEvent } from 'react';
import { profile, socials } from '../../data/profile';
import FadeIn from '../ui/FadeIn';
import Icon from '../ui/SocialIcon';
import SectionHeading from '../ui/SectionHeading';
import ContactButton from '../ui/ContactButton';

type Status = { type: 'success' | 'error'; text: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Web3Forms access key — the same delivery method the earlier portfolio used.
 * It comes from the environment (`VITE_WEB3FORMS_KEY`, set in the Vercel
 * project) and is never hardcoded. A Web3Forms access key is a form key, not a
 * secret, so it is safe for the browser to hold.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

interface FormState {
  name: string;
  email: string;
  message: string;
  /** Honeypot — Web3Forms' own field name. Bots fill it, people never see it. */
  botcheck: string;
}

const emptyForm: FormState = { name: '', email: '', message: '', botcheck: '' };

export default function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  /**
   * Direct email fallback. Carries whatever the visitor already typed so a
   * failed send never costs them their message. Always targets the same inbox
   * the server route uses.
   */
  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    `Portfolio Contact — ${form.name.trim() || 'Website visitor'}`,
  )}&body=${encodeURIComponent(
    `${form.message.trim()}\n\n— ${form.name.trim()}${form.email.trim() ? ` (${form.email.trim()})` : ''}`,
  )}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus({ type: 'error', text: `Copy failed — my email is ${profile.email}` });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.botcheck) return; // honeypot: silently drop bots

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', text: 'Please fill in your name, email and message.' });
      return;
    }
    if (!EMAIL_RE.test(form.email)) {
      setStatus({ type: 'error', text: 'That email address does not look valid.' });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      // Primary delivery: Web3Forms — the method the earlier site used. It is
      // used whenever the access key is present on the deployment.
      if (WEB3FORMS_KEY) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name: form.name,
            email: form.email,
            message: form.message,
            subject: `Portfolio Contact from ${form.name}`,
            from_name: form.name,
            botcheck: form.botcheck,
          }),
        });
        const result = (await response.json().catch(() => null)) as { success?: boolean } | null;

        if (response.ok && result?.success) {
          setStatus({ type: 'success', text: 'Message sent — it lands straight in my inbox.' });
          setForm(emptyForm);
          return;
        }
      }

      // Backup delivery: the same-origin Vercel function (Resend), if it is
      // configured on this deployment. A static host can answer 200 with the
      // SPA fallback page, so only a real JSON { ok: true } counts.
      const fallback = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          company: form.botcheck,
        }),
      }).catch(() => null);
      const data = (await fallback?.json().catch(() => null)) as { ok?: boolean } | null;

      if (fallback?.ok && data?.ok === true) {
        setStatus({ type: 'success', text: 'Message sent — it lands straight in my inbox.' });
        setForm(emptyForm);
        return;
      }

      // Never silently drop a message: hand the visitor a working address.
      setStatus({
        type: 'error',
        text: `Could not send just now — email me at ${profile.email} and I'll reply.`,
      });
    } catch {
      setStatus({
        type: 'error',
        text: `Could not send just now — email me at ${profile.email} and I'll reply.`,
      });
    } finally {
      setSending(false);
    }
  };

  const fieldClass =
    'w-full rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/30 transition-colors duration-300 focus:border-[#bbccd7]/60 focus:outline-none';

  return (
    <section id="contact" className="relative px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build something<span className="text-white/25">.</span>
            </>
          }
          subtitle="Open to Software Engineering and Full Stack / AI Developer roles, and to interesting collaborations."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ---------------- Form ---------------- */}
          <FadeIn className="surface rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold tracking-tight text-white">Send a message</h3>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
              {/* Honeypot — invisible to people, irresistible to bots */}
              <input
                type="text"
                name="botcheck"
                value={form.botcheck}
                onChange={(event) => setForm({ ...form, botcheck: event.target.value })}
                className="hidden"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="label-xs">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="label-xs">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                    className={fieldClass}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="label-xs">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="What are you building, and how can I help?"
                  required
                  className={fieldClass}
                />
              </div>

              {status ? (
                <div
                  role="status"
                  aria-live="polite"
                  className={`text-sm ${status.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}
                >
                  <p>{status.text}</p>
                  {status.type === 'error' ? (
                    <a
                      href={mailtoHref}
                      className="mt-1 inline-flex items-center gap-2 py-1.5 text-xs uppercase tracking-[0.14em] text-white/70 underline underline-offset-4 transition-colors hover:text-white"
                    >
                      <Icon name="mail" /> Email me directly
                    </a>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-4">
                <ContactButton type="submit" disabled={sending}>
                  {sending ? 'Sending…' : 'Send message'}
                </ContactButton>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 py-2 text-xs uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-white"
                >
                  <Icon name={copied ? 'check' : 'mail'} />
                  {copied ? 'Email copied' : 'Copy email instead'}
                </button>
              </div>
            </form>
          </FadeIn>

          {/* ---------------- Details ---------------- */}
          <FadeIn delay={0.08} className="flex flex-col gap-4">
            <div className="surface rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold tracking-tight text-white">Details</h3>
              <ul className="mt-5 flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <Icon name="mail" className="mt-1 text-base text-[#bbccd7]/70" />
                  <span className="flex flex-col">
                    <span className="label-xs">Email</span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-block py-1.5 text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {profile.email}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="phone" className="mt-1 text-base text-[#bbccd7]/70" />
                  <span className="flex flex-col">
                    <span className="label-xs">Phone</span>
                    <a
                      href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}
                      className="inline-block py-1.5 text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {profile.phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="pin" className="mt-1 text-base text-[#bbccd7]/70" />
                  <span className="flex flex-col">
                    <span className="label-xs">Location</span>
                    <span className="text-sm text-white/75">{profile.location}</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="surface rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold tracking-tight text-white">Find me online</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith('mailto') ? undefined : '_blank'}
                      rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors duration-300 hover:border-white/35 hover:bg-white/[0.05]"
                    >
                      <Icon name={social.icon} className="text-lg text-[#bbccd7]/80" />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-white/85">{social.label}</span>
                        <span className="truncate text-[11px] text-white/40">{social.handle}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={profile.resume}
                download={profile.resumeFileName}
                className="mt-5 inline-flex items-center gap-2 py-2 text-xs uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
              >
                <Icon name="download" /> Download resume (PDF)
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
