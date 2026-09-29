import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Trophy, AlertTriangle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Terminal } from 'lucide-react';
import { WashiTape, HandDrawnArrow, StarDoodle } from './doodles/DoodleIcons';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface SnakeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED_MS = 115;

const FOOD_COMPONENTS = ['ESP32', 'GPIO', 'SENSOR', 'BYTE', 'PACKET', 'DATA', 'IoT'];
const EAT_MESSAGES = [
  '+1 DATA PACKET',
  'GPIO ACQUIRED',
  'PACKET RECEIVED',
  'BYTE BUFFERED',
  'ESP32 SYNCD',
  'SENSOR POLLED'
];

export const SnakeGameModal: React.FC<SnakeGameModalProps> = ({ isOpen, onClose }) => {
  const containerRef = useFocusTrap(isOpen, onClose);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [foodLabel, setFoodLabel] = useState<string>('ESP32');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('yogabalan_snake_high_score') || '0', 10) || 0;
    } catch {
      return 0;
    }
  });

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [eatNotification, setEatNotification] = useState<string | null>(null);

  // Web Audio Context for synthesized sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'eat' | 'die') => {
    if (!soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      if (type === 'eat') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'die') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      }
    } catch {
      // Audio not supported or blocked
    }
  }, [soundEnabled]);

  // Generate random food not on snake body
  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOnSnake: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOnSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
    } while (isOnSnake);

    const nextLabel = FOOD_COMPONENTS[Math.floor(Math.random() * FOOD_COMPONENTS.length)];
    setFoodLabel(nextLabel);
    return newFood;
  }, []);

  // Reset Game
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setEatNotification(null);
    setFood(spawnFood(INITIAL_SNAKE));
  }, [spawnFood]);

  // Direction Change Handler (prevents 180-degree reversing)
  const changeDirection = useCallback((newDir: Direction) => {
    const current = nextDirectionRef.current;
    if (newDir === 'UP' && current !== 'DOWN') nextDirectionRef.current = 'UP';
    if (newDir === 'DOWN' && current !== 'UP') nextDirectionRef.current = 'DOWN';
    if (newDir === 'LEFT' && current !== 'RIGHT') nextDirectionRef.current = 'LEFT';
    if (newDir === 'RIGHT' && current !== 'LEFT') nextDirectionRef.current = 'RIGHT';
  }, []);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is inside an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        changeDirection('UP');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        changeDirection('DOWN');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        changeDirection('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        changeDirection('RIGHT');
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, changeDirection, resetGame]);

  // Main game tick loop
  useEffect(() => {
    if (!isOpen || isGameOver || isPaused) return;

    const intervalId = setInterval(() => {
      setSnake(prevSnake => {
        const currentDir = nextDirectionRef.current;
        setDirection(currentDir);

        const head = prevSnake[0];
        const newHead: Point = { x: head.x, y: head.y };

        if (currentDir === 'UP') newHead.y -= 1;
        if (currentDir === 'DOWN') newHead.y += 1;
        if (currentDir === 'LEFT') newHead.x -= 1;
        if (currentDir === 'RIGHT') newHead.x += 1;

        // Collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          playSound('die');
          return prevSnake;
        }

        // Collision with self
        if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setIsGameOver(true);
          playSound('die');
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          playSound('eat');
          const newScore = score + 1;
          setScore(newScore);

          if (newScore > highScore) {
            setHighScore(newScore);
            try {
              localStorage.setItem('yogabalan_snake_high_score', newScore.toString());
            } catch {
              // quota
            }
          }

          // Trigger eat notification
          const msg = EAT_MESSAGES[Math.floor(Math.random() * EAT_MESSAGES.length)];
          setEatNotification(msg);
          setTimeout(() => setEatNotification(null), 1200);

          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED_MS);

    return () => clearInterval(intervalId);
  }, [isOpen, isGameOver, isPaused, food, score, highScore, playSound, spawnFood]);

  // Render Canvas Board
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = width / GRID_SIZE;

    // Background: Warm Paper
    ctx.fillStyle = '#FAF7F0';
    ctx.fillRect(0, 0, width, height);

    // Subtle Engineering Grid Lines
    ctx.strokeStyle = 'rgba(20, 21, 23, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }

    // Food Drawing: Electric Blue Node with circuit terminal styling
    const foodPixelX = food.x * cellSize;
    const foodPixelY = food.y * cellSize;

    // Food subtle pulse ring
    ctx.fillStyle = 'rgba(29, 78, 216, 0.15)';
    ctx.beginPath();
    ctx.arc(foodPixelX + cellSize / 2, foodPixelY + cellSize / 2, cellSize * 0.48, 0, Math.PI * 2);
    ctx.fill();

    // Food core
    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath();
    ctx.roundRect(foodPixelX + 2, foodPixelY + 2, cellSize - 4, cellSize - 4, 3);
    ctx.fill();

    // Inner gold pin dot
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(foodPixelX + cellSize / 2, foodPixelY + cellSize / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Snake Drawing: Deep Ink Segments with rounded joins
    snake.forEach((seg, idx) => {
      const segX = seg.x * cellSize;
      const segY = seg.y * cellSize;

      if (idx === 0) {
        // Head
        ctx.fillStyle = '#141517';
        ctx.beginPath();
        ctx.roundRect(segX + 1.5, segY + 1.5, cellSize - 3, cellSize - 3, 4);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FAF7F0';
        let eye1X = segX + 5, eye1Y = segY + 5;
        let eye2X = segX + cellSize - 7, eye2Y = segY + 5;

        if (direction === 'DOWN') {
          eye1Y = segY + cellSize - 7;
          eye2Y = segY + cellSize - 7;
        } else if (direction === 'LEFT') {
          eye1X = segX + 5; eye1Y = segY + 5;
          eye2X = segX + 5; eye2Y = segY + cellSize - 7;
        } else if (direction === 'RIGHT') {
          eye1X = segX + cellSize - 7; eye1Y = segY + 5;
          eye2X = segX + cellSize - 7; eye2Y = segY + cellSize - 7;
        }

        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 1.8, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body segment (ink with subtle stroke)
        ctx.fillStyle = '#1E2024';
        ctx.beginPath();
        ctx.roundRect(segX + 2, segY + 2, cellSize - 4, cellSize - 4, 2);
        ctx.fill();

        // Subtle PCB trace centerline in segment
        ctx.strokeStyle = 'rgba(250, 247, 240, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(segX + 4, segY + cellSize / 2);
        ctx.lineTo(segX + cellSize - 4, segY + cellSize / 2);
        ctx.stroke();
      }
    });

  }, [isOpen, snake, food, direction]);

  if (!isOpen) return null;

  // Milestone Easter Egg Message
  const getMilestoneMessage = (s: number) => {
    if (s >= 100) return 'Okay... you actually play this. 👑';
    if (s >= 50) return 'Engineer mode unlocked. ⚡';
    if (s >= 25) return 'System behaving normally. 🚀';
    if (s >= 10) return 'Nice debugging. 💡';
    return null;
  };
  const milestone = getMilestoneMessage(score);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
        role="presentation"
      >
        <motion.div 
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="snake-modal-title"
          aria-describedby="snake-modal-subtitle"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-[#FAF7F0] border-2 border-[#141517] rounded-3xl shadow-[8px_10px_0px_#141517] p-5 sm:p-8 my-6 text-[#141517] max-h-[94vh] overflow-y-auto focus:outline-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <WashiTape className="w-32 h-6" color="rgba(254, 240, 138, 0.9)" angle="-1deg" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#141517] hover:bg-[#141517]/10 rounded-lg transition-colors cursor-pointer focus:ring-2 focus:ring-[#1D4ED8] focus:outline-hidden"
            aria-label="Close snake game"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="border-b border-[#141517]/15 pb-3 pr-14 sm:pr-12">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
                EASTER EGG // HARDWARE BREAK
              </span>
              <span className="font-hand text-sm text-[#EA580C] font-bold">
                // press 'G' or 'Esc'
              </span>
            </div>
            <h2 id="snake-modal-title" className="text-2xl sm:text-3xl font-black tracking-tight text-[#141517] mt-0.5">
              MINI ENGINEERING BREAK
            </h2>
            <p id="snake-modal-subtitle" className="text-xs sm:text-sm font-mono text-[#575961] mt-0.5">
              Debug the snake. Don't debug production.
            </p>
          </div>

          {/* Score & Telemetry Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FFFFFF] border border-[#141517]/15 rounded-xl shadow-xs">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-[#575961] uppercase text-[10px] block">Score</span>
                <span className="text-lg font-black text-[#141517] tabular-nums">
                  {score.toString().padStart(3, '0')}
                </span>
              </div>

              <div className="h-6 w-px bg-[#141517]/15" />

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[#575961] uppercase text-[10px] block">High Score</span>
                  <Trophy className="w-3 h-3 text-amber-500" />
                </div>
                <span className="text-lg font-black text-[#1D4ED8] tabular-nums">
                  {highScore.toString().padStart(3, '0')}
                </span>
              </div>
            </div>

            {/* Target Component Node Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#575961] uppercase">Next Node:</span>
              <span className="px-2 py-0.5 rounded bg-[#1D4ED8]/10 border border-[#1D4ED8]/30 text-xs font-mono font-bold text-[#1D4ED8]">
                {foodLabel}
              </span>
            </div>

            {/* Action Buttons: Sound & Pause & Reset */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(prev => !prev)}
                className={`p-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-colors ${
                  soundEnabled 
                    ? 'bg-[#141517] text-white border-[#141517]' 
                    : 'bg-[#F8F5EE] text-[#575961] border-[#141517]/20 hover:text-[#141517]'
                }`}
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsPaused(prev => !prev)}
                className="p-1.5 rounded-lg bg-[#F8F5EE] border border-[#141517]/20 hover:bg-[#141517] hover:text-white transition-colors text-[#141517] cursor-pointer"
                title={isPaused ? 'Resume (Space)' : 'Pause (Space)'}
                aria-label={isPaused ? 'Resume game' : 'Pause game'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                onClick={resetGame}
                className="p-1.5 rounded-lg bg-[#F8F5EE] border border-[#141517]/20 hover:bg-[#141517] hover:text-white transition-colors text-[#141517] cursor-pointer"
                title="Restart (R)"
                aria-label="Restart game"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* GAME BOARD CANVAS CONTAINER */}
          <div className="relative mt-4 mx-auto max-w-[420px] aspect-square bg-[#FAF7F0] border-2 border-[#141517] rounded-2xl shadow-[4px_5px_0px_#141517] overflow-hidden select-none">
            
            {/* Subtle Engineering Annotations at Board Corners */}
            <span className="absolute top-1.5 left-2 text-[9px] font-mono text-[#575961]/60 tracking-wider pointer-events-none">
              GPIO_04
            </span>
            <span className="absolute top-1.5 right-2 text-[9px] font-mono text-[#575961]/60 tracking-wider pointer-events-none">
              I/O_BUS
            </span>
            <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-[#575961]/60 tracking-wider pointer-events-none">
              RING_BUFFER[20]
            </span>
            <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-[#575961]/60 tracking-wider pointer-events-none">
              CLK: 8.7Hz
            </span>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full h-full block"
            />

            {/* Dynamic Eat Notification Badge */}
            <AnimatePresence>
              {eatNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FEF9C3] border border-amber-300 rounded-lg shadow-sm text-center pointer-events-none"
                >
                  <span className="font-hand text-base font-bold text-amber-950">
                    {eatNotification}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pause Overlay */}
            {isPaused && !isGameOver && (
              <div className="absolute inset-0 bg-[#FAF7F0]/85 backdrop-blur-xs flex flex-col items-center justify-center space-y-3">
                <span className="font-hand text-2xl font-bold text-[#141517]">
                  "System Clock Halted // Paused"
                </span>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-5 py-2 text-xs font-mono font-bold text-white bg-[#141517] rounded-xl shadow-[3px_3px_0px_#1D4ED8] hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                >
                  Resume Loop (Space)
                </button>
              </div>
            )}

            {/* Game Over Screen */}
            {isGameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-[#FAF7F0]/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 border border-red-300 rounded-full text-xs font-mono font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>CONNECTION LOST</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#141517]">
                  Snake crashed into the system.
                </h3>

                <div className="py-2 flex items-center justify-center gap-6 text-xs font-mono">
                  <div>
                    <span className="text-[#575961] block text-[10px]">FINAL SCORE</span>
                    <span className="text-2xl font-black text-[#141517]">{score}</span>
                  </div>
                  <div className="h-8 w-px bg-[#141517]/20" />
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                      <StarDoodle className="w-3.5 h-3.5 text-amber-500" />
                      <span>PERSONAL BEST</span>
                    </div>
                    <span className="text-2xl font-black text-[#1D4ED8]">{highScore}</span>
                  </div>
                </div>

                {milestone && (
                  <p className="font-hand text-lg text-[#1D4ED8] font-bold">
                    "{milestone}"
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={resetGame}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#141517] rounded-xl shadow-[3px_3px_0px_#1D4ED8] hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                  >
                    REBOOT SYSTEM (R)
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-bold text-[#141517] bg-[#FFFFFF] border-1.5 border-[#141517] rounded-xl shadow-[2px_2px_0px_#141517] hover:bg-[#F8F5EE] transition-colors cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Milestone Toast under board if active */}
          {milestone && !isGameOver && (
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF9C3] border border-amber-300 rounded-full font-hand text-sm text-amber-950 font-bold shadow-xs">
                <StarDoodle className="w-3.5 h-3.5 text-amber-500" />
                {milestone}
              </span>
            </div>
          )}

          {/* TOUCH / MOBILE CONTROLS & KEYBOARD HINTS */}
          <div className="mt-5 pt-4 border-t border-[#141517]/15">
            {/* Desktop Hint */}
            <div className="hidden sm:flex items-center justify-between text-[11px] font-mono text-[#575961]">
              <span>Controls: Arrow Keys or W A S D</span>
              <span>Space = Pause · R = Reboot · Esc = Exit</span>
            </div>

            {/* Mobile Touch D-Pad */}
            <div className="sm:hidden flex flex-col items-center gap-2 pt-1 select-none">
              <button
                type="button"
                onClick={() => changeDirection('UP')}
                className="w-14 h-12 bg-[#FFFFFF] active:bg-[#141517] active:text-white border-2 border-[#141517] rounded-xl shadow-[2px_3px_0px_#141517] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Move Up"
              >
                <ArrowUp className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeDirection('LEFT')}
                  className="w-14 h-12 bg-[#FFFFFF] active:bg-[#141517] active:text-white border-2 border-[#141517] rounded-xl shadow-[2px_3px_0px_#141517] flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Move Left"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={() => changeDirection('DOWN')}
                  className="w-14 h-12 bg-[#FFFFFF] active:bg-[#141517] active:text-white border-2 border-[#141517] rounded-xl shadow-[2px_3px_0px_#141517] flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Move Down"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={() => changeDirection('RIGHT')}
                  className="w-14 h-12 bg-[#FFFFFF] active:bg-[#141517] active:text-white border-2 border-[#141517] rounded-xl shadow-[2px_3px_0px_#141517] flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Move Right"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              <div className="text-[10px] font-mono text-[#575961] mt-1">
                Touch arrows to steer snake
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
