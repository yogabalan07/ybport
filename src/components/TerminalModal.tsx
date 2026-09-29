import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Sparkles, Check, ExternalLink, HelpCircle, Code, Cpu } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILLS, EXPERIENCE, EDUCATION, ACHIEVEMENTS, GITHUB_STATS, LINKEDIN_HANDLE } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import { WashiTape, HandDrawnArrow } from './doodles/DoodleIcons';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  onOpenSnake: () => void;
  onSelectProject: (project: Project) => void;
  currentTheme: 'paper' | 'dark' | 'blueprint';
  onSetTheme: (theme: 'paper' | 'dark' | 'blueprint') => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const REGISTERED_COMMANDS = [
  'help',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'achievements',
  'github',
  'resume',
  'contact',
  'clear',
  'whoami',
  'status',
  'hardware',
  'neofetch',
  'snake',
  'theme',
  'date',
  'coffee',
  'build',
  'matrix',
  'hello',
  'sudo'
];

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  onOpenResume,
  onOpenSnake,
  onSelectProject,
  currentTheme,
  onSetTheme,
}) => {
  const containerRef = useFocusTrap(isOpen, onClose);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsBooting(true);
      const timer = setTimeout(() => {
        setIsBooting(false);
        inputRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll to bottom whenever history updates
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isBooting]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCommandExecution = useCallback((rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Save to command history for Up/Down arrow navigation
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-amber-300 font-bold">Available commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[#E2E8F0]">
              <div><span className="text-[#93C5FD] font-bold">about</span> : About Yogabalan</div>
              <div><span className="text-[#93C5FD] font-bold">skills</span> : View technical skills</div>
              <div><span className="text-[#93C5FD] font-bold">projects</span> : Explore verified projects</div>
              <div><span className="text-[#93C5FD] font-bold">experience</span> : View professional roadmap</div>
              <div><span className="text-[#93C5FD] font-bold">education</span> : View academic groundwork</div>
              <div><span className="text-[#93C5FD] font-bold">achievements</span> : View honors &amp; awards</div>
              <div><span className="text-[#93C5FD] font-bold">github</span> : Open GitHub repository ledger</div>
              <div><span className="text-[#93C5FD] font-bold">resume</span> : View &amp; download resume</div>
              <div><span className="text-[#93C5FD] font-bold">contact</span> : Contact channels &amp; email</div>
              <div><span className="text-[#93C5FD] font-bold">status</span> : Simulated system status</div>
              <div><span className="text-[#93C5FD] font-bold">neofetch</span> : Portfolio system information</div>
              <div><span className="text-[#93C5FD] font-bold">snake</span> : Launch Snake game easter egg</div>
              <div><span className="text-[#93C5FD] font-bold">theme</span> : Change visual theme</div>
              <div><span className="text-[#93C5FD] font-bold">clear</span> : Clear terminal display</div>
              <div><span className="text-[#93C5FD] font-bold">date</span> : Display current local date</div>
              <div><span className="text-[#93C5FD] font-bold">whoami</span> : Identity &amp; engineer role</div>
            </div>
            <p className="text-[11px] text-[#94A3B8] pt-1">
              Tip: Click any quick command below or type <span className="text-amber-300">"projects &lt;name&gt;"</span>
            </p>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <h4 className="text-sm font-black text-white">{PERSONAL_INFO.name}</h4>
            <p className="text-[#93C5FD] font-bold">Computer Science Engineering Student</p>
            <p className="text-[#E2E8F0]">{PERSONAL_INFO.role}</p>
            <p className="text-amber-300 italic">"{PERSONAL_INFO.tagline}"</p>
            <p className="text-[#94A3B8] leading-relaxed pt-1">{PERSONAL_INFO.bio}</p>
            <div className="pt-2">
              <button
                onClick={() => {
                  scrollToSection('about');
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1D4ED8] hover:bg-[#2563EB] text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                <span>[View About Section]</span>
              </button>
            </div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-amber-300 font-bold block mb-0.5">PROGRAMMING</span>
              <span className="text-[#E2E8F0]">C · Python · JavaScript · TypeScript</span>
            </div>
            <div>
              <span className="text-amber-300 font-bold block mb-0.5">EMBEDDED / IoT</span>
              <span className="text-[#E2E8F0]">ESP32 · Arduino · Raspberry Pi · LoRa (433MHz) · Sensors</span>
            </div>
            <div>
              <span className="text-amber-300 font-bold block mb-0.5">WEB</span>
              <span className="text-[#E2E8F0]">React · Vite · Node.js · Express · Tailwind CSS</span>
            </div>
            <div>
              <span className="text-amber-300 font-bold block mb-0.5">DATABASE / BACKEND</span>
              <span className="text-[#E2E8F0]">Firebase · Supabase · PostgreSQL</span>
            </div>
            <div>
              <span className="text-amber-300 font-bold block mb-0.5">TOOLS</span>
              <span className="text-[#E2E8F0]">Git · GitHub · Linux · VS Code</span>
            </div>
            <p className="text-emerald-400 font-semibold pt-1">Opening Engineering Toolbox...</p>
          </div>
        );
        scrollToSection('skills');
        break;

      case 'projects':
        if (!arg) {
          output = (
            <div className="space-y-2 text-xs font-mono">
              <span className="text-amber-300 font-bold block">VERIFIED PROJECT INDEX (7 Systems):</span>
              <div className="space-y-1.5 pt-1">
                {PROJECTS.map((proj, idx) => (
                  <div key={proj.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-1.5 rounded hover:bg-[#1E293B] transition-colors">
                    <div>
                      <span className="text-[#93C5FD] font-bold mr-2">0{idx + 1}</span>
                      <span className="text-white font-bold">{proj.name}</span>
                      <span className="text-[10px] text-[#94A3B8] ml-2 hidden sm:inline">[{proj.category.join(', ')}]</span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectProject(proj);
                      }}
                      className="text-[11px] text-[#38BDF8] hover:text-white underline font-semibold self-start sm:self-auto cursor-pointer"
                    >
                      [Inspect Blueprint]
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#94A3B8] pt-1">
                Tip: Type <span className="text-amber-300">"projects connect"</span> or <span className="text-amber-300">"projects lora"</span> to query directly.
              </p>
            </div>
          );
        } else {
          // Specific project query
          const found = PROJECTS.find(p => 
            p.id.toLowerCase().includes(arg) || 
            p.name.toLowerCase().includes(arg) ||
            p.tagline.toLowerCase().includes(arg)
          );

          if (found) {
            output = (
              <div className="space-y-2 text-xs font-mono p-2 bg-[#1E293B] rounded-lg border border-[#334155]">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-amber-300">{found.name}</h4>
                  <span className="text-[10px] bg-[#0284C7] text-white px-2 py-0.5 rounded font-bold">{found.badge || 'Verified'}</span>
                </div>
                <p className="text-[#E2E8F0]">{found.tagline}</p>
                <p className="text-[#94A3B8] text-[11px] leading-relaxed">{found.problemSolved}</p>
                <div className="text-[11px] text-[#38BDF8]">
                  Stack: {found.technologies.join(', ')}
                </div>
                <div className="pt-1 flex items-center gap-3">
                  <button
                    onClick={() => {
                      onSelectProject(found);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#1D4ED8] hover:bg-[#2563EB] text-white rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>[Inspect Project]</span>
                  </button>
                  {found.githubUrl && (
                    <a
                      href={found.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-white"
                    >
                      <span>GitHub Repo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          } else {
            output = (
              <div className="text-xs font-mono text-red-400">
                Project matching "{arg}" not found. Type "projects" to view all 7 available systems.
              </div>
            );
          }
        }
        break;

      case 'experience':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <span className="text-amber-300 font-bold block">PROFESSIONAL ROADMAP:</span>
            {EXPERIENCE.map(exp => (
              <div key={exp.company} className="p-2 bg-[#1E293B] rounded border border-[#334155] space-y-1">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>{exp.role}</span>
                  <span className="text-amber-300 text-[11px]">{exp.period}</span>
                </div>
                <p className="text-[#93C5FD]">{exp.company} — {exp.location}</p>
                <ul className="list-disc list-inside text-[#94A3B8] text-[11px] space-y-0.5">
                  {exp.highlights.slice(0, 2).map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => {
                scrollToSection('experience');
                onClose();
              }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#1D4ED8] text-white rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <span>[Scroll to Experience]</span>
            </button>
          </div>
        );
        break;

      case 'education':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <span className="text-amber-300 font-bold block">ACADEMIC GROUNDWORK:</span>
            <p className="text-white font-bold">{EDUCATION.degree}</p>
            <p className="text-[#93C5FD]">{EDUCATION.institution} · {EDUCATION.period} ({EDUCATION.currentStatus})</p>
            <p className="text-[#94A3B8] text-[11px]">
              Coursework: {EDUCATION.coursework.join(', ')}
            </p>
            <button
              onClick={() => {
                scrollToSection('education');
                onClose();
              }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#1D4ED8] text-white rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <span>[Scroll to Education]</span>
            </button>
          </div>
        );
        break;

      case 'achievements':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <span className="text-amber-300 font-bold block">HONORS &amp; ACHIEVEMENTS:</span>
            <div className="space-y-1.5">
              {ACHIEVEMENTS.map(ach => (
                <div key={ach.id} className="p-1.5 bg-[#1E293B] rounded text-[11px]">
                  <span className="text-amber-400 font-bold">{ach.title}</span> — <span className="text-[#E2E8F0]">{ach.subtitle}</span>
                  <span className="text-[#94A3B8] block text-[10px]">{ach.description}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                scrollToSection('achievements');
                onClose();
              }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#1D4ED8] text-white rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <span>[Scroll to Wall of Wins]</span>
            </button>
          </div>
        );
        break;

      case 'github':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <span className="text-amber-300 font-bold block">GITHUB NOTEBOOK LEDGER</span>
            <p className="text-white">Profile: <span className="text-[#38BDF8]">github.com/{GITHUB_STATS.username}</span></p>
            <p className="text-[#E2E8F0]">Public repositories: {GITHUB_STATS.publicRepos}</p>
            <p className="text-[#E2E8F0]">Focus: C++ &amp; TypeScript</p>
            <p className="text-[#94A3B8] text-[11px]">Counts verified via the public GitHub API.</p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href={GITHUB_STATS.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1D4ED8] hover:bg-[#2563EB] text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                <span>[Open GitHub]</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  scrollToSection('github');
                  onClose();
                }}
                className="text-[11px] text-[#38BDF8] underline cursor-pointer"
              >
                View Heatmap in Portfolio
              </button>
            </div>
          </div>
        );
        break;

      case 'resume':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-emerald-400 font-semibold">&gt; Loading resume...</p>
            <p className="text-[#E2E8F0]">Launching printable Curriculum Vitae &amp; PDF download modal.</p>
          </div>
        );
        setTimeout(() => {
          onOpenResume();
        }, 300);
        break;

      case 'contact':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <span className="text-amber-300 font-bold block">CONTACT TRANSMISSION CHANNELS</span>
            <div className="space-y-1">
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">Email</span>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="text-[#38BDF8] hover:underline font-bold">
                  {PERSONAL_INFO.email}
                </a>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">LinkedIn</span>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline font-bold">
                  linkedin.com/in/{LINKEDIN_HANDLE}
                </a>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">GitHub</span>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline font-bold">
                  github.com/{PERSONAL_INFO.githubUsername}
                </a>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  scrollToSection('contact');
                  onClose();
                }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#1D4ED8] text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                <span>[Scroll to Contact Form]</span>
              </button>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-[#94A3B8]">&gt; identifying user...</p>
            <h4 className="text-sm font-black text-white">{PERSONAL_INFO.name}</h4>
            <div>
              <span className="text-amber-300 font-bold block text-[10px]">ROLE</span>
              <span className="text-[#E2E8F0]">Computer Science Engineering Student (3rd Year)</span>
            </div>
            <div>
              <span className="text-amber-300 font-bold block text-[10px]">INTERESTS</span>
              <span className="text-[#E2E8F0]">Embedded Systems · IoT · Software Engineering</span>
            </div>
            <div>
              <span className="text-amber-300 font-bold block text-[10px]">MODE</span>
              <span className="text-emerald-400 font-bold">BUILDING REAL SYSTEMS</span>
            </div>
          </div>
        );
        break;

      case 'status':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <span className="text-amber-300 font-bold block">SYSTEM STATUS // SIMULATION MODE</span>
            <p className="text-[11px] text-[#94A3B8]">
              Portfolio system visualization — hardware telemetry not connected.
            </p>
            <div className="space-y-1 text-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <span>ESP32</span>
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  SIMULATION MODE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>SENSORS</span>
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  SIMULATION MODE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>LoRa</span>
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  SIMULATION MODE (433MHz)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>MQTT</span>
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  SIMULATION MODE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>SYSTEM</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  PORTFOLIO UI ACTIVE
                </span>
              </div>
            </div>
          </div>
        );
        break;

      case 'hardware':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <span className="text-amber-300 font-bold block">DETECTED HARDWARE BENCHMARK (PORTFOLIO SPEC)</span>
            <div className="space-y-1.5 text-[#E2E8F0]">
              <div className="p-2 bg-[#1E293B] rounded border border-[#334155]">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>ESP32 DevKit V1</span>
                  <span className="text-emerald-400 text-[10px]">3.3V LOGIC</span>
                </div>
                <p className="text-[#94A3B8] text-[11px]">Xtensa LX6 32-bit Dual-Core 240MHz · 520KB SRAM · Wi-Fi + BLE 4.2</p>
              </div>

              <div className="p-2 bg-[#1E293B] rounded border border-[#334155]">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>MPU6050 6-DOF IMU</span>
                  <span className="text-[#38BDF8] text-[10px]">I2C 0x68</span>
                </div>
                <p className="text-[#94A3B8] text-[11px]">3-Axis Gyroscope + 3-Axis Accelerometer · 400kHz Fast I2C · Complementary Filter</p>
              </div>

              <div className="p-2 bg-[#1E293B] rounded border border-[#334155]">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>0.96" SSD1306 OLED</span>
                  <span className="text-[#38BDF8] text-[10px]">I2C 0x3C</span>
                </div>
                <p className="text-[#94A3B8] text-[11px]">128x64 Monochrome Graphic Display · Real-time RSSI &amp; Morse Telemetry</p>
              </div>

              <div className="p-2 bg-[#1E293B] rounded border border-[#334155]">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>LoRa SX1278 Module</span>
                  <span className="text-amber-400 text-[10px]">SPI // 433MHz</span>
                </div>
                <p className="text-[#94A3B8] text-[11px]">Sub-GHz Long Range Transceiver · Spreading Factor 7-12 · 3.2km Tested Range</p>
              </div>
            </div>
            <p className="text-[10px] text-[#64748B] italic">
              Note: Simulated device specification profiles for portfolio visitor inspection.
            </p>
          </div>
        );
        break;

      case 'neofetch':
        output = (
          <div className="space-y-2 text-xs font-mono text-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <pre className="text-amber-300 font-mono text-[10px] sm:text-xs leading-tight select-none">
{`        YB.
     _________
    /         \\
   /  ENGINEER \\
   \\  BUILDER  /
    \\_________/`}
              </pre>
              <div className="space-y-0.5 text-[11px]">
                <div><span className="text-[#38BDF8] font-bold">SYSTEM</span>   : Yogabalan Portfolio CLI (simulation)</div>
                <div><span className="text-[#38BDF8] font-bold">STACK</span>    : React 19 / TypeScript / Vite / Tailwind</div>
                <div><span className="text-[#38BDF8] font-bold">FOCUS</span>    : Embedded Systems + IoT + Full-Stack</div>
                <div><span className="text-[#38BDF8] font-bold">HARDWARE</span> : ESP32 / LoRa SX1278 / Arduino / Sensors</div>
                <div><span className="text-[#38BDF8] font-bold">PROJECTS</span> : 7 Portfolio Projects</div>
                <div><span className="text-[#38BDF8] font-bold">GITHUB</span>   : {GITHUB_STATS.username}</div>
                <div><span className="text-[#38BDF8] font-bold">STATUS</span>   : BUILDING REAL SYSTEMS</div>
                <div><span className="text-[#38BDF8] font-bold">TERMINAL</span> : Front-end simulation, no shell connected</div>
              </div>
            </div>
          </div>
        );
        break;

      case 'snake':
        output = (
          <div className="space-y-1 text-xs font-mono text-emerald-400">
            <p>&gt; launching mini engineering break...</p>
            <p className="text-[#94A3B8]">Opening Snake Game canvas modal.</p>
          </div>
        );
        setTimeout(() => {
          onOpenSnake();
        }, 300);
        break;

      case 'theme':
        if (!arg) {
          output = (
            <div className="space-y-2 text-xs font-mono">
              <p className="text-amber-300 font-bold">Available themes:</p>
              <ol className="list-decimal list-inside space-y-1 text-[#E2E8F0]">
                <li><span className="text-[#93C5FD] font-bold">paper</span> (Warm engineering sketchbook canvas — Default)</li>
                <li><span className="text-[#93C5FD] font-bold">dark</span> (Midnight engineer drafting slate)</li>
                <li><span className="text-[#93C5FD] font-bold">blueprint</span> (Technical drafting cyan-navy)</li>
              </ol>
              <p className="text-[11px] text-[#94A3B8]">
                Usage: <span className="text-amber-300">theme paper</span>, <span className="text-amber-300">theme dark</span>, <span className="text-amber-300">theme blueprint</span>
              </p>
              <div className="flex gap-2 pt-1">
                {(['paper', 'dark', 'blueprint'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      onSetTheme(t);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      currentTheme === t ? 'bg-[#1D4ED8] text-white' : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    Set {t}
                  </button>
                ))}
              </div>
            </div>
          );
        } else if (arg === 'paper' || arg === 'dark' || arg === 'blueprint') {
          onSetTheme(arg as 'paper' | 'dark' | 'blueprint');
          output = (
            <div className="text-xs font-mono text-emerald-400">
              ✓ Theme switched to: <span className="text-white font-bold">{arg}</span>
            </div>
          );
        } else {
          output = (
            <div className="text-xs font-mono text-red-400">
              Unknown theme "{arg}". Choose from: paper, dark, blueprint.
            </div>
          );
        }
        break;

      case 'date':
        output = (
          <div className="text-xs font-mono text-[#E2E8F0]">
            System Time: <span className="text-amber-300 font-bold">{new Date().toLocaleString()}</span>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'sudo':
        output = (
          <div className="space-y-1 text-xs font-mono text-amber-300">
            <p>Nice try. 😄</p>
            <p className="text-[#94A3B8]">This portfolio terminal doesn't need sudo. You already have full access!</p>
          </div>
        );
        break;

      case 'coffee':
        output = (
          <div className="space-y-1 text-xs font-mono text-amber-300">
            <p>☕ Caffeine subsystem: ONLINE</p>
            <p className="text-[#94A3B8]">Brewing logic, microcontrollers &amp; clean frontend code.</p>
          </div>
        );
        break;

      case 'build':
        output = (
          <div className="space-y-1 text-xs font-mono text-[#E2E8F0]">
            <p className="text-[#94A3B8]">&gt; compiling ideas...</p>
            <p className="text-[#94A3B8]">&gt; testing sensor interrupts...</p>
            <p className="text-[#94A3B8]">&gt; debugging packet buffers...</p>
            <p className="text-[#94A3B8]">&gt; building hardware firmware and web stack...</p>
            <p className="text-emerald-400 font-bold pt-1">Status: BUILD SUCCESSFUL ✓</p>
          </div>
        );
        break;

      case 'matrix':
        setIsMatrixActive(true);
        setTimeout(() => setIsMatrixActive(false), 2600);
        output = (
          <div className="text-xs font-mono text-emerald-400 animate-pulse">
            [Stream active: 01000101 01010011 01010000 00110011 00110010]
          </div>
        );
        break;

      case 'hello':
      case 'hi':
        output = (
          <div className="text-xs font-mono text-[#E2E8F0]">
            Hello, fellow builder. 👋 Welcome to Yogabalan's engineering console.
          </div>
        );
        break;

      default:
        output = (
          <div className="text-xs font-mono space-y-1">
            <p className="text-red-400">Command not found: <span className="font-bold">{trimmed}</span></p>
            <p className="text-[#94A3B8]">Type <span className="text-amber-300">"help"</span> to view all available commands.</p>
          </div>
        );
        break;
    }

    setHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        command: trimmed,
        output,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);

    setInputVal('');
  }, [onClose, onOpenResume, onOpenSnake, onSelectProject, currentTheme, onSetTheme]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandExecution(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex >= commandHistory.length - 1 || historyIndex === -1) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const match = REGISTERED_COMMANDS.find(c => c.startsWith(current));
      if (match) {
        setInputVal(match);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
        role="presentation"
      >
        <motion.div 
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="terminal-title"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`relative w-full ${isMaximized ? 'max-w-6xl h-[92vh]' : 'max-w-3xl h-[80vh] min-h-[460px]'} bg-[#0F172A] border-2 border-[#334155] rounded-2xl shadow-[8px_10px_0px_#141517] flex flex-col text-[#F8FAFC] overflow-hidden select-text focus:outline-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Washi Tape on Outer Frame */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <WashiTape className="w-32 h-6" color="rgba(254, 240, 138, 0.9)" angle="1deg" />
          </div>

          {/* Terminal Window Header */}
          <div className="px-4 py-3 bg-[#1E293B] border-b border-[#334155] flex items-center justify-between select-none">
            {/* Terminal Window Dots */}
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#EF4444] hover:opacity-80 transition-opacity cursor-pointer"
                title="Close"
                aria-label="Close terminal"
              />
              <button 
                onClick={() => setIsMaximized(prev => !prev)}
                className="w-3 h-3 rounded-full bg-[#EAB308] hover:opacity-80 transition-opacity cursor-pointer"
                title="Maximize / Restore"
                aria-label="Toggle window size"
              />
              <div 
                className="w-3 h-3 rounded-full bg-[#22C55E]"
                title="Active"
              />
              <span id="terminal-title" className="text-xs font-mono font-bold text-[#E2E8F0] ml-2 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                YB TERMINAL // PORTFOLIO CLI (SIMULATION)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-mono text-[11px] text-[#94A3B8]">
                session: <span className="text-emerald-400">active</span>
              </span>
              <button
                onClick={() => setIsMaximized(prev => !prev)}
                className="text-[#94A3B8] hover:text-white p-1 rounded transition-colors hidden sm:block cursor-pointer"
                title={isMaximized ? "Restore" : "Maximize"}
                aria-label={isMaximized ? "Restore window" : "Maximize window"}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="text-[#94A3B8] hover:text-white p-1 rounded transition-colors cursor-pointer"
                aria-label="Close terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Command Pills Bar */}
          <div className="px-4 py-2 bg-[#131E33] border-b border-[#334155] flex flex-wrap items-center gap-1.5 text-xs font-mono select-none overflow-x-auto">
            <span className="text-[10px] uppercase text-[#94A3B8] font-bold mr-1">Quick:</span>
            {['help', 'projects', 'skills', 'github', 'resume', 'snake', 'status', 'neofetch'].map((qc) => (
              <button
                key={qc}
                onClick={() => handleCommandExecution(qc)}
                className="px-2 py-0.5 bg-[#1E293B] hover:bg-[#38BDF8] hover:text-[#0F172A] border border-[#334155] rounded text-[11px] font-semibold text-[#CBD5E1] transition-colors cursor-pointer"
              >
                {qc}
              </button>
            ))}
          </div>

          {/* Terminal Body Content */}
          <div 
            className="flex-1 p-4 sm:p-5 overflow-y-auto font-mono text-xs sm:text-sm space-y-4 relative"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Matrix Easter Egg Overlay */}
            {isMatrixActive && (
              <div className="absolute inset-0 bg-[#0F172A]/90 pointer-events-none flex flex-col justify-around text-emerald-400 font-mono text-xs opacity-80 overflow-hidden select-none p-4">
                <div>01001001 01001111 01010100 00100000 01000101 01010011 01010000 00110011 00110010</div>
                <div>01000011 01001111 01001110 01001110 01000101 01000011 01010100 00100000 01010010</div>
                <div>01010011 01000101 01001110 01010011 01001111 01010010 00100000 01001110 01001111</div>
                <div>01000110 01010010 01000101 01000101 01010010 01010100 01001111 01010011 00100000</div>
              </div>
            )}

            {/* Booting Sequence */}
            {isBooting ? (
              <div className="space-y-1 text-[#94A3B8] text-xs">
                <p>&gt; initializing portfolio CLI...</p>
                <p>&gt; loading project index...</p>
                <p>&gt; loading engineering notebook...</p>
                <p className="text-emerald-400 font-bold">&gt; terminal ready.</p>
              </div>
            ) : (
              <div className="space-y-1 text-[#94A3B8] text-xs pb-2 border-b border-[#334155]/60">
                <p className="text-white font-bold">Yogabalan B R — Portfolio CLI</p>
                <p>Type <span className="text-amber-300 font-bold">"help"</span> to view all available commands. Press <span className="text-[#38BDF8]">Tab</span> to autocomplete.</p>
                <p className="text-[11px] text-[#64748B]">Front-end simulation — no shell or hardware is connected.</p>
              </div>
            )}

            {/* Executed Command History */}
            {history.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 font-bold">yb@portfolio:~$</span>
                  <span className="text-white font-bold">{item.command}</span>
                  <span className="text-[10px] text-[#64748B] ml-auto">{item.timestamp}</span>
                </div>
                <div className="pl-4 border-l-2 border-[#334155] py-0.5">
                  {item.output}
                </div>
              </div>
            ))}

            <div ref={terminalBottomRef} />
          </div>

          {/* Active Command Input Line */}
          <div className="p-3 bg-[#1E293B] border-t border-[#334155] flex items-center gap-2 select-none">
            <span className="text-emerald-400 font-mono text-xs sm:text-sm font-bold whitespace-nowrap">
              yb@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type a command (e.g. "help", "projects", "skills")...'
              className="flex-1 bg-transparent border-none text-white font-mono text-xs sm:text-sm placeholder:text-[#64748B] focus:outline-hidden"
              autoFocus
              aria-label="Terminal command prompt"
            />
            <button
              onClick={() => handleCommandExecution(inputVal)}
              className="p-1.5 bg-[#38BDF8] hover:bg-[#0284C7] text-[#0F172A] rounded transition-colors cursor-pointer"
              title="Execute Command (Enter)"
              aria-label="Execute command"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
