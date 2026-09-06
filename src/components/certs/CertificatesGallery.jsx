import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaExternalLinkAlt,
  FaTimes,
  FaShieldAlt,
  FaAward,
  FaDownload,
  FaFileAlt,
  FaGraduationCap,
  FaHourglassHalf,
  FaCheckCircle,
  FaInfoCircle,
  FaArrowRight,
} from 'react-icons/fa';
import { useNavbar } from '../../contexts/NavbarContext';
import TiltCard from '../TiltCard';
import { HuggingFaceCertificateSvg, CredentialCover, downloadSvgNodeAsPng } from './CertificateArt';
import { credentialFilters } from '../../data';

const FILENAME = 'Varun-BP-HuggingFace-LLM-Course-Certificate';

/* ---------------- shared status meta ---------------- */
const STATUS_META = {
  earned: { label: 'Earned', cls: 'border-yellow-400/50 bg-yellow-500/20 text-yellow-100', Icon: FaAward },
  completed: { label: 'Completed', cls: 'border-cyan-400/50 bg-cyan-500/20 text-cyan-100', Icon: FaGraduationCap },
  open: { label: 'To earn', cls: 'border-sky-400/50 bg-sky-500/20 text-sky-100', Icon: FaHourglassHalf },
};

// Card frame treatment per state — gold / cyan / slate.
const FRAME = {
  earned: 'border-amber-300/50 group-hover:border-amber-300/80 dark:border-amber-300/30',
  completed: 'border-cyan-400/40 group-hover:border-cyan-300/70 dark:border-cyan-400/25',
  open: 'border-slate-300 group-hover:border-sky-400/60 dark:border-slate-700 dark:group-hover:border-sky-400/50',
};

