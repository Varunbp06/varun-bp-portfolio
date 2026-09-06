import React from 'react';

/**
 * Faithful SVG replica of Varun's real "Certificate of Achievement" issued by
 * Hugging Face Instructors for The LLM Course (module: 1. Fundamentals of LLMs),
 * dated 2026-07-06. Self-contained vector art — crisp at any size, no external
 * image needed, and safe to embed in light or dark themes.
 *
 * The same design also ships as a static asset at
 * /certificates/hf-llm-course-certificate.svg (keep the two in sync).
 */
export const HuggingFaceCertificateSvg = ({ className = '' }) => {
  // Unique id per mounted instance so a card + open modal never share defs.
  const uid = (React.useId() || 'hf').replace(/[^a-zA-Z0-9]/g, '');
  const bgId = `hf-bg-${uid}`;
  const bannerId = `hf-banner-${uid}`;
  const sealId = `hf-seal-${uid}`;
  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const ink = '#1f3d2b';
  const gold = '#c9a227';

  return (
    <svg
      viewBox="0 0 1200 800"
      className={className}
      role="img"
      aria-label="Certificate of Achievement — The LLM Course — Varun B P, Hugging Face Instructors, 2026-07-06"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3f4b8" />
          <stop offset="55%" stopColor="#e4eeb6" />
          <stop offset="100%" stopColor="#c6e7bd" />
        </linearGradient>
        <linearGradient id={bannerId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2e5b16" />
          <stop offset="50%" stopColor="#4a7c28" />
          <stop offset="100%" stopColor="#2e5b16" />
        </linearGradient>
        <radialGradient id={sealId} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="100%" stopColor="#e8eef0" />
        </radialGradient>
      </defs>

      {/* Paper */}
      <rect width="1200" height="800" rx="14" fill={`url(#${bgId})`} />

      {/* Outer golden frame */}
      <rect x="22" y="22" width="1156" height="756" rx="8" fill="none" stroke={gold} strokeWidth="6" />
      {/* Inner golden frame */}
      <rect x="38" y="38" width="1124" height="724" rx="6" fill="none" stroke={gold} strokeWidth="2.5" />

      {/* Corner flourishes */}
      {[
        'M 46 66 C 76 50 96 50 122 46 C 118 72 118 92 102 122',
        'M 1154 66 C 1124 50 1104 50 1078 46 C 1082 72 1082 92 1098 122',
        'M 46 734 C 76 750 96 750 122 754 C 118 728 118 708 102 678',
        'M 1154 734 C 1124 750 1104 750 1078 754 C 1082 728 1082 708 1098 678',
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      ))}

      {/* ===== Header ===== */}
      <text x="600" y="212" textAnchor="middle" fontFamily={serif} fontSize="58" fontWeight="bold" fill={ink}>
        Certificate of Achievement
      </text>
      <text x="600" y="272" textAnchor="middle" fontFamily={serif} fontSize="36" fill="#2e5b16" letterSpacing="1">
        The LLM Course
      </text>
      <rect x="400" y="292" width="400" height="2.5" fill={gold} opacity="0.7" />

      <text x="600" y="356" textAnchor="middle" fontFamily={sans} fontSize="19" fill={ink} letterSpacing="7">
        THIS IS TO CERTIFY THAT
      </text>

      {/* ===== Recipient ===== */}
      <text x="600" y="462" textAnchor="middle" fontFamily={serif} fontSize="78" fontWeight="bold" fill={ink}>
        Varun B P
      </text>
      {/* Divider with vertical cap ticks */}
      <line x1="370" y1="492" x2="830" y2="492" stroke={ink} strokeWidth="1.6" />
      <line x1="368" y1="482" x2="368" y2="502" stroke={ink} strokeWidth="2.4" />
      <line x1="832" y1="482" x2="832" y2="502" stroke={ink} strokeWidth="2.4" />

      {/* ===== Statement ===== */}
      <text x="600" y="556" textAnchor="middle" fontFamily={sans} fontSize="25" fill={ink}>
        Has successfully completed
      </text>
      <text x="600" y="608" textAnchor="middle" fontFamily={sans} fontSize="31" fontWeight="bold" fill="#2e5b16">
        1. Fundamentals of LLMs
      </text>
      <text x="600" y="652" textAnchor="middle" fontFamily={sans} fontSize="22" fill={ink}>
        of <tspan fontWeight="bold">The LLM Course</tspan>
      </text>

      {/* ===== Footer: seal (left), emoji medallion (center), date (right) ===== */}
      {/* Left — seal + instructor */}
      <g transform="translate(230, 700)">
        {/* notched outer ring with stars */}
        <circle cx="0" cy="0" r="52" fill="#3a3f44" />
        <circle cx="0" cy="0" r="46" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 3" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 41} cy={Math.sin(a) * 41} r="1.7" fill="#fff" />;
        })}
        <circle cx="0" cy="0" r="34" fill={`url(#${sealId})`} />
        <circle cx="0" cy="0" r="34" fill="none" stroke="#3a3f44" strokeWidth="1" />
        <text x="0" y="-6" textAnchor="middle" fontFamily={sans} fontSize="13" fontWeight="bold" fill="#2e5b16">
          The LLM
        </text>
        <text x="0" y="10" textAnchor="middle" fontFamily={sans} fontSize="13" fontWeight="bold" fill="#2e5b16">
          Course
        </text>
      </g>
      <text x="230" y="776" textAnchor="middle" fontFamily={sans} fontSize="19" fontWeight="bold" fill={ink}>
        Hugging Face
      </text>
      <text x="230" y="794" textAnchor="middle" fontFamily={sans} fontSize="17" fill={ink}>
        Instructors
      </text>

      {/* Center — hugging emoji medallion */}
      <circle cx="600" cy="700" r="46" fill="#f2c94c" />
      <circle cx="600" cy="700" r="46" fill="none" stroke="#fff" strokeWidth="6" />
      <circle cx="600" cy="700" r="40" fill="none" stroke="#c9a227" strokeWidth="2" />
      <text x="600" y="716" textAnchor="middle" fontSize="40">
        🤗
      </text>

      {/* Right — date */}
      <line x1="884" y1="690" x2="1040" y2="690" stroke={ink} strokeWidth="1.6" />
      <text x="962" y="682" textAnchor="middle" fontFamily={sans} fontSize="24" fontWeight="bold" fill={ink}>
        2026-07-06
      </text>
      <text x="962" y="776" textAnchor="middle" fontFamily={sans} fontSize="18" fill={ink}>
        Date
      </text>
    </svg>
  );
};

