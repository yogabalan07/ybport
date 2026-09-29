import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SKILLS } from '../data/portfolioData';
import { SkillItem } from '../types/portfolio';
import { WashiTape, CircuitTraceDoodle, StarDoodle } from './doodles/DoodleIcons';
import { 
  ESP32DevKitDoodle, 
  ArduinoUnoDoodle, 
  RaspberryPiDoodle, 
  LoRaModuleDoodle, 
  MPU6050Doodle, 
  ICChipDoodle, 
  ResistorDoodle, 
  LEDDoodle, 
  OLEDScreenDoodle 
} from './doodles/ElectronicsDoodles';
import { Wrench, Code2, Cpu, Globe, Database, Terminal, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSkill, setActiveSkill] = useState<SkillItem>(SKILLS[4]); // Default to ESP32
  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);

  const categories = [
    { name: 'All', icon: Wrench },
    { name: 'Programming', icon: Code2 },
    { name: 'Embedded / IoT', icon: Cpu },
    { name: 'Web Development', icon: Globe },
    { name: 'Backend / Database', icon: Database },
    { name: 'Tools', icon: Terminal },
  ];

  // Mapping of related skill synergies for interactive highlighting
  const relatedSkillsMap: Record<string, string[]> = {
    'ESP32': ['LoRa', 'Arduino', 'Sensors', 'Embedded Systems', 'IoT', 'C'],
    'LoRa': ['ESP32', 'Sensors', 'Embedded Systems', 'IoT', 'C'],
    'Arduino': ['ESP32', 'Sensors', 'Embedded Systems', 'C'],
    'Sensors': ['ESP32', 'Arduino', 'Embedded Systems', 'IoT'],
    'Raspberry Pi': ['Linux', 'Python', 'IoT', 'Git'],
    'Embedded Systems': ['ESP32', 'Arduino', 'Sensors', 'LoRa', 'C'],
    'IoT': ['ESP32', 'LoRa', 'Raspberry Pi', 'Firebase', 'Supabase'],
    'React': ['TypeScript', 'JavaScript', 'Vite', 'Tailwind CSS', 'Node.js'],
    'TypeScript': ['React', 'Node.js', 'Express', 'JavaScript'],
    'JavaScript': ['React', 'TypeScript', 'Node.js', 'HTML', 'CSS'],
    'Vite': ['React', 'TypeScript', 'Tailwind CSS'],
    'Node.js': ['Express', 'TypeScript', 'PostgreSQL', 'Firebase'],
    'Express': ['Node.js', 'PostgreSQL', 'Supabase', 'TypeScript'],
    'PostgreSQL': ['Node.js', 'Express', 'Supabase', 'TypeScript'],
    'Firebase': ['React', 'TypeScript', 'Node.js', 'IoT'],
    'Supabase': ['PostgreSQL', 'React', 'TypeScript'],
    'Tailwind CSS': ['React', 'HTML', 'CSS', 'Vite'],
    'C': ['ESP32', 'Arduino', 'Embedded Systems', 'Linux'],
    'Python': ['Raspberry Pi', 'Linux', 'Git'],
    'Git': ['GitHub', 'VS Code', 'Linux'],
    'GitHub': ['Git', 'VS Code'],
    'VS Code': ['Git', 'TypeScript', 'Linux'],
    'Linux': ['Raspberry Pi', 'Python', 'Git', 'VS Code'],
    'HTML': ['CSS', 'JavaScript', 'React'],
    'CSS': ['HTML', 'Tailwind CSS', 'React']
  };

  const renderSkillDoodle = (name: string) => {
    switch (name) {
      case 'ESP32':
        return <ESP32DevKitDoodle className="w-40 h-32 mx-auto my-1" interactive={false} />;
      case 'Arduino':
        return <ArduinoUnoDoodle className="w-36 h-28 mx-auto my-1" />;
      case 'Raspberry Pi':
        return <RaspberryPiDoodle className="w-36 h-28 mx-auto my-1" />;
      case 'LoRa':
        return <LoRaModuleDoodle className="w-24 h-20 mx-auto my-1" />;
      case 'Sensors':
        return <MPU6050Doodle className="w-24 h-20 mx-auto my-1" />;
      case 'C':
      case 'Python':
      case 'TypeScript':
      case 'JavaScript':
        return <ICChipDoodle name={name} pins={14} className="w-24 h-16 mx-auto my-1" />;
      case 'Embedded Systems':
      case 'IoT':
        return <OLEDScreenDoodle className="w-28 h-22 mx-auto my-1" />;
      default:
        return <ResistorDoodle className="w-24 h-8 mx-auto my-1 text-[#1D4ED8]" value={name} />;
    }
  };

  const currentRelated = hoveredSkillName 
    ? relatedSkillsMap[hoveredSkillName] || []
    : relatedSkillsMap[activeSkill.name] || [];

  const filteredSkills = selectedCategory === 'All'
    ? SKILLS
    : SKILLS.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20 bg-[#F4F1E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#141517]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#1D4ED8]">
                Capabilities &amp; Tech Stack
              </span>
              <span className="font-hand text-sm text-[#EA580C] font-semibold">// no generic percentage bars</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#141517] tracking-tight mt-1">
              ENGINEERING TOOLBOX
            </h2>
          </div>
          <p className="text-sm font-mono text-[#575961] mt-2 sm:mt-0 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Hover stickers to reveal connected stack nodes</span>
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-[#EAE6DC] rounded-xl border border-[#141517]/15">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#141517] text-white shadow-xs'
                    : 'text-[#575961] hover:text-[#141517] hover:bg-[#FFFFFF]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-yellow-400' : 'text-[#575961]'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Grid layout: Skills Stickers on Left + Active Skill Detail Spec Sheet on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SKILL STICKERS / LABELS (8 Cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredSkills.map((skill, idx) => {
              const isSelected = activeSkill.name === skill.name;
              const isSynergy = currentRelated.includes(skill.name);
              const isHovered = hoveredSkillName === skill.name;

              return (
                <motion.button
                  key={skill.name}
                  onClick={() => setActiveSkill(skill)}
                  onMouseEnter={() => setHoveredSkillName(skill.name)}
                  onMouseLeave={() => setHoveredSkillName(null)}
                  whileHover={{ 
                    rotate: idx % 2 === 0 ? 1.5 : -1.5,
                    y: -3,
                    transition: { duration: 0.15 }
                  }}
                  className={`group relative text-left p-3.5 rounded-xl border-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#141517] shadow-[3px_4px_0px_#1D4ED8] -translate-y-1'
                      : isSynergy
                      ? 'bg-[#EFF6FF] border-[#1D4ED8] shadow-[2px_3px_0px_#1D4ED8]/60 scale-[1.02]'
                      : 'bg-[#FCFBF8] border-[#141517]/20 hover:border-[#141517] hover:shadow-[2px_3px_0px_#141517]'
                  }`}
                >
                  {/* Synergy Tag Indicator */}
                  {isSynergy && (
                    <span className="absolute -top-2 right-2 text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#1D4ED8] text-white font-bold">
                      Linked
                    </span>
                  )}

                  {/* Category label */}
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#575961] truncate">
                    {skill.category.split('/')[0]}
                  </span>

                  {/* Skill Name */}
                  <span className={`block text-base font-extrabold transition-colors mt-0.5 ${
                    isSelected || isSynergy ? 'text-[#1D4ED8]' : 'text-[#141517]'
                  }`}>
                    {skill.name}
                  </span>

                  {/* Tag label */}
                  <span className="inline-block mt-2 text-[11px] font-mono px-2 py-0.5 rounded bg-[#F4F1E8] text-[#141517] border border-[#141517]/10 group-hover:bg-[#FFFFFF]">
                    {skill.tag}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* ACTIVE TOOL SPEC SHEET / NOTEBOOK CARD (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <motion.div 
              key={activeSkill.name}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl p-6 shadow-[5px_6px_0px_#141517]"
            >
              
              {/* Corner tape */}
              <div className="absolute -top-3 left-8">
                <WashiTape className="w-20 h-5" color="rgba(254, 240, 138, 0.9)" angle="-3deg" />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#141517]/15">
                <span className="text-xs font-mono font-bold text-[#1D4ED8] uppercase flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  SPECIFICATION LEDGER
                </span>
                <span className="text-[11px] font-mono text-[#575961]">
                  DOC: YB-{activeSkill.name.toUpperCase().slice(0, 3)}
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-[#141517]">
                    {activeSkill.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono text-[#EA580C]">
                    <span>Domain:</span>
                    <span className="font-semibold text-[#141517]">{activeSkill.category}</span>
                  </div>
                </div>

                {/* Hand-Drawn Component Illustration */}
                <div className="p-2.5 bg-[#FAF7F0] border border-[#141517]/15 rounded-xl flex items-center justify-center overflow-hidden">
                  {renderSkillDoodle(activeSkill.name)}
                </div>

                <div className="p-3 bg-[#F8F5EE] border border-[#141517]/15 rounded-xl space-y-1">
                  <span className="text-[11px] font-mono text-[#575961] uppercase tracking-wider block">
                    Focus / Specialization
                  </span>
                  <span className="text-sm font-bold text-[#141517] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {activeSkill.proficiencyLabel}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono font-semibold text-[#575961] block mb-1">
                    ENGINEERING CONTEXT &amp; USAGE:
                  </span>
                  <p className="text-xs sm:text-sm text-[#141517] leading-relaxed bg-[#FCFBF8] p-3 rounded-lg border border-[#141517]/10">
                    {activeSkill.context}
                  </p>
                </div>

                {/* Related Tool Synergy Chips */}
                <div>
                  <span className="text-[11px] font-mono font-semibold text-[#575961] uppercase block mb-1.5">
                    Direct Stack Synergies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(relatedSkillsMap[activeSkill.name] || []).map((rel) => (
                      <span key={rel} className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#EFF6FF] border border-[#1D4ED8]/30 text-[#1D4ED8] font-bold">
                        + {rel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#141517]/10 flex items-center justify-between">
                  <span className="font-hand text-sm text-[#575961]">
                    Click any sticker to inspect
                  </span>
                  <span className="font-mono text-xs text-[#1D4ED8] font-bold">
                    [Production Tested]
                  </span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

        {/* Engineering Circuit Trace divider */}
        <div className="mt-14 opacity-40">
          <CircuitTraceDoodle />
        </div>

      </div>
    </section>
  );
};
