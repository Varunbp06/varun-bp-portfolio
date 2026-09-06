import React, { createContext, useCallback, useContext, useState } from 'react';

const NavbarContext = createContext();

/**
 * Navbar visibility is a *stack* (hide/show must balance) instead of a single
 * boolean. Several independent modals (project details, certificate viewer…)
 * each call hideNavbar() on mount and showNavbar() on unmount, so one modal
 * can never silently re-show the navbar while another is still open.
 */
export const NavbarProvider = ({ children }) => {
  const [hideCount, setHideCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hideNavbar = useCallback(() => setHideCount((c) => c + 1), []);
  const showNavbar = useCallback(() => setHideCount((c) => Math.max(0, c - 1)), []);

  const isNavbarVisible = hideCount === 0;

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, hideNavbar, showNavbar, isMenuOpen, setIsMenuOpen }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
