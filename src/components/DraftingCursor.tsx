import React, { useEffect, useState } from 'react';

export const DraftingCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Only enable if pointer is fine (desktop mouse)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handlePointerTypeChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mediaQuery.addEventListener('change', handlePointerTypeChange);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
        setIsHoveringLink(isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mediaQuery.removeEventListener('change', handlePointerTypeChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isFinePointer || !isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
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
