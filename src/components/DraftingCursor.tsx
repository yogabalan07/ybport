import React, { useEffect, useRef, useState } from 'react';

export const DraftingCursor: React.FC = () => {
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);

  useEffect(() => {
    // Only enable if pointer is fine (desktop mouse) and the user has not
    // asked for reduced motion (cursor effects are decorative).
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const applyEnabled = (fine: boolean) => {
      setIsFinePointer(fine && !motionQuery.matches);
    };
    applyEnabled(mediaQuery.matches);

    const handlePointerTypeChange = (e: MediaQueryListEvent) => {
      applyEnabled(e.matches);
    };
    const handleMotionChange = () => {
      applyEnabled(mediaQuery.matches);
    };
    mediaQuery.addEventListener('change', handlePointerTypeChange);
    motionQuery.addEventListener('change', handleMotionChange);

    // Position is written directly to the DOM inside a requestAnimationFrame
    // (coalesced to one write per frame) so mousemove never re-renders React.
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null;
          const el = dotRef.current;
          if (el) {
            el.style.left = `${posRef.current.x}px`;
            el.style.top = `${posRef.current.y}px`;
          }
        });
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
        setIsHoveringLink(isClickable);
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mediaQuery.removeEventListener('change', handlePointerTypeChange);
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  if (!isFinePointer || !isVisible) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out"
      style={{
        left: '-100px',
        top: '-100px',
        transform: `translate(-50%, -50%) scale(${isHoveringLink ? 1.5 : 1})`,
      }}
    >
      {/* Drafting Crosshair & Pen Indicator */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Center drafting dot */}
        <div className={`w-2 h-2 rounded-full transition-colors ${
          isHoveringLink ? 'bg-[#1D4ED8]' : 'bg-[#141517]'
        }`} />
        
        {/* Subtle crosshair ticks */}
        <div className="absolute w-5 h-[1px] bg-[#141517]/30" />
        <div className="absolute h-5 w-[1px] bg-[#141517]/30" />
      </div>
    </div>
  );
};
