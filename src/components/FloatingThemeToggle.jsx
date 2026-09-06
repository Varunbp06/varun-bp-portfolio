import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavbar } from '../contexts/NavbarContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const FloatingThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { isMenuOpen } = useNavbar();

  if (isMenuOpen) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed left-5 top-24 z-[70] rounded-full border border-slate-300 bg-slate-200/80 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 dark:border-slate-600 dark:bg-slate-800/80"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <FaSun className="text-xl text-slate-200" /> : <FaMoon className="text-xl text-slate-800" />}
    </button>
  );
};

export default FloatingThemeToggle;