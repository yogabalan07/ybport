import React from 'react';
import { WashiTape, HandDrawnArrow, StarDoodle } from './doodles/DoodleIcons';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-screen bg-[#F8F5EE] bg-grid-paper flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full bg-[#FFFFFF] border-2 border-[#141517] rounded-3xl p-8 sm:p-12 shadow-[8px_10px_0px_#141517] text-center space-y-6">
        {/* Top Washi Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <WashiTape className="w-32 h-6" color="rgba(254, 240, 138, 0.9)" angle="-2deg" />
        </div>

        {/* 404 Sketched Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF2F2] border border-red-300 rounded-full text-xs font-mono text-red-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>CIRCUIT_OPEN // 404 FAULT</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-black text-[#141517] tracking-tight">
            404
          </h1>

          <p className="font-hand text-2xl font-bold text-[#1D4ED8]">
            "Looks like a broken trace on the breadboard!"
          </p>
        </div>

        {/* Sketched Broken Wire SVG */}
        <div className="py-2 flex justify-center">
          <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-16 text-[#141517]">
            <path d="M10 30 H75 L85 20 L92 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Spark / broken gap */}
            <circle cx="95" cy="35" r="3" fill="#EF4444" />
            <path d="M100 25 L106 32 M108 22 L112 30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="118" cy="35" r="3" fill="#EF4444" />
            <path d="M120 35 L128 20 L138 30 H190" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <text x="105" y="55" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#575961">SIGNAL LOSS</text>
          </svg>
        </div>

        <p className="text-sm font-mono text-[#575961] leading-relaxed">
          The requested schematic path does not exist in Yogabalan B R's verified notebook repository.
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onReturnHome}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#141517] rounded-xl shadow-[4px_4px_0px_#1D4ED8] hover:shadow-[5px_5px_0px_#1D4ED8] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Schematic Hub</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#141517]/10 flex items-center justify-between text-xs font-mono text-[#575961]">
          <span>Status: 0x404_PAGE_NOT_FOUND</span>
          <span className="font-hand text-sm text-[#141517] font-semibold">
            Yogabalan B R // Portfolio
          </span>
        </div>
      </div>
    </div>
  );
};
