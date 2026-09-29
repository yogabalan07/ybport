import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, FileText, ArrowRight } from 'lucide-react';
import { HandDrawnUnderline, WashiTape } from './doodles/DoodleIcons';

interface NavbarProps {
  onOpenResume: () => void;
}

// Static navigation definition (module scope: not re-created per render,
// stable reference for the scroll-spy effect).
const navLinks = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Achievements', href: '#achievements', id: 'achievements' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Scroll work is coalesced to one rAF callback per frame instead of
    // running full section measurements on every scroll event.
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      setIsScrolled(window.scrollY > 20);

      // Determine active section based on scroll offset
      const scrollPos = window.scrollY + 200;

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const sec = document.getElementById(navLinks[i].id);
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    const handleScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F5EE]/95 backdrop-blur-md py-2.5 border-b border-[#141517]/20 shadow-[0_4px_12px_rgba(20,21,23,0.05)]'
          : 'bg-[#F8F5EE] py-4 sm:py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single text wordmark with live status dot */}
        <a
          href="#home"
          className="group flex items-center gap-1.5 text-2xl font-black tracking-tight text-[#141517]"
          aria-label="Yogabalan B R - Home"
        >
          <span>YB</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] group-hover:scale-125 transition-transform" />
          <span className="hidden sm:inline-block font-hand text-sm text-[#575961] ml-1 font-bold group-hover:text-[#141517] transition-colors">
            // digital sketchbook
          </span>
        </a>

        {/* Zone 2: Navigation links with pen-drawn underline on active */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#575961]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative py-1 font-semibold transition-colors ${
                  isActive ? 'text-[#141517]' : 'text-[#575961] hover:text-[#141517]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-1.5 pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    <HandDrawnUnderline className="w-full h-2 text-[#1D4ED8]" color="#1D4ED8" />
                  </motion.div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Resume Action Button + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenResume}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-[#141517] bg-[#FFFFFF] border-1.5 border-[#141517] rounded-lg shadow-[2px_2px_0px_#141517] hover:shadow-[3px_3px_0px_#141517] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_#141517] transition-all whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Resume</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#141517] hover:bg-[#141517]/5 rounded-lg transition-colors cursor-pointer border border-[#141517]/20"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Paper Unfold Animation) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden border-b-2 border-[#141517] bg-[#FAF7F0] px-4 pt-3 pb-6 space-y-2 origin-top shadow-md relative overflow-hidden"
          >
            {/* Top Washi Tape */}
            <div className="absolute top-1 right-6 pointer-events-none">
              <WashiTape className="w-16 h-4" color="rgba(254, 240, 138, 0.85)" angle="2deg" />
            </div>

            <div className="text-xs font-mono font-bold text-[#1D4ED8] uppercase pb-1 border-b border-[#141517]/10">
              // Notebook Navigation
            </div>

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#141517] text-white shadow-xs'
                    : 'text-[#141517] hover:bg-[#141517]/5'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            ))}

            <div className="pt-3 border-t border-[#141517]/15">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-[#1D4ED8] rounded-xl shadow-[3px_3px_0px_#141517] cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Open Full Resume &amp; CV</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