/** Trigger a browser download for a Blob. */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Rasterize a rendered certificate <svg> node to a high-res PNG and download
 * it. Falls back to downloading the raw SVG if rasterization fails (e.g. an
 * exotic font/environment). Client-side only — nothing is uploaded anywhere.
 */
export async function downloadSvgNodeAsPng(node, filename = 'certificate.png') {
  try {
    // Accept either the <svg> itself or a wrapper element containing one.
    const svgNode = node?.tagName?.toLowerCase() === 'svg' ? node : node?.querySelector?.('svg');
    if (!svgNode) throw new Error('No SVG element found');
    const clone = svgNode.cloneNode(true);
    const vb = svgNode.viewBox?.baseVal || { width: 1200, height: 800 };
    const width = 2000;
    const height = Math.round((width * vb.height) / vb.width);
    clone.setAttribute('width', String(width));
    clone.setAttribute('height', String(height));
    clone.removeAttribute('class');
    clone.removeAttribute('style');
    const xml = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('SVG raster load failed'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);

    const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!pngBlob) throw new Error('toBlob returned null');
    triggerDownload(pngBlob, filename);
  } catch {
    // Fallback: hand over the original SVG document instead.
    const target = node?.tagName?.toLowerCase() === 'svg' ? node : node?.querySelector?.('svg') || node;
    const xml = new XMLSerializer().serializeToString(target);
    triggerDownload(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }), filename.replace(/\.png$/i, '.svg'));
  }
}

/**
 * Premium (non-document) cover art for course credentials.
 * A framed blue/futuristic concept dossier — provider, title, topics, level —
 * deliberately NOT a fake "official certificate" document. A solid state band
 * at the bottom keeps every unearned entry clearly marked:
 *   completed → "CERTIFICATE IMAGE UNAVAILABLE · RESUME-VERIFIED"
 *   open      → "PREVIEW — NOT EARNED"
 * Accepts either a full `cert` object or legacy `monogram`/`index` props.
 */
