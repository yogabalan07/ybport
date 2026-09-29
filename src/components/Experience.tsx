import React from 'react';
import { motion } from 'motion/react';
import { EXPERIENCE } from '../data/portfolioData';
import { WashiTape, HandDrawnArrow } from './doodles/DoodleIcons';
import { Briefcase, Building2, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-[#F4F1E8] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
              Industry Experience
            </span>
            <span className="h-px bg-[#141517]/20 flex-1" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#141517] tracking-tight mt-1">
            03 — WORK ROADMAP
          </h2>
          <p className="text-sm font-mono text-[#575961] mt-1">
            Practical industry contributions and engineering team experience.
          </p>
        </div>

        {/* Hand-Drawn Engineering Roadmap Container */}
        <div className="relative pl-6 sm:pl-10">
          
          {/* Vertical hand-drawn sketched roadmap line that draws itself */}
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-2.5 sm:left-4 top-2 bottom-4 w-1 bg-[#141517] rounded-full" 
          />

          {/* Timeline node */}
          <div className="relative space-y-8">
            {EXPERIENCE.map((exp, index) => (
              <div key={index} className="relative">
                
                {/* Node marker pin on vertical line with bounce */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 350, damping: 20 }}
                  className="absolute -left-[30px] sm:-left-[36px] top-6 w-5 h-5 rounded-full bg-[#FFFFFF] border-3 border-[#1D4ED8] shadow-[2px_2px_0px_#141517] z-10" 
                />

                {/* Hand-drawn arrow pointing to node */}
                <div className="hidden sm:block absolute -left-20 top-5 pointer-events-none">
                  <HandDrawnArrow direction="right" className="w-10 h-6 text-[#1D4ED8]" animate={true} />
                </div>

                {/* Experience Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl p-6 sm:p-8 shadow-[5px_6px_0px_#141517] hover:shadow-[7px_8px_0px_#141517] transition-all"
                >
                  
                  {/* Washi Tape */}
                  <div className="absolute -top-3 left-10">
                    <WashiTape className="w-24 h-5" color="rgba(254, 240, 138, 0.9)" angle="-2deg" />
                  </div>

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#141517]/15 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-md bg-[#1D4ED8]/10 text-[#1D4ED8]">
                          <Briefcase className="w-4 h-4" />
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#141517]">
                          {exp.role}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs font-mono text-[#575961]">
                        <span className="flex items-center gap-1 font-bold text-[#141517]">
                          <Building2 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-bold bg-[#F8F5EE] border border-[#141517]/20 px-3 py-1.5 rounded-lg text-[#141517] self-start sm:self-auto">
                      <Calendar className="w-3.5 h-3.5 text-[#1D4ED8]" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Handwritten sketch callout */}
                  <div className="mt-4 p-2.5 bg-[#FEF9C3] border border-amber-300 rounded-lg flex items-center gap-2">
                    <span className="font-hand text-base text-amber-900 font-bold">
                      Roadmap Milestone: "{exp.sketchNote}"
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-[11px] font-mono font-bold text-[#575961] uppercase tracking-wider block">
                      Key Responsibilities &amp; Outcomes
                    </span>
                    <ul className="space-y-2">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#141517]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies Used */}
                  <div className="mt-6 pt-4 border-t border-[#141517]/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#575961] uppercase">Stack:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((t) => (
                          <span key={t} className="px-2 py-0.5 text-xs font-mono font-semibold bg-[#F4F1E8] border border-[#141517]/15 rounded-md text-[#141517]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="text-xs font-mono text-emerald-700 font-bold">
                      ✓ Production Verified
                    </span>
                  </div>

                </motion.div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
