import { useEffect, useState } from 'react';
import Icon from '../ui/SocialIcon';

/**
 * Scroll-to-top control. State flips only when the 700px threshold is
 * crossed, so scrolling itself costs no renders.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shown = false;
    const onScroll = () => {
      const next = window.scrollY > 700;
      if (next !== shown) {
        shown = next;
        setVisible(next);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
      className={`fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#0f0f0f]/95 text-[#bbccd7] transition-all duration-300 ease-editorial hover:border-white/40 hover:text-white sm:bottom-8 sm:right-8 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <Icon name="arrow-up" className="text-lg" />
    </button>
  );
}
