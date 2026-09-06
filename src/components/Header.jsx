import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavbar } from '../contexts/NavbarContext';
import { useTheme } from '../contexts/ThemeContext';
import { StaggeredMenu } from './StaggeredMenu';
import { profile } from '../data';

const CLIP_PATH = 'polygon(0 0, 100% 0, 100% 85%, 68% 85%, 64% 100%, 36% 100%, 32% 85%, 0 85%)';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const { isNavbarVisible, isMenuOpen, setIsMenuOpen } = useNavbar();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track which section is currently in view (highlights the matching nav link)
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setActiveSection(href);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', href);
  };

  const NavLink = ({ href, children }) => {
    const isActive = activeSection === href;
    return (
      <li>
        <a
          href={href}
          onClick={(e) => handleNavClick(e, href)}
          aria-current={isActive ? 'true' : undefined}
          className={`group relative block py-2 text-base font-bold tracking-wider transition-transform duration-300 hover:scale-110 ${
            isActive ? 'text-cyan-600 dark:text-[#00ffdc]' : 'text-slate-700 dark:text-white'
          }`}
        >
          {children}
          <span
            className={`absolute bottom-1 left-0 block h-[2px] transition-all duration-500 ${
              isActive ? 'w-full bg-cyan-600 dark:bg-[#00ffdc]' : 'w-0 bg-cyan-600 group-hover:w-full dark:bg-[#00ffdc]'
            }`}
          />
        </a>
      </li>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none fixed left-0 top-0 z-50 w-full"
          >
            {/* Animated gradient drop shadow bar */}
            <div
              className="pointer-events-none absolute left-0 right-0 z-10 transition-opacity duration-500"
              style={{
                top: 0,
                height: '85px',
                WebkitClipPath: isMenuOpen ? 'none' : CLIP_PATH,
                clipPath: isMenuOpen ? 'none' : CLIP_PATH,
                background:
                  theme === 'dark'
                    ? 'linear-gradient(90deg, #00fff0, #00ffdc, #4079ff, #38bdf8, #00fff0)'
                    : 'linear-gradient(90deg, #0891b2, #06b6d4, #0891b2, #06b6d4, #0891b2)',
                backgroundSize: '300% 100%',
                animation: 'gradient 6s linear infinite',
                opacity: isScrolled ? 0 : 1,
                filter:
                  theme === 'dark'
                    ? 'drop-shadow(0 16px 24px rgba(56,189,248,0.35))'
                    : 'drop-shadow(0 8px 16px rgba(8,145,178,0.25))',
              }}
            />

              <header
                style={{ WebkitClipPath: isMenuOpen ? 'none' : CLIP_PATH, clipPath: isMenuOpen ? 'none' : CLIP_PATH }}
                className={`pointer-events-auto relative z-20 pt-3 transition-all duration-300 ${isMenuOpen ? 'pb-0' : 'pb-5'} ${
                isMenuOpen
                  ? 'border-b border-slate-200/50 bg-white/80 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#11142F]/80'
                  : isScrolled
                    ? 'border-b border-slate-200 bg-white/85 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#11142F]/90'
                    : 'bg-white dark:bg-[#11142F]'
              }`}
            >
              <nav className="container mx-auto flex flex-wrap items-center justify-between px-1 pb-0">
                {/* Mobile header */}
                <div className="flex w-full items-center justify-between md:hidden">
                  <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3">
                    <img src={profile.photo} alt="Varun B P" className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-cyan-500/50 object-cover" />
                    <div>
                      <span className="font-display block whitespace-nowrap text-sm font-bold text-slate-800 dark:text-[#00ffdc]">Varun B P</span>
                      <span className="font-display block whitespace-nowrap text-[9px] text-slate-600 dark:text-[#00ffdc]">✨ AI/ML Engineer</span>
                    </div>
                  </a>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                    className="pointer-events-auto text-3xl text-slate-800 dark:text-[#00ffdc]"
                  >
                    {isMenuOpen ? '\u00d7' : '\u2630'}
                  </button>
                </div>

                {/* Desktop header */}
                <div className="relative hidden min-h-[48px] w-full grid-cols-3 items-center px-8 md:grid">
                  <ul className="flex list-none items-center gap-8 justify-self-start lg:gap-10">
                    <NavLink href="#home">Home</NavLink>
                    <NavLink href="#projects">Projects</NavLink>
                    <NavLink href="#contact">Contact</NavLink>
                  </ul>

                  <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center justify-self-center gap-3">
                    <img src={profile.photo} alt="Varun B P" className="h-12 w-12 rounded-full border-2 border-cyan-500/50 object-cover" />
                    <div className="block">
                      <span className="font-display block text-base font-bold text-slate-800 dark:text-[#00ffdc]">Varun B P</span>
                      <span className="font-display block text-[10px] text-slate-600 dark:text-[#00ffdc]">✨ AI/ML Engineer</span>
                    </div>
                  </a>

                  <ul className="flex list-none items-center justify-self-end gap-8 lg:gap-10">
                    <NavLink href="#skills">Skills</NavLink>
                    <NavLink href="#about">About</NavLink>
                  </ul>
                </div>
              </nav>
            </header>
          </motion.div>
        )}
      </AnimatePresence>

      <StaggeredMenu
        isOpen={isMenuOpen}
        onMenuClose={() => setIsMenuOpen(false)}
        items={NAV_ITEMS.map((item) => ({
          label: item.label,
          link: item.href,
          onClick: (e) => handleNavClick(e, item.href),
        }))}
        socialItems={[
          { label: 'GitHub', link: profile.github },
          { label: 'LinkedIn', link: profile.linkedin },
          { label: 'Email', link: `mailto:${profile.email}` },
        ]}
        displaySocials
        displayItemNumbering
        colors={['#0891b2', '#06b6d4', '#155e75']}
        accentColor="#00ffdc"
      />

      <style>{`html { scroll-behavior: smooth; } @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>
    </>
  );
};

export default Header;
