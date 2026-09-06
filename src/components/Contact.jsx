import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPaperPlane, FaUser, FaComment, FaMapMarkerAlt } from 'react-icons/fa';
import { profile } from '../data';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      // Only trust a real JSON { ok: true } — a static host may answer 200
      // with the SPA fallback page, which must NOT count as delivered.
      const data = await r.json().catch(() => null);
      if (r.ok && data && data.ok === true) {
        setStatus({ type: 'success', text: 'Message sent — it will land directly in my inbox. Thank you!' });
        setForm({ name: '', email: '', message: '', company: '' });
      } else {
        // Direct delivery unavailable — fall back to the visitor's email app.
        openMailClient();
        setStatus({ type: 'success', text: 'Your email client should open — press send to deliver your message.' });
        setForm({ name: '', email: '', message: '', company: '' });
      }
    } catch {
      openMailClient();
      setStatus({ type: 'success', text: 'Your email client should open — press send to deliver your message.' });
      setForm({ name: '', email: '', message: '', company: '' });
    } finally {
      setSending(false);
    }
  };

  const socialLinks = [
    { name: 'GitHub', icon: <FaGithub />, url: profile.github, gradient: 'from-gray-600 to-gray-800', hover: 'hover:shadow-gray-500/25' },
    { name: 'LinkedIn', icon: <FaLinkedin />, url: profile.linkedin, gradient: 'from-blue-500 to-indigo-600', hover: 'hover:shadow-blue-500/25' },
    { name: 'Email', icon: <FaEnvelope />, url: `mailto:${profile.email}`, gradient: 'from-cyan-500 to-teal-600', hover: 'hover:shadow-cyan-500/25' },
  ];

  const infoCards = [
    { icon: <FaEnvelope />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: <FaPhone />, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: <FaMapMarkerAlt />, label: 'Location', value: profile.location },
  ];

  return (
    /* Nested inside Home's own <section id="contact">, so no duplicate id here. */
    <section className="relative min-h-screen overflow-hidden px-4 py-20 pb-32">
      {/* Floating background elements */}
      <div className="absolute left-10 top-20 h-20 w-20 animate-pulse rounded-full bg-cyan-500/10 blur-xl" />
      <div className="absolute bottom-20 right-10 h-32 w-32 animate-pulse rounded-full bg-blue-500/10 blur-xl" />
      <div className="absolute left-1/4 top-1/2 h-16 w-16 animate-pulse rounded-full bg-sky-500/10 blur-xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-20 text-center"
        >
          <h2 className="font-display mb-4 text-5xl font-bold md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">GET IN</span>{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">TOUCH</span>
          </h2>
          <p className="font-mono text-lg text-slate-600 dark:text-slate-300">
            Have a project in mind or want to collaborate? Let's talk.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900/60 md:p-10"
          >
            <h3 className="font-display mb-6 text-2xl font-bold text-slate-800 dark:text-white">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot — invisible to humans, catches bots */}
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                  aria-label="Your Name"
                />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                  aria-label="Your Email"
                />
              </div>
              <div className="relative">
                <FaComment className="absolute left-4 top-5 -translate-y-1/2 text-slate-400" />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                  aria-label="Your Message"
                />
              </div>
              {status && (
                <p role="status" aria-live="polite" className={`font-mono text-sm ${status.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {status.text}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/25 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <FaPaperPlane className="transition-transform duration-300 group-hover:translate-x-1" />
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Contact info + socials */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900/60">
              <h3 className="font-display mb-6 text-2xl font-bold text-slate-800 dark:text-white">Contact Info</h3>
              <div className="space-y-4">
                {infoCards.map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="font-medium text-slate-700 transition-colors hover:text-cyan-600 dark:text-slate-200 dark:hover:text-cyan-300">
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium text-slate-700 dark:text-slate-200">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900/60">
              <h3 className="font-display mb-6 text-2xl font-bold text-slate-800 dark:text-white">Find Me Online</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target={social.url.startsWith('mailto') ? undefined : '_blank'}
                    rel={social.url.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className={`group flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br ${social.gradient} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 ${social.hover}`}
                  >
                    <div className="text-3xl">{social.icon}</div>
                    <span className="font-semibold">{social.name}</span>
                  </a>
                ))}
              </div>
              <p className="mt-6 font-mono text-sm text-slate-500 dark:text-slate-400">
                {profile.linkedinHandle} · {profile.githubHandle}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;