import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO, PROJECTS, SKILLS, EXPERIENCE, EDUCATION, ACHIEVEMENTS, LINKEDIN_HANDLE } from '../data/portfolioData';
import { X, Printer, Download, Mail, MapPin, Github, Linkedin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { WashiTape } from './doodles/DoodleIcons';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTextCV = () => {
    const cvContent = `=================================================================
${PERSONAL_INFO.name}
${PERSONAL_INFO.role}
Email: ${PERSONAL_INFO.email}
GitHub: ${PERSONAL_INFO.github}
LinkedIn: ${PERSONAL_INFO.linkedin}
College: ${PERSONAL_INFO.college} (${PERSONAL_INFO.batch})
=================================================================

PROFESSIONAL SUMMARY:
${PERSONAL_INFO.bio}

EDUCATION:
${EDUCATION.institution} — ${EDUCATION.degree}
Status: ${EDUCATION.currentStatus} (${EDUCATION.period})
Core Coursework: ${EDUCATION.coursework.join(', ')}

EXPERIENCE:
${EXPERIENCE.map(e => `${e.role} | ${e.company} (${e.period})
Location: ${e.location}
Highlights:
${e.highlights.map(h => `  • ${h}`).join('\n')}
Technologies: ${e.technologies.join(', ')}`).join('\n\n')}

TECHNICAL SKILLS:
• Programming: C, Python, JavaScript, TypeScript, Embedded C++
• Hardware & IoT: ESP32, Arduino, Raspberry Pi, LoRa SX1278, Sensors, I2C/SPI
• Web & Backend: React, Vite, Node.js, Express, Tailwind CSS, REST APIs
• Databases & Tools: PostgreSQL, Firebase, Supabase, Git, GitHub, Linux, VS Code

FEATURED PROJECTS:
${PROJECTS.map(p => `• ${p.name}
  Tagline: ${p.tagline}
  Stack: ${p.technologies.join(', ')}
  Problem Solved: ${p.problemSolved}${p.githubUrl ? `\n  GitHub: ${p.githubUrl}` : ''}`).join('\n\n')}

HONORS & AWARDS:
${ACHIEVEMENTS.map(a => `• ${a.title} - ${a.subtitle} (${a.date})`).join('\n')}
=================================================================`;

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Yogabalan_B_R_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
        role="presentation"
      >
        <motion.div 
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl shadow-[8px_10px_0px_#141517] p-5 sm:p-10 my-8 text-[#141517] max-h-[92vh] overflow-y-auto focus:outline-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 no-print">
            <WashiTape className="w-36 h-6" color="rgba(254, 240, 138, 0.9)" angle="-1deg" />
          </div>

          {/* Modal Controls (No Print) */}
          <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-[#141517]/15 gap-3">
            <div className="flex items-center gap-2">
              <span id="resume-modal-title" className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D4ED8]">
                ENGINEER RESUME // FORMAL CURRICULUM VITAE
              </span>
            </div>

            {/* Actions & Zoom Controls */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center bg-[#F8F5EE] border border-[#141517]/20 rounded-lg p-0.5 text-xs font-mono">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.8))}
                  className="p-1.5 hover:bg-[#FFFFFF] rounded text-[#141517] cursor-pointer focus:ring-1 focus:ring-[#1D4ED8]"
                  title="Zoom Out"
                  aria-label="Zoom out resume"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-bold">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.3))}
                  className="p-1.5 hover:bg-[#FFFFFF] rounded text-[#141517] cursor-pointer focus:ring-1 focus:ring-[#1D4ED8]"
                  title="Zoom In"
                  aria-label="Zoom in resume"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 hover:bg-[#FFFFFF] rounded text-[#575961] cursor-pointer focus:ring-1 focus:ring-[#1D4ED8]"
                  title="Reset Zoom"
                  aria-label="Reset resume zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={handleDownloadTextCV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#141517] bg-[#F8F5EE] border border-[#141517] rounded-lg shadow-xs hover:bg-[#FFFFFF] transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8]"
                title="Download text file version"
              >
                <Download className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span className="hidden sm:inline">Export Text</span>
              </button>

              <a
                href="/Yogabalan-Resume.pdf"
                download="Yogabalan-BR-Resume.pdf"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1D4ED8] rounded-lg shadow-sm hover:bg-[#141517] transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8]"
                title="Download PDF resume"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Download PDF</span>
              </a>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#141517] rounded-lg shadow-sm hover:bg-[#1D4ED8] transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8]"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Print</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-[#141517] hover:bg-[#141517]/10 rounded-lg transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8]"
                aria-label="Close resume dialog"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* RESUME DOCUMENT BODY (SCALABLE & PRINTABLE) */}
          <div 
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }} 
            className="space-y-6 text-[#141517] transition-transform duration-150"
          >
            
            {/* Header */}
            <div className="border-b-2 border-[#141517] pb-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#141517]">
                {PERSONAL_INFO.name}
              </h1>
              <p className="text-sm font-mono font-semibold text-[#1D4ED8] mt-1">
                {PERSONAL_INFO.role}
              </p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs font-mono text-[#575961]">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#141517]" />
                  {PERSONAL_INFO.email}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-[#141517]" />
                  github.com/{PERSONAL_INFO.githubUsername}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-[#141517]" />
                  linkedin.com/in/{LINKEDIN_HANDLE}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#141517]" />
                  {PERSONAL_INFO.location}
                </span>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h2 className="text-xs font-mono font-extrabold text-[#141517] uppercase tracking-wider mb-2 border-b border-[#141517]/15 pb-1">
                Professional Summary
              </h2>
              <p className="text-xs sm:text-sm text-[#575961] leading-relaxed">
                {PERSONAL_INFO.bio}
              </p>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-mono font-extrabold text-[#141517] uppercase tracking-wider mb-2 border-b border-[#141517]/15 pb-1">
                Education
              </h2>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-[#141517]">{EDUCATION.institution}</h3>
                  <p className="text-xs text-[#575961]">{EDUCATION.degree}</p>
                  <p className="text-xs font-mono text-[#1D4ED8] mt-0.5">Status: {EDUCATION.currentStatus}</p>
                </div>
                <span className="text-xs font-mono text-[#575961]">{EDUCATION.period}</span>
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <h2 className="text-xs font-mono font-extrabold text-[#141517] uppercase tracking-wider mb-2 border-b border-[#141517]/15 pb-1">
                Work Experience
              </h2>
              {EXPERIENCE.map((exp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-[#141517]">{exp.role}</h3>
                      <p className="text-xs font-semibold text-[#1D4ED8]">{exp.company} — {exp.location}</p>
                    </div>
                    <span className="text-xs font-mono text-[#575961]">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#575961] pl-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Key Featured Projects */}
            <div>
              <h2 className="text-xs font-mono font-extrabold text-[#141517] uppercase tracking-wider mb-2 border-b border-[#141517]/15 pb-1">
                Selected Technical Projects
              </h2>
              <div className="space-y-3">
                {PROJECTS.slice(0, 4).map((p) => (
                  <div key={p.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-[#141517]">{p.name}</span>
                      <span className="text-[11px] font-mono text-[#1D4ED8]">
                        {p.technologies.slice(0, 4).join(', ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#575961]">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Grid */}
            <div>
              <h2 className="text-xs font-mono font-extrabold text-[#141517] uppercase tracking-wider mb-2 border-b border-[#141517]/15 pb-1">
                Technical Skill Matrix
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-bold text-[#141517]">Languages: </span>
                  <span className="text-[#575961]">C, Python, JavaScript, TypeScript, Embedded C++</span>
                </div>
                <div>
                  <span className="font-bold text-[#141517]">Hardware &amp; IoT: </span>
                  <span className="text-[#575961]">ESP32, Arduino, Raspberry Pi, LoRa SX1278, MPU6050, I2C/SPI</span>
                </div>
                <div>
                  <span className="font-bold text-[#141517]">Web &amp; Cloud: </span>
                  <span className="text-[#575961]">React, Vite, Node.js, Express, Tailwind CSS, REST APIs</span>
                </div>
                <div>
                  <span className="font-bold text-[#141517]">Databases &amp; Tools: </span>
                  <span className="text-[#575961]">PostgreSQL, Firebase, Supabase, Git, GitHub, Linux, VS Code</span>
                </div>
              </div>
            </div>

            {/* Honors & Wins */}
            <div>
              <h2 className="text-xs font-mono font-extrabold text-[#141517] uppercase tracking-wider mb-2 border-b border-[#141517]/15 pb-1">
                Honors &amp; Achievements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#575961] pl-1">
                {ACHIEVEMENTS.map((a) => (
                  <li key={a.id}>
                    <strong className="text-[#141517]">{a.title}</strong> — {a.subtitle} ({a.date})
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
