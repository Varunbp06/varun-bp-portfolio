import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { navItems, profile } from '../../data/profile';
import { useBodyScrollLock, useMounted } from '../../lib/hooks';
import { cn, scrollBehavior, scrollToSection } from '../../lib/utils';
import Icon from '../ui/SocialIcon';

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: 'arrow-right' | 'download' | 'github' | 'linkedin' | 'mail';
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Ctrl/⌘K palette. Arrow keys move, Enter runs, Escape closes, focus returns
 * to whatever was focused before opening.
 */
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const mounted = useMounted();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  useBodyScrollLock(open);

  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = [
      {
        id: 'home',
        label: 'Home',
        hint: 'Top of page',
        icon: 'arrow-right',
        run: () => window.scrollTo({ top: 0, behavior: scrollBehavior() }),
      },
      ...navItems.map<Command>((item) => ({
        id: item.id,
        label: item.label,
        hint: 'Section',
        icon: 'arrow-right',
        run: () => scrollToSection(item.id),
      })),
      {
        id: 'resume',
        label: 'Resume',
        hint: 'Download PDF',
        icon: 'download',
        run: () => {
          window.open(profile.resume, '_blank', 'noopener');
        },
      },
      {
        id: 'github',
        label: 'GitHub',
        hint: profile.githubHandle,
        icon: 'github',
        run: () => window.open(profile.github, '_blank', 'noopener'),
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        hint: profile.linkedinHandle,
        icon: 'linkedin',
        run: () => window.open(profile.linkedin, '_blank', 'noopener'),
      },
      {
        id: 'email',
        label: 'Copy email address',
        hint: profile.email,
        icon: 'mail',
        run: () => {
          void navigator.clipboard?.writeText(profile.email);
        },
      },
    ];
    return navCommands;
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter(
      (command) =>
        command.label.toLowerCase().includes(term) || command.hint.toLowerCase().includes(term),
    );
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setIndex(0);
    inputRef.current?.focus();
    return () => restoreRef.current?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setIndex((value) => (results.length ? (value + 1) % results.length : 0));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setIndex((value) =>
          results.length ? (value - 1 + results.length) % results.length : 0,
        );
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const command = results[index];
        if (command) {
          onClose();
          command.run();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, results, index]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/75" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/12 bg-[#0f0f0f] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <Icon name="search" className="text-base text-white/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            placeholder="Jump to a section or link…"
            aria-label="Search commands"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
          />
          <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/40">
            Esc
          </kbd>
        </div>
        <ul role="listbox" aria-label="Commands" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-white/45">No matches</li>
          ) : (
            results.map((command, position) => (
              <li key={command.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={position === index}
                  onMouseEnter={() => setIndex(position)}
                  onClick={() => {
                    onClose();
                    command.run();
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200',
                    position === index ? 'bg-white/10 text-white' : 'text-white/70',
                  )}
                >
                  <Icon name={command.icon} className="text-base text-white/50" />
                  <span className="flex-1 text-sm font-medium">{command.label}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                    {command.hint}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
