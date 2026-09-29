import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS } from '../data/portfolioData';
import { Project, ProjectCategory } from '../types/portfolio';
import { ProjectBlueprintModal } from './ProjectBlueprintModal';
import { WashiTape, HandDrawnArrow, StarDoodle } from './doodles/DoodleIcons';
import { Github, ExternalLink, Cpu, FileCode2, Layers, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

export const Projects: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<ProjectCategory>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const filterTabs: ProjectCategory[] = ['All', 'Web', 'IoT', 'Embedded', 'Full Stack'];

  const getProjectSignalPipeline = (id: string) => {
    switch (id) {
      case 'esp32-lora-morse':
        return [
          { label: 'ESP32 MCU' },
          { label: 'CW Key' },
          { label: 'SX1278 SPI' },
          { label: '433MHz RF' },
          { label: 'SX1278' },
          { label: 'ESP32' },
          { label: 'OLED Display' },
        ];
      case 'self-balancing-robot':
        return [
          { label: 'MPU6050 IMU' },
          { label: 'Complementary Filter' },
          { label: 'PID Loop (5ms)' },
          { label: 'L298N H-Bridge' },
          { label: 'DC Gearmotors' },
        ];
      case 'connect-academic':
        return [
          { label: 'React Client' },
          { label: 'Express REST' },
          { label: 'JWT Auth' },
          { label: 'PostgreSQL DB' },
        ];
      case 'nrb-vidyalaya-lms':
        return [
          { label: 'Audio In' },
          { label: 'Phonetic Engine' },
          { label: 'Firestore' },
          { label: 'Student UI' },
        ];
      case 'enterprise-bms':
        return [
          { label: 'Inventory Scan' },
          { label: 'Spring Boot' },
          { label: 'ACID Txn' },
          { label: 'PDF Invoice' },
        ];
      case 'alumni-portal':
        return [
          { label: 'Member Auth' },
          { label: 'Supabase RLS' },
          { label: 'Schedule API' },
          { label: 'Mentorship UI' },
        ];
      case 'training-attendance-system':
        return [
          { label: 'Time-Limited QR' },
          { label: 'Token Verify' },
          { label: 'PostgreSQL' },
          { label: 'CSV Report' },
        ];
      default:
        return [
          { label: 'Sensor Input' },
          { label: 'ESP32 MCU' },
          { label: 'Cloud Broker' },
        ];
    }
  };

  const filteredProjects = selectedFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category.includes(selectedFilter as any));

  return (
    <section id="projects" className="py-24 bg-[#F8F5EE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#141517]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
                Proof of Work
              </span>
              <span className="font-hand text-base text-[#EA580C] font-bold">// circuits to cloud code</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#141517] tracking-tight mt-1">
              02 — THINGS I'VE BUILT
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono text-[#575961]">Showing:</span>
            <span className="text-xs font-mono font-bold text-[#141517] bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#141517]/20">
              {filteredProjects.length} Verified Projects
            </span>
          </div>
        </div>

        {/* Filter Bar (Segmented Controls) */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 bg-[#EFECE3] rounded-xl border border-[#141517]/15 max-w-fit">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#141517] text-white shadow-xs'
                    : 'text-[#575961] hover:text-[#141517] hover:bg-[#FFFFFF]/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Projects Cards Grid with AnimatePresence */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => {
              const isHovered = hoveredCardId === project.id;

              return (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  onMouseEnter={() => setHoveredCardId(project.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className="group relative bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl shadow-[5px_6px_0px_#141517] hover:shadow-[7px_8px_0px_#1D4ED8] transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Washi Tape on corner */}
                  <div className="absolute -top-3 right-8 z-10">
                    <WashiTape
                      className="w-20 h-5"
                      color={idx % 2 === 0 ? "rgba(254, 240, 138, 0.85)" : "rgba(191, 219, 254, 0.85)"}
                      angle={idx % 2 === 0 ? "2deg" : "-2deg"}
                    />
                  </div>

                  {/* Card Header & Content */}
                  <div className="p-6 sm:p-8 space-y-4">
                    
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-[#141517]/10 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#575961]">
                        {project.category.map((cat, i) => (
                          <React.Fragment key={cat}>
                            {i > 0 && <span>·</span>}
                            <span className={cat === 'IoT' || cat === 'Embedded' ? 'text-[#1D4ED8]' : 'text-[#EA580C]'}>
                              {cat}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>

                      {project.badge && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8F5EE] border border-[#141517]/20 text-[#141517] font-bold">
                          {project.badge}
                        </span>
                      )}
                    </div>

                    {/* Project Name & Tagline */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-[#141517] group-hover:text-[#1D4ED8] transition-colors">
                          {project.name}
                        </h3>
                        {isHovered && (
                          <HandDrawnArrow direction="right" className="w-6 h-3 text-[#1D4ED8]" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-mono text-[#575961] mt-1 line-clamp-2">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Hand-Drawn Annotation Tape */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FEF9C3] border border-amber-300 rounded-md">
                      <span className="font-hand text-base text-amber-950 font-bold">
                        "{project.annotation}"
                      </span>
                    </div>

                    {/* Problem Solved */}
                    <div className="p-3 bg-[#FCFBF8] border border-[#141517]/10 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] font-bold block">
                        Problem Solved
                      </span>
                      <p className="text-xs text-[#141517] leading-relaxed">
                        {project.problemSolved}
                      </p>
                    </div>

                    {/* Technical Signal Pipeline Diagram */}
                    <div className="p-2.5 bg-[#FAF7F0] border border-[#141517]/15 rounded-xl space-y-1.5 overflow-hidden">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#575961] uppercase font-bold">
                        <span>Schematic Signal Pipeline</span>
                        <span className="text-[#1D4ED8] font-bold">Hardware ➔ Software</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono select-none">
                        {getProjectSignalPipeline(project.id).map((step, sIdx, arr) => (
                          <React.Fragment key={sIdx}>
                            <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#141517]/20 rounded font-bold text-[#141517] whitespace-nowrap shadow-2xs">
                              {step.label}
                            </span>
                            {sIdx < arr.length - 1 && (
                              <span className="text-[#1D4ED8] font-bold shrink-0">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Key Features Bullet List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] font-bold block">
                        Core Technical Highlights
                      </span>
                      <ul className="space-y-1">
                        {project.keyFeatures.slice(0, 2).map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#141517]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies Matrix */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] font-bold block mb-1">
                        Tech Stack
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#141517]">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 bg-[#F8F5EE] border border-[#141517]/15 rounded text-[11px] font-semibold group-hover:border-[#141517]/40 transition-colors">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-6 sm:px-8 py-4 bg-[#FCFBF8] border-t border-[#141517]/15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#141517] hover:text-white hover:bg-[#141517] border border-[#141517]/30 rounded-lg transition-all"
                          aria-label="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#141517] hover:text-[#1D4ED8] border border-[#141517]/30 rounded-lg transition-all"
                          aria-label="Live Project Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Blueprint Inspect Button */}
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#141517] bg-[#FFFFFF] border-1.5 border-[#141517] rounded-lg shadow-[2px_2px_0px_#141517] hover:shadow-[3px_3px_0px_#141517] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#1D4ED8]" />
                      <span>Inspect Blueprint</span>
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Blueprint Deep-Dive Modal */}
      <ProjectBlueprintModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
