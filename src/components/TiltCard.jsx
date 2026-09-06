import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * TiltCard — pointer-driven 3D tilt + glare, CSS/DOM based (no WebGL cost).
 * Anti-lag by design:
 *  - only enables on devices with a fine pointer (mouse/trackpad),
 *  - respects prefers-reduced-motion,
 *  - no rAF loop — handlers run only while the pointer is inside the card,
 *  - uses transform + a single style update per move event via rAF throttling.
 */
const TiltCard = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.015,
  glare = true,
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const frame = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [transform, setTransform] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, o: 0 });

  useEffect(() => {
    const mqFine = window.matchMedia('(pointer: fine)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqWidth = window.matchMedia('(min-width: 1024px)');
    const update = () => setEnabled(mqFine.matches && !mqMotion.matches && mqWidth.matches);
    update();
    mqFine.addEventListener?.('change', update);
    mqMotion.addEventListener?.('change', update);
    mqWidth.addEventListener?.('change', update);
    return () => {
      mqFine.removeEventListener?.('change', update);
      mqMotion.removeEventListener?.('change', update);
      mqWidth.removeEventListener?.('change', update);
    };
  }, []);

  const onMove = useCallback(
    (e) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rx = (0.5 - py) * maxTilt;
        const ry = (px - 0.5) * maxTilt;
        setTransform(`perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`);
        setGlarePos({ x: px * 100, y: py * 100, o: 1 });
      });
    },
    [enabled, maxTilt, scale]
  );

  const onLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    setTransform('');
    setGlarePos((g) => ({ ...g, o: 0 }));
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative will-change-transform ${className}`}
      style={{ transform, transition: 'transform 0.18s ease-out', transformStyle: 'preserve-3d', ...style }}
      {...rest}
    >
      {children}
      {glare && enabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: glarePos.o,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.16), transparent 55%)`,
          }}
        />
      )}
    </div>
  );
};

export default TiltCard;
