import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { HeroDoodleDiagram } from './HeroDoodleDiagram';
import { HandDrawnArrow, HandDrawnUnderline, StarDoodle } from './doodles/DoodleIcons';
import { Github, Linkedin, Mail, ArrowRight, Download, Terminal, Cpu } from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
  onOpenTerminal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onOpenTerminal }) => {
  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background Engineer Grid with subtle motion */}
      <div className="absolute inset-0 bg-grid-paper opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: HERO CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6"
          >
            
            {/* Identity & Status Ribbon + Terminal Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#141517]/20 shadow-[2px_2px_0px_#141517]/10 text-xs font-mono text-[#141517]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>3rd Year CSE</span>
                <span className="text-[#141517]/30">/</span>
                <span className="font-semibold text-[#1D4ED8]">{PERSONAL_INFO.college}</span>
              </div>

              {/* Terminal Quick Launcher Chip */}
              <button
                type="button"
                onClick={onOpenTerminal}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141517] hover:bg-[#1E293B] text-[#FAF7F0] rounded-full text-xs font-mono border border-[#141517] shadow-xs cursor-pointer hover:border-[#1D4ED8] transition-all"
                title="Launch interactive portfolio command terminal"
                aria-label="Open portfolio terminal CLI"
              >
                <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-[#93C5FD]">yb@portfolio:~$</span>
                <span className="text-amber-300 font-bold">help</span>
              </button>
            </div>

            {/* Name with Hand-Drawn Annotation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono tracking-widest text-[#575961] uppercase">
                  Portfolio · 2026
                </span>
                <span className="font-hand text-base text-[#EA580C] font-bold">
                  // verified builder
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#141517] tracking-tight text-balance leading-[1.1]">
                {PERSONAL_INFO.name}
              </h1>
              {/* Animated underline sketch */}
              <div className="w-52 sm:w-72">
                <HandDrawnUnderline className="w-full h-3 text-[#1D4ED8]" animate={true} />
              </div>
            </div>

            {/* Professional Identity Sub-headline */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm sm:text-base font-semibold text-[#141517]">
              <span className="flex items-center gap-1.5 text-[#1D4ED8]">
                <Cpu className="w-4 h-4" />
                Embedded Systems
              </span>
              <span className="text-[#141517]/40">·</span>
              <span className="flex items-center gap-1.5 text-[#EA580C]">
                <span className="w-2 h-2 rounded-sm bg-[#EA580C]" />
                IoT Architectures
              </span>
              <span className="text-[#141517]/40">·</span>
              <span className="flex items-center gap-1.5 text-[#141517]">
                <Terminal className="w-4 h-4" />
                Full-Stack Development
              </span>
            </div>

            {/* Core Taglines */}
            <div className="space-y-2">
              <p className="text-xl sm:text-2xl font-bold text-[#141517] tracking-tight">
                "{PERSONAL_INFO.headline}"
              </p>
              <p className="text-base sm:text-lg text-[#575961] max-w-xl leading-relaxed">
                {PERSONAL_INFO.subHeadline}
              </p>
              <p className="text-sm font-mono text-[#1D4ED8] font-medium">
                → {PERSONAL_INFO.tagline}
              </p>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#141517] rounded-xl shadow-[4px_4px_0px_#1D4ED8] hover:shadow-[5px_5px_0px_#1D4ED8] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Explore My Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="/Yogabalan-Resume.pdf"
                download="Yogabalan-BR-Resume.pdf"
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-[#141517] bg-[#FFFFFF] border-2 border-[#141517] rounded-xl shadow-[3px_3px_0px_#141517] hover:bg-[#F4F2EB] hover:shadow-[4px_4px_0px_#141517] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#1D4ED8]" />
                <span>Download Resume</span>
              </a>

              <button
                type="button"
                onClick={onOpenTerminal}
                className="flex items-center gap-2 px-4 py-3.5 text-sm font-bold text-[#141517] bg-[#FAF7F0] border-2 border-[#141517] rounded-xl shadow-[3px_3px_0px_#141517] hover:bg-[#FFFFFF] hover:text-[#1D4ED8] hover:shadow-[4px_4px_0px_#1D4ED8] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                title="Launch Portfolio Terminal CLI"
                aria-label="Open Terminal"
              >
                <Terminal className="w-4 h-4 text-[#1D4ED8]" />
                <span>Open Terminal</span>
              </button>
            </div>

            {/* Social Links & Hand-Drawn Arrow note */}
            <div className="pt-4 border-t border-[#141517]/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#141517] hover:text-[#1D4ED8] hover:bg-[#FFFFFF] rounded-lg transition-colors border border-transparent hover:border-[#141517]/20"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#141517] hover:text-[#1D4ED8] hover:bg-[#FFFFFF] rounded-lg transition-colors border border-transparent hover:border-[#141517]/20"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="p-2 text-[#141517] hover:text-[#1D4ED8] hover:bg-[#FFFFFF] rounded-lg transition-colors border border-transparent hover:border-[#141517]/20"
                  aria-label="Send Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-hand text-base text-[#141517] font-bold">
                  Open for 2026 Internships
                </span>
                <StarDoodle className="w-4 h-4 text-[#EAB308]" />
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: ARTISTIC ENGINEERING DOODLE SCHEMATIC */}
          <div className="lg:col-span-6 relative">
            <HeroDoodleDiagram />
            
            {/* Playful sticky sketch tag floating below */}
            <div className="hidden sm:flex items-center gap-2 mt-4 ml-6">
              <HandDrawnArrow direction="curve-right" className="w-12 h-6 text-[#1D4ED8]" animate={true} />
              <span className="font-hand text-base text-[#141517]/80">
                Live interactive schematic — hover &amp; click nodes to inspect specs
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