const StatusChip = ({ status, className = '' }) => {
  const meta = STATUS_META[status] || STATUS_META.open;
  const { label, cls, Icon } = meta;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${cls} ${className}`}>
      <Icon aria-hidden="true" /> {label}
    </span>
  );
};

/* Truthful credibility attributes — only ever true statements, built from data. */
const credibilityFor = (cert) => {
  if (cert.status === 'earned') {
    return [
      'Official certificate in hand',
      'Certificate image available',
      'Downloadable file included',
      `Issued to Varun B P · ${cert.date}`,
    ];
  }
  if (cert.status === 'completed') {
    return [
      'Listed on resume — evidence linked below',
      'Original certificate image unavailable',
      'Official program page linked',
      'No credential ID claimed',
    ];
  }
  return ['Not earned — preview artwork only', cert.cost || 'Free program', 'Official program page linked', 'No completion claimed'];
};

/* Measured document viewer for the earned certificate.
   Measures the real space between the viewer top and the viewport bottom,
   then sizes the sheet in pixels so the WHOLE document is visible on open
   (ratio preserved, never cropped). Zooming grows the sheet and the frame
   scrolls natively for pan. Re-measures after the entrance animation. */
const EarnedDoc = ({ ratio, zoom, hostRef, children }) => {
  const outerRef = useRef(null);
  const [fit, setFit] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      const el = outerRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const availH = Math.max(220, window.innerHeight * 0.92 - top - 20);
      const availW = Math.max(200, el.clientWidth - 24);
      let h = Math.min(availH, 640);
      let w = h * ratio;
      if (w > availW) {
        w = availW;
        h = w / ratio;
      }
      setFit({ w: Math.floor(w), h: Math.floor(h) });
    };
    measure();
    const t1 = setTimeout(measure, 500);
    const t2 = setTimeout(measure, 1000);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
    };
  }, [ratio]);

  return (
    <div
      ref={outerRef}
      className="overflow-auto rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 p-3 shadow-[0_24px_60px_-15px_rgba(31,61,43,0.45)] ring-1 ring-black/5 sm:p-4 dark:from-slate-800 dark:to-slate-900 dark:ring-white/10"
      style={{ minHeight: '220px' }}
    >
      <div className="mx-auto" style={{ width: Math.max(1, fit.w * zoom), height: Math.max(1, fit.h * zoom) }}>
        <div ref={hostRef} className="h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Modal ---------------- */
const CertificateModal = ({ cert, onClose }) => {
  const { hideNavbar, showNavbar } = useNavbar();
  const svgRef = useRef(null);
  const closeRef = useRef(null);
  const [dlState, setDlState] = useState('idle');
  // Doc viewer state (earned certificate): 1 = fit-to-viewport, >1 = zoomed.
  // PNG documents carry their measured file aspect; the SVG replica is read
  // from its viewBox at runtime (portrait/square-safe).
  const [zoom, setZoom] = useState(1);
  const [docRatio, setDocRatio] = useState(cert.aspect || 3 / 2);
  const isEarned = cert.status === 'earned';
  const isOpen = cert.status === 'open';
  const officialUrl = isOpen ? cert.learnUrl : cert.verifyUrl;

  useEffect(() => {
    hideNavbar();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Move focus to the close control for keyboard users.
    const t = setTimeout(() => closeRef.current?.focus?.(), 60);
    // Read the real document aspect ratio from the rendered SVG viewBox so
    // future portrait/square certificates also fit without cropping.
    const r = setTimeout(() => {
      try {
        const svg = svgRef.current?.querySelector?.('svg');
        const vb = svg?.viewBox?.baseVal;
        if (vb && vb.width > 0 && vb.height > 0) setDocRatio(vb.width / vb.height);
      } catch {
        /* keep default 3/2 */
      }
    }, 60);
    return () => {
      showNavbar();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
      clearTimeout(r);
    };
  }, [hideNavbar, showNavbar, onClose]);

  const handleDownloadPng = async () => {
    // svgRef wraps a div; find the actual certificate <svg> inside it.
    const svg = svgRef.current?.querySelector?.('svg');
    if (!svg || dlState === 'working') return;
    setDlState('working');
    await downloadSvgNodeAsPng(svg, `${FILENAME}.png`);
    setDlState('done');
    setTimeout(() => setDlState('idle'), 2500);
  };

  const ctaLabel = isOpen
    ? `Start free program — ${cert.issuer.split(' & ')[0].trim()}`
    : `Open official page — ${cert.issuer.split(' & ')[0].trim()}`;

  const facts = [
    ['Type', cert.credentialType],
    ['Cost', cert.cost],
    ['Certificate', cert.certIssued],
    ['Requirements', cert.requirements],
  ].filter(([, v]) => v);

  // Portalled to document.body so no ancestor transform/filter/backdrop can
  // hijack the fixed overlay's viewport positioning.
  const overlay = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} — ${cert.issuer}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-6 py-4 dark:border-white/10 dark:bg-slate-900">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300">
              {isEarned ? <FaAward aria-hidden="true" /> : !isOpen ? <FaGraduationCap aria-hidden="true" /> : <FaHourglassHalf aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold leading-snug text-slate-800 dark:text-white">{cert.title}</h3>
              <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{cert.issuer}</p>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close credential"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-red-500/15 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-white/10 dark:text-white/80"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatusChip status={cert.status} />
            {cert.category && (
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/15 dark:text-slate-300">
                {cert.category}
              </span>
            )}
            {cert.level && (
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/15 dark:text-slate-300">
                {cert.level}
              </span>
            )}
            {isEarned && (
              <span className="ml-auto flex items-center gap-1.5" role="group" aria-label="Certificate zoom controls">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
                  disabled={zoom <= 1}
                  aria-label="Zoom out"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold text-slate-600 transition-colors hover:border-cyan-400 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-slate-200"
                >
                  −
                </button>
                <span aria-live="polite" className="w-14 text-center font-mono text-xs font-bold text-slate-500 dark:text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
                  disabled={zoom >= 2.5}
                  aria-label="Zoom in"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold text-slate-600 transition-colors hover:border-cyan-400 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-slate-200"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  disabled={zoom === 1}
                  aria-label="Reset zoom to fit screen"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 text-xs font-bold text-cyan-700 transition-colors hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40 dark:text-cyan-300"
                >
                  Fit
                </button>
              </span>
            )}
          </div>

          {isEarned ? (
            <div className="flex flex-col gap-4">
              {/* Document viewer — measured to fit: whole sheet visible on open
                  (ratio preserved, never cropped); zoom enables pan inside. */}
              <EarnedDoc ratio={docRatio} zoom={zoom} hostRef={svgRef}>
                {cert.assetKind === 'svg' ? (
                  <HuggingFaceCertificateSvg className="h-full w-full" />
                ) : (
                  <img
                    src={cert.asset}
                    alt={`${cert.title} certificate issued to Varun B P`}
                    className="h-full w-full rounded object-contain"
                    loading="lazy"
                  />
                )}
              </EarnedDoc>
              {zoom > 1 && (
                <p className="font-mono text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                  Zoomed in — drag or scroll inside the document frame to pan.
                </p>
              )}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-2xl font-mono text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {cert.description} Issued to <span className="font-semibold text-slate-700 dark:text-slate-200">Varun B P</span> · {cert.date}.
                  </p>
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30"
                  >
                    <FaExternalLinkAlt aria-hidden="true" /> {cert.openLabel || 'Open official page'}
                  </a>
                </div>
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                    {cert.assetKind === 'svg'
                      ? 'Save your own copy of the document below — rendered client-side, nothing is uploaded.'
                      : 'The original certificate file, served as issued.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={cert.asset}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-400/60 dark:hover:text-cyan-300"
                    >
                      <FaFileAlt aria-hidden="true" /> Open certificate file
                    </a>
                    {cert.assetKind === 'svg' ? (
                      <button
                        type="button"
                        onClick={handleDownloadPng}
                        disabled={dlState === 'working'}
                        className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/20 dark:text-cyan-300"
                      >
                        <FaDownload aria-hidden="true" />
                        {dlState === 'working' ? 'Rendering…' : dlState === 'done' ? 'Saved ✓' : 'Download PNG'}
                      </button>
                    ) : (
                      <a
                        href={cert.asset}
                        download={cert.downloadName}
                        className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/20 dark:text-cyan-300"
                      >
                        <FaDownload aria-hidden="true" /> Download PNG
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
              {/* Framed document preview + verified program facts */}
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 p-2.5 shadow-[0_24px_50px_-20px_rgba(8,145,178,0.55)] ring-1 ring-cyan-500/25 dark:from-slate-800 dark:to-slate-900">
                  <div className="overflow-hidden rounded-xl">
                    <CredentialCover cert={cert} index={credentialIndex(cert)} large />
                  </div>
                </div>
                {facts.length > 0 && (
                  <dl className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                    {facts.map(([k, v], i) => (
                      <div key={k} className={`grid grid-cols-[110px_1fr] gap-2 px-4 py-2.5 text-xs ${i % 2 ? '' : 'bg-slate-50 dark:bg-white/[0.03]'}`}>
                        <dt className="font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{k}</dt>
                        <dd className="leading-relaxed text-slate-600 dark:text-slate-300">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <h4 className="font-display text-2xl font-bold leading-snug text-slate-800 dark:text-white">{cert.title}</h4>
                  <p className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                  {Array.isArray(cert.topics) && cert.topics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cert.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Credibility — only true attributes, straight from the data */}
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="mb-2.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      <FaShieldAlt aria-hidden="true" /> Credibility
                    </p>
                    <ul className="space-y-1.5">
                      {credibilityFor(cert).map((c) => (
                        <li key={c} className="flex items-start gap-2 text-[13px] leading-snug text-slate-600 dark:text-slate-300">
                          {cert.status === 'open' && c.startsWith('Not earned') ? (
                            <FaInfoCircle aria-hidden="true" className="mt-0.5 flex-shrink-0 text-sky-500" />
                          ) : (
                            <FaCheckCircle aria-hidden="true" className="mt-0.5 flex-shrink-0 text-emerald-500" />
                          )}
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {isOpen ? (
                      <>
                        Status: <span className="font-semibold text-sky-600 dark:text-sky-300">open enrollment</span> — a real, free
                        program from {cert.issuer} that can be completed next. The visual is a clearly labelled concept
                        preview; the genuine credential appears in this slot only once it is earned.
                      </>
                    ) : (
                      <>
                        Completed by <span className="font-semibold">Varun B P</span> as part of his AI &amp; Generative AI learning
                        path — the original certificate image is unavailable, so this slot shows a labelled representation
                        linked to resume evidence and the issuer&apos;s official program page. It is not a re-issued document.
                      </>
                    )}
                  </p>
                  {cert.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{cert.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <FaExternalLinkAlt aria-hidden="true" /> {ctaLabel}
                  </a>
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Opens the issuer's official page for this program — no credential ID is fabricated"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-6 py-3.5 text-sm font-bold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-cyan-300"
                  >
                    <FaShieldAlt aria-hidden="true" /> Verify on issuer site
                  </a>
                  {cert.evidenceUrl && (
                    <a
                      href={cert.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Opens the resume PDF that lists this completed course"
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:text-cyan-300"
                    >
                      <FaFileAlt aria-hidden="true" /> View resume evidence
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(overlay, document.body);
};

/* Deterministic cert → palette mapping so every card keeps its colour. */
function credentialIndex(cert) {
  const ids = ['hf-llm', 'hf-agents', 'hf-context', 'hf-mcp', 'ms-agent', 'da', 'db', 'ms', 'ibm', 'helsinki', 'kaggle', 'mongodb', 'aws', 'cisco', 'google'];
  const i = ids.findIndex((k) => cert.id.startsWith(k));
  return i === -1 ? 0 : i;
}

/* One-line credibility summary shown on each card — truthful only. */
const cardCredibility = (cert) => {
  if (cert.status === 'earned') return 'Official document · downloadable';
  if (cert.status === 'completed') return 'Resume evidence · image unavailable';
  return 'Free to earn · preview only';
};

/* ---------------- Main credential card ----------------
   TOP: document visual · MIDDLE: full title/issuer/meta (never clipped) ·
   BOTTOM: Details / Open / Download actions (valid HTML — actions sit
   outside the preview button). */
const CredentialCard = ({ cert, onOpen }) => {
  const isEarned = cert.status === 'earned';
  const cardRef = useRef(null);
  const officialUrl = cert.status === 'open' ? cert.learnUrl : cert.verifyUrl;

  // Cursor spotlight position (mirrors the S-tier project cards).
  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  }, []);

  return (
    <TiltCard maxTilt={9} scale={1.02} className="group h-full rounded-2xl">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        style={{ '--spot-x': '50%', '--spot-y': '0%' }}
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/10 dark:bg-slate-900 ${FRAME[cert.status] || FRAME.open}`}
      >
        {/* Preview button — TOP visual + MIDDLE text */}
        <button
          type="button"
          onClick={() => onOpen(cert)}
          aria-label={`View ${cert.title} — ${cert.issuer}`}
          className="flex w-full flex-1 cursor-pointer flex-col rounded-t-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
        >
          {/* Issuer band + status */}
          <span className="flex items-center justify-between gap-2 px-4 pt-4">
            <span className="font-mono text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-slate-400 dark:text-slate-500">
              {cert.issuer}
            </span>
            <StatusChip status={cert.status} className="flex-shrink-0 px-2 py-0.5 text-[9px]" />
          </span>

          {/* Framed document preview with hover elevation */}
          <span className="mx-4 mt-3 block flex-shrink-0">
            <span
              className={`relative block aspect-[16/10] w-full overflow-hidden rounded-xl shadow-md ring-1 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_-15px_rgba(8,145,178,0.55)] group-hover:ring-cyan-300/50 ${
                isEarned ? 'bg-[#eef6df] ring-amber-300/60' : 'ring-white/20'
              }`}
            >
              {isEarned ? (
                <span className="absolute inset-0 flex items-center justify-center bg-[#eef6df] p-2">
                  {cert.assetKind === 'svg' ? (
                    <HuggingFaceCertificateSvg className="h-full w-full rounded shadow" />
                  ) : (
                    <img
                      src={cert.asset}
                      alt={`${cert.title} certificate issued to Varun B P`}
                      className="h-full w-full rounded object-contain shadow"
                      loading="lazy"
                    />
                  )}
                </span>
              ) : (
                <span className="absolute inset-0 block">
                  <CredentialCover cert={cert} index={credentialIndex(cert)} />
                </span>
              )}
              {/* hover zoom hint */}
              <span className="absolute bottom-2.5 right-2.5 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white/90 text-cyan-700 opacity-0 shadow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <FaExternalLinkAlt aria-hidden="true" className="text-xs" />
              </span>
            </span>
          </span>

          {/* Glass metadata plate — every letter visible, equalised by min-heights */}
          <span className="mx-4 mb-3 mt-3 block flex-1 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
            <span className="block font-mono text-[10px] font-semibold uppercase leading-relaxed tracking-wider text-cyan-600 dark:text-cyan-400">
              {isEarned ? `${cert.module} · ${cert.date}` : `${cert.category} · ${cert.level}`}
            </span>
            <span className="font-display mt-1 block min-h-[3.75rem] text-[15px] font-bold leading-snug text-slate-800 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
              {cert.title}
            </span>
            <span className="mt-1.5 block">
              {Array.isArray(cert.topics) && cert.topics.length > 0 && (
                <span className="flex flex-wrap gap-1.5">
                  {cert.topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-cyan-500/25 bg-cyan-500/[0.07] px-2 py-0.5 font-mono text-[10px] leading-relaxed text-slate-500 dark:border-cyan-400/20 dark:text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              )}
            </span>
            <span className="mt-2 block font-mono text-[9px] font-semibold uppercase leading-relaxed tracking-widest text-slate-400 dark:text-slate-500">
              {cardCredibility(cert)}
            </span>
          </span>
        </button>

        {/* Cursor spotlight */}
        <span
          aria-hidden="true"
          className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* BOTTOM action row — real links, 44px targets */}
        <span className="relative flex items-center gap-2 border-t border-slate-100 px-4 py-2.5 dark:border-white/10">
          <button
            type="button"
            onClick={() => onOpen(cert)}
            aria-label={`Details for ${cert.title}`}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3 text-xs font-bold text-white shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Details <FaArrowRight aria-hidden="true" className="text-[10px]" />
          </button>
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isEarned ? `Open ${cert.title} program page` : `Open official page for ${cert.title}`}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 text-xs font-bold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-cyan-300"
          >
            <FaExternalLinkAlt aria-hidden="true" className="text-[10px]" /> {isEarned ? 'Verify' : 'Open'}
          </a>
          {isEarned && cert.asset && (
            <a
              href={cert.asset}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Download ${cert.title} certificate file`}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-white/15 dark:text-slate-300 dark:hover:text-cyan-300"
            >
              <FaDownload aria-hidden="true" className="text-[10px]" /> File
            </a>
          )}
        </span>

        {/* Sheen sweep */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      </div>
    </TiltCard>
  );
};

/* ---------------- Compact recommendation row ----------------
   Deliberately NOT a document card — a simple list row so it can
   never be confused with an earned credential. */
const RecommendRow = ({ cert, onOpen }) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 transition-all duration-300 hover:border-sky-400/60 hover:bg-sky-50/60 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-white/[0.02] dark:hover:border-sky-400/40 dark:hover:bg-sky-500/[0.05]">
    <div className="min-w-0 flex-1">
      <p className="flex flex-wrap items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
        <FaHourglassHalf aria-hidden="true" /> To earn · {cert.category} · {cert.level}
      </p>
      <button
        type="button"
        onClick={() => onOpen(cert)}
        aria-label={`View ${cert.title} — ${cert.issuer}`}
        className="mt-1 block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <span className="font-display block text-[15px] font-bold leading-snug text-slate-800 hover:text-cyan-700 dark:text-white dark:hover:text-cyan-300">
          {cert.title}
        </span>
        <span className="mt-0.5 block font-mono text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {cert.issuer} — {cert.topics ? cert.topics.join(' · ') : ''}
        </span>
      </button>
    </div>
    <div className="flex flex-shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => onOpen(cert)}
        className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-4 text-xs font-bold text-slate-600 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-white/15 dark:text-slate-300 dark:hover:text-cyan-300"
      >
        Preview
      </button>
      <a
        href={cert.learnUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Start ${cert.title} on the official ${cert.issuer} site`}
        className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 px-4 text-xs font-bold text-white shadow transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <FaExternalLinkAlt aria-hidden="true" className="text-[10px]" /> Start free
      </a>
    </div>
  </div>
);

