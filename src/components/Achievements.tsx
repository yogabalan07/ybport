import React from 'react';
import { motion } from 'motion/react';
import { ACHIEVEMENTS } from '../data/portfolioData';
import { WashiTape, StarDoodle, HandDrawnArrow } from './doodles/DoodleIcons';
import { Trophy, Medal, Rocket, Lightbulb, Sparkles } from 'lucide-react';

export const Achievements: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 'medal':
        return <Medal className="w-6 h-6 text-yellow-500" />;
      case 'rocket':
        return <Rocket className="w-6 h-6 text-[#1D4ED8]" />;
      default:
        return <Lightbulb className="w-6 h-6 text-[#EA580C]" />;
    }
  };

  return (
    <section id="achievements" className="py-20 bg-[#F4F1E8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#141517]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
                Milestones &amp; Honors
              </span>
              <span className="font-hand text-base text-[#EA580C] font-bold">// battle tested</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#141517] tracking-tight mt-1">
              05 — WALL OF WINS
            </h2>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center gap-1.5 text-xs font-mono text-[#575961]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Honors &amp; Hackathons</span>
          </div>
        </div>

        {/* 4 Illustrated Cards / Stickers with landing physics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACHIEVEMENTS.map((item, idx) => {
            const initialRotation = idx % 2 === 0 ? 1.5 : -1.5;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: initialRotation }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -6, 
                  rotate: 0,
                  transition: { type: "spring", stiffness: 350, damping: 20 }
                }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl p-6 shadow-[4px_5px_0px_#141517] hover:shadow-[6px_8px_0px_#141517] transition-shadow flex flex-col justify-between"
              >
                {/* Washi Tape */}
                <div className="absolute -top-3 left-6">
                  <WashiTape
                    className="w-16 h-5"
                    color={idx % 2 === 0 ? "rgba(254, 240, 138, 0.9)" : "rgba(191, 219, 254, 0.9)"}
                    angle={idx % 2 === 0 ? "-2deg" : "3deg"}
                  />
                </div>

                <div className="space-y-4">
                  
                  {/* Icon & Doodle Label */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="p-2.5 rounded-xl bg-[#F8F5EE] border border-[#141517]/20">
                      {getIcon(item.icon)}
                    </div>

                    <span className="font-hand text-base font-bold text-[#141517] px-2 py-0.5 bg-[#FEF9C3] rounded-md border border-amber-300 flex items-center gap-1">
                      <StarDoodle className="w-3.5 h-3.5 text-amber-500" />
                      <span>{item.doodleLabel}</span>
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-black text-[#141517] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono font-semibold text-[#1D4ED8] mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#575961] leading-relaxed">
                    {item.description}
                  </p>

                </div>

                {/* Date stamp footer */}
                <div className="mt-5 pt-3 border-t border-[#141517]/10 flex items-center justify-between text-[11px] font-mono text-[#575961]">
                  <span>Timeline:</span>
                  <span className="font-bold text-[#141517]">{item.date}</span>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