export const CredentialCover = ({ cert = null, monogram = 'AI', index = 0, large = false, topPad = false }) => {
  const c = cert || {};
  const label = c.monogram || monogram || 'AI';
  // Short provider badge: first letters of first two words (e.g. "DeepLearning.AI & OpenAI" -> "DO").
  const badge = label.length <= 3
    ? label
    : label
        .split(/[\s&/]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
  const palettes = [
    { from: '#0a2540', via: '#0b3b5e', to: '#0891b2', accent: '#22d3ee', glow: 'rgba(34,211,238,0.45)', line: '#164e63' },
    { from: '#0b1035', via: '#1e2a78', to: '#4079ff', accent: '#93c5fd', glow: 'rgba(64,121,255,0.50)', line: '#1e3a8a' },
    { from: '#082f2e', via: '#0b4f4a', to: '#00b3a4', accent: '#5eead4', glow: 'rgba(0,255,220,0.35)', line: '#134e4a' },
    { from: '#160b35', via: '#3b2a78', to: '#7c3aed', accent: '#c4b5fd', glow: 'rgba(139,92,246,0.45)', line: '#2e1a5e' },
    { from: '#0a1f33', via: '#0e3a5e', to: '#0284c7', accent: '#7dd3fc', glow: 'rgba(56,189,248,0.45)', line: '#0c4a6e' },
    { from: '#0f2537', via: '#155e75', to: '#0e7490', accent: '#a5f3fc', glow: 'rgba(103,232,249,0.40)', line: '#164e63' },
  ];
  const p = palettes[index % palettes.length];
  const topics = Array.isArray(c.topics) ? c.topics.slice(0, 3) : [];
  const isCompleted = (c.status || 'open') === 'completed';
  const statusLine = isCompleted ? 'Certificate image unavailable · resume-verified' : 'Preview — not earned';

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${p.from} 0%, ${p.via} 52%, ${p.to} 130%)` }}
    >
      {/* radial glows */}
      <div className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full opacity-50 blur-3xl" style={{ background: p.glow }} />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full opacity-30 blur-3xl" style={{ background: p.glow }} />
      {/* circuit lines */}
      <svg viewBox="0 0 400 250" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-25" fill="none" stroke={p.accent} strokeWidth="1">
        <path d="M -10 200 L 90 200 L 120 170 L 250 170" opacity="0.6" />
        <path d="M 410 40 L 310 40 L 280 70 L 160 70" opacity="0.45" />
        <circle cx="90" cy="200" r="3" fill={p.accent} stroke="none" opacity="0.8" />
        <circle cx="310" cy="40" r="3" fill={p.accent} stroke="none" opacity="0.8" />
        <circle cx="250" cy="170" r="2.5" fill="none" opacity="0.7" />
        <circle cx="160" cy="70" r="2.5" fill="none" opacity="0.7" />
      </svg>
      {/* dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}
      />
      {/* glass shine */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/12 to-transparent" />
      {/* document frame */}
      <div className="pointer-events-none absolute inset-2 rounded-lg border border-white/25" />
      <div className="pointer-events-none absolute inset-3 rounded-md border border-white/10" />
      {['left-2 top-2', 'right-2 top-2', 'left-2 bottom-2', 'right-2 bottom-2'].map((pos) => (
        <span key={pos} aria-hidden="true" className={`pointer-events-none absolute ${pos} h-2.5 w-2.5 border-white/70`} style={{ borderWidth: 0, borderTopWidth: pos.includes('top') ? 2 : 0, borderBottomWidth: pos.includes('bottom') ? 2 : 0, borderLeftWidth: pos.includes('left') ? 2 : 0, borderRightWidth: pos.includes('right') ? 2 : 0 }} />
      ))}

      {/* top row */}
      <div className={`relative flex items-center gap-1.5 ${large ? 'p-5 pb-0' : 'p-3 pb-0'}`}>
        <span
          className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 font-mono font-bold text-white backdrop-blur-md ${large ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]'}`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: p.accent }} />
          {badge}
        </span>
        {c.category && (
          <span className={`min-w-0 rounded-md bg-black/25 font-mono font-semibold uppercase text-white/85 backdrop-blur-sm ${large ? 'px-2 py-1 text-[10px] tracking-wider' : 'px-1.5 py-0.5 text-[8px] leading-relaxed tracking-wider'}`}>
            {c.category}
          </span>
        )}
        {c.level && (
          <span className={`ml-auto flex-shrink-0 rounded-md border border-white/20 font-mono text-white/75 ${large ? 'px-2 py-1 text-[10px]' : 'px-1.5 py-0.5 text-[8px] leading-relaxed'}`}>
            {c.level}
          </span>
        )}
      </div>

      {/* middle — full-length title uses a smaller size so long course names fit */}
      <div className={`relative ${large ? 'px-5' : 'px-4'}`}>
        <p className={`font-display font-bold leading-snug text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${large ? 'text-2xl' : 'text-[13px]'} line-clamp-3`}>
          {c.title || 'Credential Preview'}
        </p>
        {c.issuer && (
          <p className={`mt-1 font-mono leading-relaxed text-white/70 ${large ? 'text-xs' : 'text-[10px]'}`}>{c.issuer}</p>
        )}
        {topics.length > 0 && (
          <div className={`flex flex-wrap gap-1 ${large ? 'mt-3' : 'mt-1.5'}`}>
            {topics.map((t) => (
              <span
                key={t}
                className={`rounded-full border bg-white/10 font-mono font-medium leading-relaxed text-cyan-50 backdrop-blur-sm ${large ? 'border-white/25 px-2.5 py-1 text-[10px]' : 'border-white/20 px-1.5 py-px text-[8px]'}`}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* bottom state band — the honesty label, impossible to miss */}
      <div
        className={`relative mt-1 flex items-center gap-1.5 border-t backdrop-blur-sm ${
          large ? 'px-5 py-2.5' : 'px-3 py-1.5'
        } ${isCompleted ? 'border-cyan-200/30 bg-cyan-950/55' : 'border-white/15 bg-black/45'}`}
      >
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}` }} />
        <span className={`font-mono font-bold uppercase leading-relaxed text-white ${large ? 'text-[10px] tracking-[0.16em]' : 'text-[8px] tracking-[0.14em]'}`}>
          {statusLine}
        </span>
      </div>
    </div>
  );
};
