import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types/portfolio';
import { X, Cpu, Github, ExternalLink, Wrench, CheckCircle, Activity, Terminal, Cloud } from 'lucide-react';
import { WashiTape } from './doodles/DoodleIcons';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ProjectBlueprintModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectBlueprintModal: React.FC<ProjectBlueprintModalProps> = ({ project, onClose }) => {
  const containerRef = useFocusTrap(!!project, onClose);

  if (!project) return null;

  const isHardware = project.category.includes('Embedded') || project.category.includes('IoT');

  const flowNodes = isHardware ? [
    { title: 'Physical Sensors', sub: 'Analog/I2C Input', icon: Activity },
    { title: 'ESP32 / MCU', sub: 'Control & Sampling', icon: Cpu },
    { title: 'PID / RTOS', sub: 'Real-time Processing', icon: Terminal },
    { title: 'LoRa / Wi-Fi', sub: 'RF Packet Transmission', icon: Activity },
    { title: 'Cloud / Client', sub: 'Telemetry Display', icon: Cloud }
  ] : [
    { title: 'User Interface', sub: 'React + TypeScript', icon: Terminal },
    { title: 'API Gateway', sub: 'Express / REST', icon: Cpu },
    { title: 'Business Logic', sub: 'Services & Validation', icon: Wrench },
    { title: 'Database / RLS', sub: 'PostgreSQL / ACID', icon: Cloud },
    { title: 'Client Analytics', sub: 'Reporting & Feeds', icon: Activity }
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
        role="presentation"
      >
        <motion.div 
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="blueprint-modal-title"
          aria-describedby="blueprint-modal-desc"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-[#FAF7F0] border-2 border-[#141517] rounded-2xl shadow-[8px_10px_0px_#141517] p-6 sm:p-8 my-8 text-[#141517] max-h-[92vh] overflow-y-auto focus:outline-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <WashiTape className="w-36 h-6" color="rgba(254, 240, 138, 0.9)" angle="1deg" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#141517] hover:bg-[#141517]/10 rounded-lg transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8] focus:outline-hidden"
            aria-label="Close blueprint specification"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="border-b border-[#141517]/20 pb-4 pr-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1D4ED8] uppercase">
              <span>TECHNICAL BLUEPRINT // SCHEMATIC DOC</span>
              <span>·</span>
              <span className="text-[#EA580C]">{project.badge || 'Engineering Spec'}</span>
            </div>
            <h2 id="blueprint-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-[#141517]">
              {project.name}
            </h2>
            <p id="blueprint-modal-desc" className="text-xs sm:text-sm font-mono text-[#575961] mt-1">
              {project.tagline}
            </p>
          </div>

          {/* Modal Body */}
          <div className="mt-6 space-y-6">
            
            {/* Handwritten Engineering Field Note */}
            <div className="p-3.5 bg-[#FEF9C3] border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-hand text-lg text-amber-950 font-bold">
                Field Annotation: "{project.annotation}"
              </span>
              <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded self-start sm:self-auto">
                FIELD VERIFIED OK
              </span>
            </div>

            {/* SYSTEM FLOW PIPELINE (ANIMATED SCHEMATIC) */}
            <div className="p-4 bg-[#FFFFFF] border border-[#141517]/20 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#141517] uppercase flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#1D4ED8]" />
                  System Architecture &amp; Signal Flow Pipeline
                </span>
                <span className="font-hand text-sm text-[#575961]">
                  Left-to-Right Signal Flow
                </span>
              </div>

              {/* Responsive Flow Pipeline */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {flowNodes.map((node, i) => {
                  const Icon = node.icon;
                  return (
                    <div 
                      key={i} 
                      className="p-2.5 bg-[#F8F5EE] border border-[#141517]/15 rounded-lg flex flex-col justify-between relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span className="text-[10px] font-mono text-[#575961]">0{i + 1}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#141517] leading-tight">
                          {node.title}
                        </span>
                        <span className="block text-[10px] font-mono text-[#575961] mt-0.5">
                          {node.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Problem Statement & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FFFFFF] border border-[#141517]/20 rounded-xl">
                <span className="text-xs font-mono font-bold text-[#EA580C] uppercase block mb-1">
                  The Problem Solved
                </span>
                <p className="text-xs sm:text-sm text-[#575961] leading-relaxed">
                  {project.problemSolved}
                </p>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#141517]/20 rounded-xl">
                <span className="text-xs font-mono font-bold text-[#1D4ED8] uppercase block mb-1">
                  Architecture &amp; Core Logic
                </span>
                <p className="text-xs sm:text-sm text-[#575961] leading-relaxed">
                  {project.architectureNotes}
                </p>
              </div>
            </div>

            {/* Hardware Pinout / Bill of Materials (if available) */}
            {project.pinoutOrComponents && (
              <div className="p-4 bg-[#FFFFFF] border border-[#141517]/20 rounded-xl">
                <span className="text-xs font-mono font-bold text-[#141517] uppercase flex items-center gap-1.5 mb-2">
                  <Cpu className="w-4 h-4 text-[#1D4ED8]" />
                  Hardware Bill of Materials &amp; Pinout Configuration
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.pinoutOrComponents.map((pin, i) => (
                    <div key={i} className="text-xs font-mono p-2 bg-[#F8F5EE] border border-[#141517]/10 rounded-md text-[#141517] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
                      <span>{pin}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features List */}
            <div>
              <span className="text-xs font-mono font-bold text-[#141517] uppercase block mb-2">
                Key Engineering Features
              </span>
              <ul className="space-y-2">
                {project.keyFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#141517]">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Matrix */}
            <div>
              <span className="text-xs font-mono font-bold text-[#575961] uppercase block mb-2">
                Technologies Utilized
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#FFFFFF] text-[#141517] border border-[#141517]/30 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-[#141517]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#141517] rounded-lg shadow-sm hover:bg-[#1D4ED8] transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8]"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#141517] bg-[#FFFFFF] border border-[#141517] rounded-lg hover:bg-[#F8F5EE] transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8]"
                  >
                    <ExternalLink className="w-4 h-4 text-[#1D4ED8]" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#575961] hover:text-[#141517] transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8] rounded-md"
              >
                Close Blueprint [Esc]
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
