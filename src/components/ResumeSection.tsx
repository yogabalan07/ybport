import React from 'react';
import { Eye, Download, FileText, CheckCircle2 } from 'lucide-react';
import { WashiTape, HandDrawnArrow, StarDoodle } from './doodles/DoodleIcons';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ResumeSectionProps {
  onOpenResume: () => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onOpenResume }) => {
  return (
    <section id="resume" className="py-20 bg-[#F4F1E8] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Sketchbook Paper Card */}
        <div className="relative bg-[#FFFFFF] border-2 border-[#141517] rounded-3xl p-8 sm:p-12 shadow-[7px_8px_0px_#141517] overflow-hidden">
          
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <WashiTape className="w-36 h-6" color="rgba(254, 240, 138, 0.9)" angle="-1deg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading and CTAs */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
                  Curriculum Vitae
                </span>
                <span className="font-hand text-base text-[#EA580C] font-bold">// recruiter ready</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#141517] tracking-tight">
                Want the complete story?
              </h2>

              <p className="text-sm sm:text-base text-[#575961] leading-relaxed">
                Review my complete engineering roadmap, academic transcript highlights, hardware laboratory experiences, software projects, and verifiable credentials formatted for recruiters and engineering hiring managers.
              </p>

              {/* Verified checklist */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#141517]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Available for Summer / Fall 2026 Internships</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#141517]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Detailed Pinouts, Schematics &amp; Production Web Work</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={onOpenResume}
                  className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#141517] rounded-xl shadow-[4px_4px_0px_#1D4ED8] hover:shadow-[5px_5px_0px_#1D4ED8] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Resume</span>
                </button>

                <a
                  href="/Yogabalan-Resume.pdf"
                  download="Yogabalan-BR-Resume.pdf"
                  className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#141517] bg-[#FFFFFF] border-2 border-[#141517] rounded-xl shadow-[3px_3px_0px_#141517] hover:bg-[#F4F2EB] hover:shadow-[4px_4px_0px_#141517] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#1D4ED8]" />
                  <span>Download Resume (PDF)</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hand-Drawn Paper / Resume Sketch Illustration */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-64 h-80 bg-[#FAF7F0] border-2 border-[#141517] rounded-xl shadow-[4px_5px_0px_#141517] p-5 rotate-2 hover:rotate-0 transition-transform duration-300">
                {/* Miniature tape on paper */}
                <div className="absolute -top-3 left-6">
                  <WashiTape className="w-20 h-5" color="rgba(191, 219, 254, 0.85)" angle="2deg" />
                </div>

                {/* Hand-drawn paper doodle content */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-[#141517]/20 pb-2">
                    <div className="w-16 h-3 bg-[#141517] rounded-xs" />
                    <div className="w-8 h-2 bg-[#1D4ED8] rounded-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-[#141517]/20 rounded-xs" />
                    <div className="w-5/6 h-2 bg-[#141517]/15 rounded-xs" />
                    <div className="w-4/6 h-2 bg-[#141517]/10 rounded-xs" />
                  </div>

                  <div className="pt-2 border-t border-[#141517]/10 space-y-1.5">
                    <div className="w-24 h-2.5 bg-[#EA580C]/40 rounded-xs" />
                    <div className="w-full h-2 bg-[#141517]/20 rounded-xs" />
                    <div className="w-3/4 h-2 bg-[#141517]/15 rounded-xs" />
                  </div>

                  <div className="pt-2 border-t border-[#141517]/10 space-y-1.5">
                    <div className="w-20 h-2.5 bg-[#1D4ED8]/40 rounded-xs" />
                    <div className="w-full h-2 bg-[#141517]/20 rounded-xs" />
                    <div className="w-4/5 h-2 bg-[#141517]/15 rounded-xs" />
                  </div>

                  {/* Stamp / Signature doodle */}
                  <div className="pt-3 flex justify-between items-end">
                    <span className="font-hand text-base text-[#141517] font-bold">
                      — Yogabalan B R
                    </span>
                    <div className="w-7 h-7 rounded-full border border-dashed border-[#1D4ED8] flex items-center justify-center">
                      <StarDoodle className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
