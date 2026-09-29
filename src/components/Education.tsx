import React from 'react';
import { EDUCATION } from '../data/portfolioData';
import { WashiTape, HandDrawnArrow } from './doodles/DoodleIcons';
import { GraduationCap, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-20 bg-[#F8F5EE] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
              Academic Foundation
            </span>
            <span className="h-px bg-[#141517]/20 flex-1" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#141517] tracking-tight mt-1">
            04 — EDUCATION &amp; CURRICULUM
          </h2>
          <p className="text-sm font-mono text-[#575961] mt-1">
            Core Computer Science &amp; Engineering fundamentals paired with applied laboratory systems.
          </p>
        </div>

        {/* Notebook Paper Card */}
        <div className="relative bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl p-6 sm:p-10 shadow-[6px_7px_0px_#141517] overflow-hidden">
          
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <WashiTape className="w-32 h-6" color="rgba(191, 219, 254, 0.85)" angle="1deg" />
          </div>

          <div className="space-y-8">
            
            {/* Degree & Institution Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#141517]/15 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-[#1D4ED8]/10 text-[#1D4ED8]">
                    <GraduationCap className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141517]">
                      {EDUCATION.institution}
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-[#1D4ED8] mt-0.5">
                      {EDUCATION.degree}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FEF9C3] border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-950">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Current Status: {EDUCATION.currentStatus}</span>
                </div>
                <span className="text-xs font-mono font-semibold text-[#575961]">
                  Batch: {EDUCATION.period}
                </span>
              </div>
            </div>

            {/* Coursework Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#141517] uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#EA580C]" />
                  Relevant Core Coursework
                </span>
                <span className="font-hand text-sm text-[#1D4ED8] font-bold">
                  // Theory &amp; Hands-on Labs
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {EDUCATION.coursework.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl flex items-center gap-2 hover:border-[#141517] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] shrink-0" />
                    <span className="text-xs font-mono font-semibold text-[#141517]">
                      {course}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Highlights */}
            <div className="pt-2 border-t border-[#141517]/10 space-y-3">
              <span className="text-xs font-mono font-bold text-[#141517] uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Departmental &amp; Lab Highlights
              </span>
              <ul className="space-y-2">
                {EDUCATION.academicHighlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#575961]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
