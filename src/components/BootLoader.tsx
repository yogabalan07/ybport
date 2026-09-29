import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu } from 'lucide-react';

interface BootLoaderProps {
  onComplete: () => void;
}

export const BootLoader: React.FC<BootLoaderProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw the boot sequence this session
    const hasBooted = sessionStorage.getItem('yb_booted');
    if (hasBooted) {
      onComplete();
      return;
    }

    const steps = [
      { text: "> initializing embedded systems & firmware...", delay: 200 },
      { text: "> loading verified projects & schematics...", delay: 500 },
      { text: "> establishing IoT & cloud broker telemetry...", delay: 850 },
      { text: "> ready. booting sketchbook interface...", delay: 1150 },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    steps.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        setLogs((prev) => [...prev, text]);
      }, delay);
      timeouts.push(t);
    });

    const finishTimeout = setTimeout(() => {
      setIsDone(true);
      sessionStorage.setItem('yb_booted', 'true');
      setTimeout(onComplete, 400);
    }, 1500);
    timeouts.push(finishTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F5EE] bg-grid-paper"
        >
          <div className="w-full max-w-md mx-4 p-6 bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl shadow-[6px_7px_0px_#141517] relative">
            {/* Washi tape header */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-amber-200/80 border-x-2 border-dashed border-amber-400/50 -rotate-1 shadow-xs" />

            <div className="flex items-center justify-between pb-3 border-b border-[#141517]/20">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#141517]">YB.</span>
                <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-ping" />
              </div>
              <span className="text-xs font-mono text-[#575961] flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#1D4ED8]" />
                Booting portfolio...
              </span>
            </div>

            <div className="mt-4 font-mono text-xs text-[#141517] space-y-1.5 min-h-[90px]">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={i === logs.length - 1 && i === 3 ? "text-[#1D4ED8] font-bold" : "text-[#575961]"}
                >
                  {log}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#141517]/10 flex items-center justify-between text-[11px] font-mono text-[#575961]">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-[#EA580C]" />
                <span>Yogabalan B R // CSE</span>
              </span>
              <button
                onClick={() => {
                  sessionStorage.setItem('yb_booted', 'true');
                  setIsDone(true);
                  onComplete();
                }}
                className="text-[#1D4ED8] hover:underline cursor-pointer"
              >
                Skip [Esc] →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
