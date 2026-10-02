import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { EASE } from '../../lib/motion';
import { navItems, profile } from '../../data/profile';
import { useActiveSection, useBodyScrollLock, useMounted, useScrolled } from '../../lib/hooks';
import { cn, scrollToSection } from '../../lib/utils';
import Icon from '../ui/SocialIcon';

const ids = navItems.map((item) => item.id);

interface NavbarProps {
  onOpenPalette: () => void;
}

export default function Navbar({ onOpenPalette }: NavbarProps) {
  const active = useActiveSection(ids);
  const scrolled = useScrolled(24);
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);
  useBodyScrollLock(menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        {/* The header must stay hit-testable: the fixed wrapper is
            pointer-events-none so the page beneath stays clickable. */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className={cn(
            'pointer-events-auto mx-auto flex max-w-[1600px] items-center justify-between gap-4',
            'px-4 py-4 transition-all duration-500 ease-editorial sm:px-6 lg:px-10',
            scrolled
              ? 'border-b border-white/10 bg-[#0C0C0C]/92 py-3'
              : 'border-b border-transparent',
          )}
        >
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'auto'
                  : 'smooth',
              });
            }}
            className="group flex flex-col py-1.5 leading-none"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
              {profile.name}
            </span>
            <span className="mt-1 hidden text-[10px] uppercase tracking-[0.18em] text-white/40 sm:block">
              Software Engineer · Full Stack · AI
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      go(item.id);
                    }}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={cn(
                      'rounded-full px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 xl:px-3 xl:text-[12px]',
                      active === item.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 xl:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
                Open to Work
              </span>
            </span>

            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/55 transition-colors duration-300 hover:border-white/30 hover:text-white sm:inline-flex"
              aria-label="Open command palette"
            >
              <Icon name="search" className="text-sm" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="ml-1 hidden rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/45 xl:inline">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors duration-300 hover:border-white/30 hover:text-white lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
            >
              <Icon name="menu" className="text-base" />
              Menu
            </button>
          </div>
        </motion.div>
      </header>

      {mounted && menuOpen
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-0 z-[70] flex flex-col bg-[#0C0C0C]"
            >
              <div className="flex items-center justify-between px-5 py-5">
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
                  {profile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  autoFocus
                  aria-label="Close navigation menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80"
                >
                  <Icon name="close" className="text-lg" />
                </button>
              </div>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-10">
                <ul className="flex flex-col divide-y divide-white/8">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          go(item.id);
                        }}
                        className="flex items-center justify-between py-4 text-2xl font-semibold text-white/85 transition-colors hover:text-white"
                      >
                        {item.label}
                        <Icon name="arrow-right" className="text-base text-white/35" />
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPalette();
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white"
                  >
                    <Icon name="search" /> Search
                  </button>
                  <a
                    href={profile.resume}
                    download={profile.resumeFileName}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white"
                  >
                    <Icon name="download" /> Resume
                  </a>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white"
                  >
                    <Icon name="github" /> GitHub
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-white"
                  >
                    <Icon name="linkedin" /> LinkedIn
                  </a>
                </div>
                <p className="mt-8 text-xs text-white/40">{profile.openToWork}</p>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
