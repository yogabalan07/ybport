import React, { useState, useEffect, Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Achievements } from './components/Achievements';
import { GitHubSection } from './components/GitHubSection';
import { ResumeSection } from './components/ResumeSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BootLoader } from './components/BootLoader';
import { DraftingCursor } from './components/DraftingCursor';
import { NotFoundPage } from './components/NotFoundPage';
import { SectionSketchDivider } from './components/doodles/DoodleIcons';
import { ModalLoadingOverlay } from './components/ModuleLoadingOverlay';
import { Project } from './types/portfolio';

// Heavy interactive modules are code-split: they only download when first opened.
const ResumeModal = React.lazy(() =>
  import('./components/ResumeModal').then((m) => ({ default: m.ResumeModal }))
);
const SnakeGameModal = React.lazy(() =>
  import('./components/SnakeGameModal').then((m) => ({ default: m.SnakeGameModal }))
);
const TerminalModal = React.lazy(() =>
  import('./components/TerminalModal').then((m) => ({ default: m.TerminalModal }))
);
const ProjectBlueprintModal = React.lazy(() =>
  import('./components/ProjectBlueprintModal').then((m) => ({ default: m.ProjectBlueprintModal }))
);

export default function App() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isSnakeModalOpen, setIsSnakeModalOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInspectProject, setTerminalInspectProject] = useState<Project | null>(null);
  // Mount-once flags: lazy modals load on first open, then stay mounted so
  // exit animations, focus restore and reopening behave exactly as before.
  const [resumeMounted, setResumeMounted] = useState(false);
  const [snakeMounted, setSnakeMounted] = useState(false);
  const [terminalMounted, setTerminalMounted] = useState(false);
  const [blueprintMounted, setBlueprintMounted] = useState(false);
  const [bootCompleted, setBootCompleted] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [currentTheme, setCurrentTheme] = useState<'paper' | 'dark' | 'blueprint'>(() => {
    try {
      return (localStorage.getItem('yogabalan_portfolio_theme') as any) || 'paper';
    } catch {
      return 'paper';
    }
  });

  // Apply theme attribute to html document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Lazily-mounted modals: fetch their chunk on first open only.
  useEffect(() => {
    if (isResumeModalOpen) setResumeMounted(true);
  }, [isResumeModalOpen]);
  useEffect(() => {
    if (isSnakeModalOpen) setSnakeMounted(true);
  }, [isSnakeModalOpen]);
  useEffect(() => {
    if (isTerminalOpen) setTerminalMounted(true);
  }, [isTerminalOpen]);
  useEffect(() => {
    if (terminalInspectProject) setBlueprintMounted(true);
  }, [terminalInspectProject]);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Keyboard Shortcuts: Escape closes modals, 'G' toggles Snake, 'T' or '`' toggles Terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere if user is typing into input, textarea, select, or editable element
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if (e.key === 'Escape') {
        setIsResumeModalOpen(false);
        setIsSnakeModalOpen(false);
        setIsTerminalOpen(false);
        setTerminalInspectProject(null);
      } else if (!isInput && (e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setIsSnakeModalOpen(prev => !prev);
      } else if (!isInput && (e.key === 't' || e.key === 'T' || e.key === '`') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setIsTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const is404 = currentPath !== '/' && currentPath !== '' && currentPath !== '/index.html';

  if (is404) {
    return (
      <NotFoundPage
        onReturnHome={() => {
          window.history.pushState({}, '', '/');
          setCurrentPath('/');
        }}
      />
    );
  }

  return (
    // reducedMotion="user": JS-driven Motion animations (entrances, layout) now
    // respect prefers-reduced-motion, not just the CSS overrides in index.css.
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[#F8F5EE] text-[#141517] font-sans selection:bg-[#FACC15] selection:text-[#121316] relative overflow-x-hidden">
      {/* Booting Loader Experience (Short & Non-intrusive) */}
      {!bootCompleted && (
        <BootLoader onComplete={() => setBootCompleted(true)} />
      )}

      {/* Subtle Desktop Drafting Crosshair Cursor */}
      <DraftingCursor />

      {/* Floating Notebook Navigation Header */}
      <Navbar onOpenResume={() => setIsResumeModalOpen(true)} />

      {/* Main Content Sections with Sketch Dividers */}
      <main>
        <Hero 
          onOpenResume={() => setIsResumeModalOpen(true)} 
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />
        
        <SectionSketchDivider label="01. Profile &amp; Mindset" />
        <About />

        <SectionSketchDivider label="Toolbox &amp; Architecture" />
        <Skills />

        <SectionSketchDivider label="02. Verified Systems &amp; Schematics" />
        <Projects />

        <SectionSketchDivider label="03. Professional Roadmap" />
        <Experience />

        <SectionSketchDivider label="04. Academic Groundwork" />
        <Education />

        <SectionSketchDivider label="05. Hackathons &amp; Honors" />
        <Achievements />

        <SectionSketchDivider label="06. Source Repositories" />
        <GitHubSection />

        <SectionSketchDivider label="Engineering Credentials" />
        <ResumeSection onOpenResume={() => setIsResumeModalOpen(true)} />

        <SectionSketchDivider label="Transmission Channel" />
        <Contact />
      </main>

      {/* Minimal Footer with Easter Egg Trigger */}
      <Footer onOpenSnakeGame={() => setIsSnakeModalOpen(true)} />

      {/* Fullscreen Printable / Scalable Resume Modal (lazy: loads on first open) */}
      {resumeMounted && (
        <Suspense fallback={<ModalLoadingOverlay />}>
          <ResumeModal
            isOpen={isResumeModalOpen}
            onClose={() => setIsResumeModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Mini Snake Game Easter Egg Modal (lazy: loads on first open) */}
      {snakeMounted && (
        <Suspense fallback={<ModalLoadingOverlay />}>
          <SnakeGameModal
            isOpen={isSnakeModalOpen}
            onClose={() => setIsSnakeModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Interactive Command Line Terminal Modal (lazy: loads on first open) */}
      {terminalMounted && (
        <Suspense fallback={<ModalLoadingOverlay />}>
          <TerminalModal
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            onOpenResume={() => setIsResumeModalOpen(true)}
            onOpenSnake={() => setIsSnakeModalOpen(true)}
            onSelectProject={(proj) => setTerminalInspectProject(proj)}
            currentTheme={currentTheme}
            onSetTheme={(theme) => {
              setCurrentTheme(theme);
              try {
                localStorage.setItem('yogabalan_portfolio_theme', theme);
              } catch {}
            }}
          />
        </Suspense>
      )}

      {/* Terminal Project Blueprint Deep-Dive Modal (lazy: loads on first open) */}
      {blueprintMounted && (
        <Suspense fallback={<ModalLoadingOverlay />}>
          <ProjectBlueprintModal
            project={terminalInspectProject}
            onClose={() => setTerminalInspectProject(null)}
          />
        </Suspense>
      )}
    </div>
    </MotionConfig>
  );
}
