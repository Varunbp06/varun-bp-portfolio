import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import CommandPalette from './components/layout/CommandPalette';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import ProgressBar from './components/layout/ProgressBar';
import ScrollToTop from './components/layout/ScrollToTop';
import Marquee from './components/ui/Marquee';
import About from './components/sections/About';
import Achievements from './components/sections/Achievements';
import Capabilities from './components/sections/Capabilities';
import Certifications from './components/sections/Certifications';
import Contact from './components/sections/Contact';
import Education from './components/sections/Education';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    // `reducedMotion="user"` makes every Framer Motion transform animation a
    // no-op for visitors who asked for reduced motion — content stays visible.
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <ProgressBar />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ScrollToTop />

      <div id="top" className="relative overflow-x-clip bg-[#0C0C0C]">
        <main id="main">
          <Hero />
          <Marquee />
          <About />
          <Capabilities />
          <Projects />
          <Skills />
          <Education />
          <Certifications />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
