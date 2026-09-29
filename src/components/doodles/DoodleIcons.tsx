import React from 'react';
import { motion } from 'motion/react';

export const HandDrawnArrow: React.FC<{ 
  className?: string; 
  direction?: 'right' | 'down' | 'curve-right' | 'curve-down' | 'up-right';
  animate?: boolean;
}> = ({
  className = "w-12 h-6 text-[#141517]",
  direction = 'right',
  animate = false
}) => {
  if (direction === 'curve-right') {
    return (
      <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <motion.path 
          d="M5 30 C 25 35, 55 35, 75 18 C 82 12, 88 10, 93 12"
          initial={animate ? { pathLength: 0 } : false}
          animate={animate ? { pathLength: 1 } : false}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path 
          d="M84 7 L 95 12 L 88 23" 
          initial={animate ? { opacity: 0 } : false}
          animate={animate ? { opacity: 1 } : false}
          transition={{ delay: 0.5, duration: 0.2 }}
        />
      </svg>
    );
  }

  if (direction === 'curve-down') {
    return (
      <svg viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <motion.path 
          d="M12 5 C 10 25, 12 45, 25 60 C 28 64, 32 68, 34 72"
          initial={animate ? { pathLength: 0 } : false}
          animate={animate ? { pathLength: 1 } : false}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path 
          d="M22 68 L 34 73 L 36 60"
          initial={animate ? { opacity: 0 } : false}
          animate={animate ? { opacity: 1 } : false}
          transition={{ delay: 0.5, duration: 0.2 }}
        />
      </svg>
    );
  }

  if (direction === 'up-right') {
    return (
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 42 C 16 34, 28 22, 40 10" />
        <path d="M28 9 L 41 10 L 40 23" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13 C 24 10, 52 14, 72 12" />
      <path d="M64 5 L 74 12 L 63 19" />
    </svg>
  );
};

export const HandDrawnCircle: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = "inline-block relative px-2",
  children
}) => {
  return (
    <span className={className}>
      <span className="relative z-10">{children}</span>
      <svg viewBox="0 0 160 60" preserveAspectRatio="none" className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none text-[#1D4ED8] -rotate-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M 12 30 C 15 12, 140 10, 150 28 C 158 44, 25 54, 8 36 C -1 25, 20 18, 48 16" />
      </svg>
    </span>
  );
};

export const HandDrawnUnderline: React.FC<{ className?: string; color?: string; animate?: boolean }> = ({
  className = "w-full h-3 text-[#EAB308]",
  color,
  animate = false
}) => {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke={color || "currentColor"} strokeWidth="3" strokeLinecap="round">
      {animate ? (
        <motion.path 
          d="M 4 8 C 45 4, 110 12, 196 6 C 160 13, 85 11, 20 14"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ) : (
        <path d="M 4 8 C 45 4, 110 12, 196 6 C 160 13, 85 11, 20 14" />
      )}
    </svg>
  );
};

export const StarDoodle: React.FC<{ className?: string; fill?: boolean }> = ({
  className = "w-5 h-5 text-[#EAB308]",
  fill = true
}) => {
  return (
    <svg viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 L14.5 8.5 L21.5 9 L16 13.8 L18 20.8 L12 17 L6 20.8 L8 13.8 L2.5 9 L9.5 8.5 Z" />
    </svg>
  );
};

export const CircuitTraceDoodle: React.FC<{ className?: string }> = ({
  className = "w-full h-12 text-[#141517]/30"
}) => {
  return (
    <svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M10 20 H60 L80 10 H140 L160 30 H220 L240 15 H320 L335 28 H390" />
      <circle cx="10" cy="20" r="3" fill="currentColor" />
      <circle cx="80" cy="10" r="2.5" fill="currentColor" />
      <circle cx="160" cy="30" r="2.5" fill="currentColor" />
      <circle cx="240" cy="15" r="2.5" fill="currentColor" />
      <circle cx="390" cy="28" r="3" fill="currentColor" />
      {/* Resistor zig-zag symbol */}
      <path d="M180 30 L184 25 L188 35 L192 25 L196 35 L200 30" strokeWidth="1.7" />
    </svg>
  );
};

export const SectionSketchDivider: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="relative py-8 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        <svg viewBox="0 0 300 12" className="flex-1 h-3 text-[#141517]/20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" preserveAspectRatio="none">
          <path d="M0 6 Q 75 2, 150 6 T 300 6" />
        </svg>

        {label && (
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#575961] bg-[#F8F5EE] px-3 py-1 rounded-md border border-[#141517]/15">
            // {label}
          </span>
        )}

        <svg viewBox="0 0 300 12" className="flex-1 h-3 text-[#141517]/20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" preserveAspectRatio="none">
          <path d="M0 6 Q 75 10, 150 6 T 300 6" />
        </svg>
      </div>
    </div>
  );
};

export const WashiTape: React.FC<{ className?: string; color?: string; angle?: string }> = ({
  className = "w-24 h-6",
  color = "rgba(254, 240, 138, 0.75)",
  angle = "-2deg"
}) => {
  return (
    <div
      style={{ transform: `rotate(${angle})`, backgroundColor: color }}
      className={`border-x-2 border-dashed border-black/10 shadow-xs pointer-events-none ${className}`}
    />
  );
};

export const PaperClipDoodle: React.FC<{ className?: string }> = ({
  className = "w-8 h-12 text-[#575961]"
}) => {
  return (
    <svg viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M8 12 V28 C8 32, 16 32, 16 28 V8 C16 3, 4 3, 4 8 V30 C4 37, 20 37, 20 30 V14" />
    </svg>
  );
};