/* ---------------- Gallery ---------------- */
const STATUS_FILTERS = { Earned: 'earned', Completed: 'completed', Available: 'open' };

const CertificatesGallery = ({ certs }) => {
  const [openCert, setOpenCert] = useState(null);
  const [filter, setFilter] = useState('All');
  const filters = useMemo(() => credentialFilters, []);

  const matchFilter = useCallback(
    (c) => {
      if (filter === 'All') return true;
      if (STATUS_FILTERS[filter]) return c.status === STATUS_FILTERS[filter];
      return c.category === filter;
    },
    [filter]
  );

  const myCreds = useMemo(
    () =>
      certs
        .filter((c) => c.status !== 'open' && matchFilter(c))
        // Image-bearing earned documents first, then completed — stable order.
        .sort((a, b) => (a.status === b.status ? 0 : a.status === 'earned' ? -1 : 1)),
    [certs, matchFilter]
  );
  const recommended = useMemo(() => certs.filter((c) => c.status === 'open' && matchFilter(c)), [certs, matchFilter]);

  return (
    <>
      {/* Filter bar — status + subject */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter credentials">
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`min-h-[44px] rounded-full border px-4 py-1.5 font-mono text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 ${
                active
                  ? 'border-cyan-500/60 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 shadow-[0_0_18px_-4px_rgba(6,182,212,0.5)] dark:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-cyan-400/50 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:text-cyan-300'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* MY CREDENTIALS — real documents only */}
      {myCreds.length > 0 && (
        <section aria-label="My credentials">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">My credentials</h3>
              <p className="mt-1 font-mono text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Earned documents and resume-verified completions — {myCreds.length} of {certs.filter((c) => c.status !== 'open').length} shown
              </p>
            </div>
          </div>
          <style>{`.spotlight{background:radial-gradient(380px circle at var(--spot-x,50%) var(--spot-y,0%),rgba(34,211,238,0.14),transparent 65%);}@media (prefers-reduced-motion:reduce){.spotlight{display:none;}}`}</style>
          <motion.div layout key={`mine-${filter}`} className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {myCreds.map((cert, i) => (
              <motion.div
                layout
                key={cert.id}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
                className="h-full"
              >
                <CredentialCard cert={cert} onOpen={setOpenCert} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* RECOMMENDED TO EARN — clearly separate, never document-styled */}
      {recommended.length > 0 && (
        <section aria-label="Recommended to earn" className="mt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                Recommended <span className="text-sky-600 dark:text-sky-300">to earn</span>
              </h3>
              <p className="mt-1 max-w-2xl font-mono text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Free official programs I have not completed — previews only, never credentials. {recommended.length} of{' '}
                {certs.filter((c) => c.status === 'open').length} shown.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {recommended.map((cert) => (
              <RecommendRow key={cert.id} cert={cert} onOpen={setOpenCert} />
            ))}
          </div>
        </section>
      )}

      {myCreds.length === 0 && recommended.length === 0 && (
        <p className="py-10 text-center font-mono text-sm text-slate-500 dark:text-slate-400">
          No credentials match this filter yet.
        </p>
      )}

      <AnimatePresence>{openCert && <CertificateModal cert={openCert} onClose={() => setOpenCert(null)} />}</AnimatePresence>
    </>
  );
};

export default CertificatesGallery;
