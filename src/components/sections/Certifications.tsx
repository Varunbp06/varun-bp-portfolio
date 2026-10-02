import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { certifications, credentialCounts, credentialStatuses } from '../../data/certifications';
import type { Certification, CredentialStatus } from '../../data/types';
import { useBodyScrollLock } from '../../lib/hooks';
import { cn } from '../../lib/utils';
import FadeIn from '../ui/FadeIn';
import Icon from '../ui/SocialIcon';
import SectionHeading from '../ui/SectionHeading';

type Filter = (typeof credentialStatuses)[number];

const statusStyles: Record<CredentialStatus, string> = {
  earned: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200',
  completed: 'border-[#bbccd7]/35 bg-[#bbccd7]/10 text-[#dbe3ea]',
  open: 'border-white/15 bg-white/[0.03] text-white/55',
};

const statusLabels: Record<CredentialStatus, string> = {
  earned: 'Certificate in hand',
  completed: 'Resume-verified course',
  open: 'Preview — next step',
};

const statusForFilter: Record<Exclude<Filter, 'All'>, CredentialStatus> = {
  Earned: 'earned',
  Completed: 'completed',
  'Next up': 'open',
};

function isFilterMatch(entry: Certification, filter: Filter): boolean {
  if (filter === 'All') return true;
  return entry.status === statusForFilter[filter];
}

function CredentialModal({ entry, onClose }: { entry: Certification; onClose: () => void }) {
  useBodyScrollLock(true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${entry.title} credential`}
      className="fixed inset-0 z-[80] overflow-y-auto px-4 py-10 sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/12 bg-[#0f0f0f]">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <span
              className={cn(
                'inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em]',
                statusStyles[entry.status],
              )}
            >
              {statusLabels[entry.status]}
            </span>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
              {entry.title}
            </h3>
            <p className="mt-1 text-sm text-white/50">
              {entry.issuer} · {entry.dateLabel ?? entry.year} · {entry.level}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close credential"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {entry.asset ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <img
                src={entry.asset}
                alt={`${entry.title} certificate issued by ${entry.issuer}`}
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-contain"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6">
              <p className="text-sm leading-relaxed text-white/55">
                {entry.status === 'completed'
                  ? 'The course is credited on my resume. The original certificate image is not available, so this entry links to the issuer\u2019s official course page rather than reproducing a document.'
                  : 'This is an open program I plan to complete next — shown as a preview, not a credential I hold.'}
              </p>
            </div>
          )}

          <p className="text-sm leading-relaxed text-white/65">{entry.description}</p>

          <div>
            <p className="label-xs mb-3">Topics covered</p>
            <ul className="flex flex-wrap gap-2">
              {entry.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/55"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            {entry.asset ? (
              <a
                href={entry.asset}
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white/85 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
              >
                <Icon name="download" /> Download certificate
              </a>
            ) : null}
            {entry.verifyUrl ? (
              <a
                href={entry.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white/85 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
              >
                Official page <Icon name="external" className="text-xs" />
              </a>
            ) : null}
            {entry.evidenceUrl ? (
              <a
                href={entry.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                Evidence: resume <Icon name="external" className="text-xs" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function Certifications() {
  const [filter, setFilter] = useState<Filter>('All');
  const [open, setOpen] = useState<Certification | null>(null);

  const results = useMemo(
    () => certifications.filter((entry) => isFilterMatch(entry, filter)),
    [filter],
  );

  const summary = [
    { value: credentialCounts.earned, label: 'Certificates in hand' },
    { value: credentialCounts.completed, label: 'Resume-verified courses' },
    { value: credentialCounts.open, label: 'Programs queued next' },
  ];

  return (
    <section id="certifications" className="relative px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Credentials"
          title={
            <>
              Certifications<span className="text-white/25">.</span>
            </>
          }
          subtitle="Five certificates held, resume-verified courses completed, and what I am working toward next — each entry labelled honestly."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {summary.map((item, index) => (
            <FadeIn
              key={item.label}
              delay={index * 0.05}
              className="surface rounded-3xl p-5"
            >
              <p className="text-gradient-soft text-4xl font-extrabold tracking-tight">
                {item.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/50">
                {item.label}
              </p>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter credentials">
          {credentialStatuses.map((status) => (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={filter === status}
              onClick={() => setFilter(status)}
              className={cn(
                'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors duration-300',
                filter === status
                  ? 'border-[#bbccd7] bg-[#bbccd7] text-[#0C0C0C]'
                  : 'border-white/12 bg-white/[0.03] text-white/55 hover:border-white/35 hover:text-white',
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mt-4 text-xs uppercase tracking-[0.16em] text-white/40">
          Showing {results.length} of {certifications.length} credentials
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((entry, index) => (
            <FadeIn
              key={entry.id}
              delay={(index % 3) * 0.04}
              className={cn(
                'surface surface-hover flex flex-col gap-4 rounded-3xl p-6',
                entry.status === 'open' ? 'border-dashed' : undefined,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em]',
                    statusStyles[entry.status],
                  )}
                >
                  {statusLabels[entry.status]}
                </span>
                <span className="text-[11px] uppercase tracking-[0.16em] text-white/30">
                  {entry.year}
                </span>
              </div>

              <div className="flex gap-4">
                {entry.asset && entry.assetKind === 'png' ? (
                  <img
                    src={entry.asset}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-20 shrink-0 rounded-lg border border-white/10 object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm font-bold uppercase tracking-wider text-white/50">
                    {entry.issuer.slice(0, 3)}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug tracking-tight text-white">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/50">
                    {entry.issuer} · {entry.level}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-white/50">{entry.description}</p>

              <ul className="flex flex-wrap gap-1.5">
                {entry.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/45"
                  >
                    {topic}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(entry)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
                >
                  {entry.asset ? 'View certificate' : 'Details'}
                </button>
                {entry.verifyUrl ? (
                  <a
                    href={entry.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/50 transition-colors hover:border-white/35 hover:text-white"
                  >
                    Official page <Icon name="external" className="text-[10px]" />
                  </a>
                ) : null}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {open ? <CredentialModal entry={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}
