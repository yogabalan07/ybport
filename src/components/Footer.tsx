import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowUp, Gamepad2 } from 'lucide-react';
import { HandDrawnArrow } from './doodles/DoodleIcons';

interface FooterProps {
  onOpenSnakeGame?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSnakeGame }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FFFFFF] border-t-2 border-[#141517] py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hidden Mini Snake Game Easter Egg Trigger */}
        <div className="mb-8 pb-6 border-b border-[#141517]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-hand text-lg sm:text-xl text-[#141517] font-bold">
              Need a break? 🎮
            </span>
            <HandDrawnArrow direction="right" className="w-8 h-4 text-[#1D4ED8]" />
            <button
              onClick={onOpenSnakeGame}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FEF9C3] hover:bg-[#FEF08A] border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-950 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              title="Launch Mini Snake Game (Shortcut: Press 'G')"
              aria-label="Play Snake Easter Egg Game"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Play Snake</span>
              <span className="text-[10px] text-amber-800 font-semibold bg-amber-200/70 px-1 py-0.2 rounded">
                [G]
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[#575961]">
            <span className="font-hand text-sm text-[#1D4ED8] font-bold">// easter egg:</span>
            <span>press "G" anywhere to launch</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Identity */}
          <div className="text-center md:text-left space-y-1">
            <span className="text-xl font-black text-[#141517] tracking-tight">
              {PERSONAL_INFO.name}
            </span>
            <p className="text-xs font-mono text-[#575961]">
              Embedded Systems • IoT • Software Engineering
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 text-xs font-mono text-[#575961]">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#141517] underline decoration-[#1D4ED8] decoration-1.5 underline-offset-4 transition-colors"
            >
              GitHub
            </a>
            <span className="text-[#141517]/20">/</span>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#141517] underline decoration-[#1D4ED8] decoration-1.5 underline-offset-4 transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-[#141517]/20">/</span>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="hover:text-[#141517] underline decoration-[#1D4ED8] decoration-1.5 underline-offset-4 transition-colors"
            >
              Email
            </a>
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex items-center gap-4 text-xs font-mono text-[#575961]">
            <span>© 2026 {PERSONAL_INFO.name}</span>
            <button
              onClick={scrollToTop}
              className="p-2 text-[#141517] hover:bg-[#F8F5EE] border border-[#141517]/20 rounded-lg transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
