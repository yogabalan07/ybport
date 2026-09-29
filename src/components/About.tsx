import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { HandDrawnCircle, StarDoodle, WashiTape } from './doodles/DoodleIcons';
import { Cpu, Terminal, Compass, Layers, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#F8F5EE] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
              Background &amp; Mindset
            </span>
            <span className="h-px bg-[#141517]/20 flex-1" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#141517] tracking-tight mt-2">
            01 — A LITTLE ABOUT ME
          </h2>
        </div>

        {/* Notebook Binder Container with motion slide-in */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl shadow-[6px_7px_0px_#141517] p-6 sm:p-10 lg:p-12"
        >
          
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-16 z-20">
            <WashiTape className="w-28 h-6" color="rgba(254, 240, 138, 0.85)" angle="-2deg" />
          </div>
          <div className="absolute -top-3 right-16 z-20">
            <WashiTape className="w-24 h-6" color="rgba(191, 219, 254, 0.8)" angle="3deg" />
          </div>

          {/* Notebook Spiral / Binder Punch Holes along left edge (desktop) */}
          <div className="hidden md:flex absolute left-3 top-8 bottom-8 flex-col justify-between pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-[#F8F5EE] border border-[#141517]/40 shadow-inner" />
            ))}
          </div>

          <div className="md:pl-8 space-y-8">
            
            {/* Lead Prose with Hand-Drawn Highlights */}
            <div className="space-y-4 text-base sm:text-lg text-[#141517] leading-relaxed">
              <p>
                Hello! I am <span className="font-bold">{PERSONAL_INFO.name}</span>, a 3rd-year Computer Science Engineering student at <span className="font-semibold underline decoration-[#1D4ED8] decoration-2">{PERSONAL_INFO.college}</span>. My technical journey began with asking how hardware and code actually connect — how a line of C firmware toggles a physical transistor, and how a cloud microservice can trigger a relay across continents.
              </p>
              <p>
                Today, I specialize in bridging <span className="marker-yellow font-medium">Embedded Systems &amp; IoT</span> with <span className="marker-blue font-medium">Modern Full-Stack Software Engineering</span>. Rather than treating hardware and software as isolated disciplines, I design integrated solutions: from breadboard prototypes and sensor calibration to REST APIs, databases, and responsive web user interfaces.
              </p>
              <p className="text-[#575961]">
                Whether it is engineering an off-grid 433MHz LoRa communicator, tuning dynamic PID algorithms on an inverted pendulum robot, or architecting college-wide management portals, I love taking ideas from zero to a reliable, working prototype.
              </p>
            </div>

            {/* Engineering Workflow Pipeline Diagram (IDEA -> DESIGN -> BUILD -> TEST -> DEBUG -> DEPLOY) */}
            <div className="p-4 sm:p-5 bg-[#FCFBF8] border-2 border-[#141517] rounded-xl shadow-[3px_4px_0px_#141517] space-y-3 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#141517]/15 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
                    ENGINEERING METHODOLOGY // WORKBENCH PIPELINE
                  </span>
                </div>
                <span className="font-hand text-sm text-[#B45309] font-bold">
                  // "Measure twice, solder once."
                </span>
              </div>

              {/* Responsive Step-by-Step Flow */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 text-center font-mono">
                {[
                  { step: '01', title: 'IDEA', sub: 'Hypothesis & Req', color: '#1D4ED8' },
                  { step: '02', title: 'DESIGN', sub: 'Schematic & Arch', color: '#0284C7' },
                  { step: '03', title: 'BUILD', sub: 'Firmware & Solder', color: '#059669' },
                  { step: '04', title: 'TEST', sub: 'Oscilloscope & CI', color: '#D97706' },
                  { step: '05', title: 'DEBUG', sub: 'Logic Analyzer', color: '#EA580C' },
                  { step: '06', title: 'DEPLOY', sub: 'Field Verification', color: '#7C3AED' },
                ].map((node, i) => (
                  <div key={node.title} className="p-2 bg-[#FAF7F0] border border-[#141517]/20 rounded-lg flex flex-col justify-between relative group hover:border-[#1D4ED8] transition-colors">
                    <span className="text-[9px] text-[#575961] font-bold">{node.step}</span>
                    <span className="text-xs font-black text-[#141517] my-0.5">{node.title}</span>
                    <span className="text-[8px] text-[#575961] leading-tight">{node.sub}</span>
                    {i < 5 && (
                      <span className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#141517] text-xs font-bold pointer-events-none">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-[#575961] border-t border-[#141517]/10">
                <span className="font-hand text-base text-[#141517] font-semibold">
                  "Hardware meets software at the physical boundary."
                </span>
                <span className="font-mono text-[10px] text-[#059669] font-bold">
                  ✓ Iterative Feedback Loops
                </span>
              </div>
            </div>

            {/* Doodle Annotations Cluster */}
            <div className="py-2 border-y border-[#141517]/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                <span className="font-hand text-xl text-[#1D4ED8] font-bold flex items-center gap-1.5 -rotate-2">
                  <Sparkles className="w-4 h-4" /> "Curious"
                </span>
                <span className="font-hand text-xl text-[#EA580C] font-bold flex items-center gap-1.5 rotate-1">
                  <Cpu className="w-4 h-4" /> "Builder"
                </span>
                <span className="font-hand text-xl text-[#141517] font-bold flex items-center gap-1.5 -rotate-1">
                  <Compass className="w-4 h-4" /> "Problem Solver"
                </span>
                <span className="font-hand text-xl text-emerald-700 font-bold flex items-center gap-1.5 rotate-2">
                  <Layers className="w-4 h-4" /> "Always Learning"
                </span>
              </div>
            </div>

            {/* 3 Notebook Sticky Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* Card 1 */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 bg-[#FCFBF8] border border-[#141517]/30 rounded-xl relative group hover:border-[#1D4ED8] transition-colors"
              >
                <span className="text-xs font-mono font-bold text-[#575961] block mb-1">01 / HARDWARE</span>
                <h3 className="font-bold text-sm text-[#141517] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#1D4ED8]" />
                  Circuits &amp; Microcontrollers
                </h3>
                <p className="text-xs text-[#575961] mt-2 leading-normal">
                  ESP32, Arduino, FreeRTOS, I2C/SPI protocols, LoRa RF, and physical sensor interfacing.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 bg-[#FCFBF8] border border-[#141517]/30 rounded-xl relative group hover:border-[#EA580C] transition-colors"
              >
                <span className="text-xs font-mono font-bold text-[#575961] block mb-1">02 / WEB &amp; CLOUD</span>
                <h3 className="font-bold text-sm text-[#141517] flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#EA580C]" />
                  Full-Stack Applications
                </h3>
                <p className="text-xs text-[#575961] mt-2 leading-normal">
                  React, Vite, Node.js, Express, Spring Boot, PostgreSQL, and scalable REST architectures.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 bg-[#FCFBF8] border border-[#141517]/30 rounded-xl relative group hover:border-[#CA8A04] transition-colors"
              >
                <span className="text-xs font-mono font-bold text-[#575961] block mb-1">03 / PHILOSOPHY</span>
                <h3 className="font-bold text-sm text-[#141517] flex items-center gap-1.5">
                  <StarDoodle className="w-4 h-4 text-amber-500" />
                  Engineering Discipline
                </h3>
                <p className="text-xs text-[#575961] mt-2 leading-normal">
                  Clean schematics, modular codebases, defensive error handling, and test-driven hardware iteration.
                </p>
              </motion.div>

            </div>

            {/* Handwritten Signature Area */}
            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#575961]">
                <span>Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Open for Internship Opportunities 2026
                </span>
              </div>

              {/* Authentic Handwritten Signature */}
              <div className="text-right">
                <span className="font-hand text-2xl sm:text-3xl font-bold text-[#141517] -rotate-2 inline-block">
                  — Yogabalan
                </span>
                <span className="block font-mono text-[10px] text-[#575961] tracking-wider uppercase">
                  B.E. Computer Science &amp; Eng.
                </span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
