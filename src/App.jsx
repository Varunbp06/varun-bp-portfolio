import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Squares from './components/Squares';
import PointerGlow from './components/PointerGlow';
import { NavbarProvider } from './contexts/NavbarContext';
import { useTheme } from './contexts/ThemeContext';
import FloatingThemeToggle from './components/FloatingThemeToggle';
import Home from './pages/Home';

function App() {
  const { theme } = useTheme();

  return (
    <NavbarProvider>
      <div className="relative min-h-screen overflow-hidden bg-slate-50 transition-colors duration-500 dark:bg-[#030817]">
        {/* Global animated grid background */}
        <div className="fixed inset-0 z-0">
          <Squares
            speed={0.2}
            squareSize={35}
            direction="diagonal"
            borderColor={theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.05)'}
            hoverFillColor={theme === 'dark' ? 'rgba(37, 121, 255, 0.5)' : 'rgba(8, 145, 178, 0.1)'}
            gradientColorStart={theme === 'dark' ? '#020617' : '#f1f5f9'}
            gradientColorEnd={theme === 'dark' ? '#0b1e4b' : '#e2e8f0'}
          />
        </div>

        {/* Ambient cursor-reactive blue light (desktop, fine pointer only) */}
        <PointerGlow />

        <Header />

        <main id="main" className="relative">
          <AnimatePresence mode="wait">
            <Home />
          </AnimatePresence>
        </main>

        <FloatingThemeToggle />
      </div>
    </NavbarProvider>
  );
}

export default App;