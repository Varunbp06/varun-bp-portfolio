import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export const StaggeredMenu = ({
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  colors = ['#0891b2', '#06b6d4'],
  accentColor = '#00ffdc',
  isOpen,
  onMenuClose,
}) => {
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed left-0 top-0 z-[60] h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Sliding color layers */}
          {colors.slice(0, 2).map((color, i) => (
            <motion.div
              key={color}
              className="absolute inset-0"
              style={{ background: color }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 flex flex-col overflow-y-auto p-8 backdrop-blur-[16px] ${
              theme === 'dark' ? 'bg-[#11142F]/80 text-white' : 'bg-white/80 text-slate-800'
            }`}
            style={{ WebkitBackdropFilter: 'blur(16px)' }}
            aria-label="Mobile navigation"
          >
            <div className="mb-6 flex justify-end">
              <button
                onClick={onMenuClose}
                aria-label="Close menu"
                className={`text-4xl transition-colors hover:text-cyan-400 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}
              >
                &times;
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-6">
              <ul className="flex list-none flex-col gap-2" role="list" style={{ counterReset: 'smItem' }}>
                {items.map((it, idx) => (
                  <li key={it.label + idx} className="relative overflow-hidden leading-none">
                    <a
                      href={it.link}
                      onClick={(e) => {
                        e.preventDefault();
                        it.onClick?.(e);
                        onMenuClose();
                      }}
                      className={`font-display relative inline-block cursor-pointer pr-[1.4em] text-[2.5rem] font-semibold uppercase leading-none tracking-[-2px] no-underline transition-colors duration-150 sm:text-[3rem] ${
                        theme === 'dark' ? 'text-white hover:text-[#00ffdc]' : 'text-black hover:text-cyan-600'
                      }`}
                      style={{ counterIncrement: 'smItem' }}
                    >
                      <motion.span
                        initial={{ y: '140%', rotate: 10 }}
                        animate={{ y: 0, rotate: 0 }}
                        exit={{ y: '140%', rotate: 10 }}
                        transition={{ duration: 0.6, delay: 0.25 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block will-change-transform"
                      >
                        {it.label}
                      </motion.span>
                      {displayItemNumbering && (
                        <span
                          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-base font-normal"
                          style={{ color: accentColor, letterSpacing: 0 }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>

              {displaySocials && socialItems.length > 0 && (
                <div className="mt-auto flex flex-col gap-3 pt-8">
                  <h3 className="m-0 text-base font-medium" style={{ color: accentColor }}>
                    Socials
                  </h3>
                  <ul className="flex list-none flex-row flex-wrap items-center gap-4" role="list">
                    {socialItems.map((s, i) => (
                      <li key={s.label + i}>
                        <a
                          href={s.link}
                          target={s.link.startsWith('mailto') ? undefined : '_blank'}
                          rel={s.link.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                          className={`relative inline-block py-[2px] text-[1.2rem] font-medium no-underline transition-[color,opacity] duration-300 ease-linear hover:text-[#00ffdc] ${
                            theme === 'dark' ? 'text-slate-300' : 'text-[#111]'
                          }`}
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};