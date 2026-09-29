import React from 'react';
import { motion } from 'motion/react';

// ==========================================
// 1. PASSIVE COMPONENTS (Resistor, Capacitor, Inductor)
// ==========================================

export const ResistorDoodle: React.FC<{ 
  className?: string; 
  value?: string;
  horizontal?: boolean;
}> = ({
  className = "w-24 h-10 text-[#141517]",
  value = "10kΩ",
  horizontal = true
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Left axial lead */}
        <path d="M5 20 H30" />
        {/* Zig-zag resistor body */}
        <path d="M30 20 L36 10 L44 30 L52 10 L60 30 L68 10 L76 30 L84 10 L90 20" strokeWidth="2.4" />
        {/* Color bands (aesthetic dots/stripes) */}
        <line x1="42" y1="12" x2="42" y2="28" stroke="#92400E" strokeWidth="2" />
        <line x1="56" y1="12" x2="56" y2="28" stroke="#1E293B" strokeWidth="2" />
        <line x1="70" y1="12" x2="70" y2="28" stroke="#EA580C" strokeWidth="2" />
        {/* Right axial lead */}
        <path d="M90 20 H115" />
      </svg>
      {value && (
        <span className="font-mono text-[9px] font-bold text-[#575961] -mt-1">{value}</span>
      )}
    </div>
  );
};

export const CapacitorDoodle: React.FC<{ 
  className?: string; 
  type?: 'ceramic' | 'electrolytic';
  value?: string;
}> = ({
  className = "w-16 h-14 text-[#141517]",
  type = 'electrolytic',
  value = "100µF"
}) => {
  if (type === 'ceramic') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-current" strokeWidth="2" strokeLinecap="round">
          {/* Ceramic disc body */}
          <circle cx="30" cy="24" r="16" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" />
          <text x="30" y="27" textAnchor="middle" fill="#78350F" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">104</text>
          {/* 2 Leads */}
          <path d="M24 40 V56" stroke="#141517" strokeWidth="2" />
          <path d="M36 40 V56" stroke="#141517" strokeWidth="2" />
        </svg>
        <span className="font-mono text-[9px] font-bold text-[#575961]">{value}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-current" strokeWidth="2" strokeLinecap="round">
        {/* Electrolytic cylinder can */}
        <rect x="18" y="8" width="24" height="38" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        {/* Negative stripe */}
        <line x1="22" y1="8" x2="22" y2="46" stroke="#94A3B8" strokeWidth="3" />
        <text x="22" y="28" textAnchor="middle" fill="#0F172A" fontSize="7" fontWeight="black" fontFamily="sans-serif">-</text>
        {/* Positive & Negative Leads */}
        <line x1="24" y1="46" x2="24" y2="65" stroke="#141517" strokeWidth="2" />
        <line x1="36" y1="46" x2="36" y2="60" stroke="#141517" strokeWidth="2" />
      </svg>
      <span className="font-mono text-[9px] font-bold text-[#575961]">{value}</span>
    </div>
  );
};

// ==========================================
// 2. SEMICONDUCTORS (LED, Diode, Transistor, IC)
// ==========================================

export const LEDDoodle: React.FC<{ 
  className?: string; 
  color?: string;
  glow?: boolean;
}> = ({
  className = "w-14 h-16 text-[#141517]",
  color = "#3B82F6",
  glow = true
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 60 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Glow halo */}
        {glow && (
          <circle cx="30" cy="22" r="18" fill={color} opacity="0.2" className="animate-pulse" />
        )}
        {/* Dome */}
        <path d="M20 30 V18 C20 12, 40 12, 40 18 V30 H18 Z" fill={color} fillOpacity="0.45" stroke="#141517" strokeWidth="2" strokeLinejoin="round" />
        {/* Rim collar */}
        <rect x="16" y="30" width="28" height="4" rx="1.5" fill="#141517" />
        {/* Inner anvil & post */}
        <path d="M26 28 V20 L29 17" stroke="#141517" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M34 28 V19" stroke="#141517" strokeWidth="1.2" strokeLinecap="round" />
        {/* Emission arrows */}
        <path d="M44 14 L52 8 M48 8 L52 8 L52 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M46 22 L54 16 M50 16 L54 16 L54 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Leads: Anode (longer) & Cathode */}
        <line x1="26" y1="34" x2="26" y2="70" stroke="#141517" strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="34" x2="34" y2="62" stroke="#141517" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-mono text-[8px] font-bold text-[#1D4ED8]">LED [3.3V]</span>
    </div>
  );
};

export const ICChipDoodle: React.FC<{ 
  className?: string; 
  name?: string;
  pins?: number;
}> = ({
  className = "w-24 h-16 text-[#141517]",
  name = "ATmega328P",
  pins = 14
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Top & Bottom Pin Legs */}
        {[...Array(7)].map((_, i) => (
          <React.Fragment key={i}>
            <rect x={18 + i * 13} y="4" width="6" height="8" fill="#CBD5E1" stroke="#141517" strokeWidth="1.5" />
            <rect x={18 + i * 13} y="58" width="6" height="8" fill="#CBD5E1" stroke="#141517" strokeWidth="1.5" />
          </React.Fragment>
        ))}
        {/* Main DIP Body */}
        <rect x="12" y="12" width="96" height="46" rx="3" fill="#1E293B" stroke="#141517" strokeWidth="2.2" />
        {/* Pin 1 notch */}
        <path d="M12 30 C 16 30, 16 40, 12 40" fill="#0F172A" stroke="#141517" strokeWidth="1.5" />
        <circle cx="22" cy="22" r="2.5" fill="#64748B" />
        {/* Text */}
        <text x="60" y="38" textAnchor="middle" fill="#FAF7F0" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
          {name}
        </text>
      </svg>
      <span className="font-mono text-[8px] text-[#575961] -mt-0.5">DIP-{pins} // IC</span>
    </div>
  );
};

export const PushButtonDoodle: React.FC<{ className?: string; label?: string }> = ({
  className = "w-14 h-14 text-[#141517]",
  label = "RESET"
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* 4 Corner Solder Legs */}
        <rect x="4" y="10" width="8" height="5" fill="#94A3B8" stroke="#141517" strokeWidth="1.5" />
        <rect x="4" y="45" width="8" height="5" fill="#94A3B8" stroke="#141517" strokeWidth="1.5" />
        <rect x="48" y="10" width="8" height="5" fill="#94A3B8" stroke="#141517" strokeWidth="1.5" />
        <rect x="48" y="45" width="8" height="5" fill="#94A3B8" stroke="#141517" strokeWidth="1.5" />
        {/* Metal Housing */}
        <rect x="10" y="10" width="40" height="40" rx="4" fill="#E2E8F0" stroke="#141517" strokeWidth="2" />
        {/* Center Round Actuator */}
        <circle cx="30" cy="30" r="11" fill="#1E293B" stroke="#141517" strokeWidth="2" />
        <circle cx="30" cy="30" r="6" fill="#DC2626" />
      </svg>
      <span className="font-mono text-[8px] font-bold text-[#575961]">{label}</span>
    </div>
  );
};

// ==========================================
// 3. SENSORS & MODULES (MPU6050, OLED, LoRa)
// ==========================================

export const MPU6050Doodle: React.FC<{ className?: string }> = ({
  className = "w-28 h-24 text-[#141517]"
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Breakout PCB Blue */}
        <rect x="8" y="10" width="104" height="78" rx="6" fill="#1E40AF" stroke="#141517" strokeWidth="2" />
        {/* Corner Mounting Holes */}
        <circle cx="16" cy="18" r="4" fill="#FAF7F0" stroke="#141517" strokeWidth="1.5" />
        <circle cx="104" cy="18" r="4" fill="#FAF7F0" stroke="#141517" strokeWidth="1.5" />
        {/* Sensor QFN IC in center */}
        <rect x="45" y="32" width="30" height="30" rx="2" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
        <circle cx="50" cy="37" r="1.5" fill="#FACC15" />
        {/* Coordinate axes XYZ */}
        <path d="M60 47 L60 38 M58 40 L60 38 L62 40" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M60 47 L69 47 M67 45 L69 47 L67 49" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
        <text x="60" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">GY-521 6-DOF</text>
        {/* Header Pin Row (VCC, GND, SCL, SDA, XDA, XCL, AD0, INT) */}
        {[...Array(8)].map((_, i) => (
          <circle key={i} cx={16 + i * 12.5} cy="80" r="3" fill="#FDE047" stroke="#141517" strokeWidth="1.2" />
        ))}
      </svg>
      <div className="flex gap-2 font-mono text-[8px] font-bold text-[#1D4ED8]">
        <span>MPU6050</span>
        <span className="text-[#059669]">I2C // 400kHz</span>
      </div>
    </div>
  );
};

export const OLEDScreenDoodle: React.FC<{ className?: string }> = ({
  className = "w-32 h-26 text-[#141517]"
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 130 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Blue carrier PCB */}
        <rect x="6" y="8" width="118" height="80" rx="5" fill="#1E3A8A" stroke="#141517" strokeWidth="2" />
        {/* 4-pin Header at top: GND, VCC, SCL, SDA */}
        <rect x="42" y="3" width="46" height="8" rx="2" fill="#0F172A" stroke="#141517" strokeWidth="1.5" />
        {['GND', 'VCC', 'SCL', 'SDA'].map((p, i) => (
          <circle key={p} cx={48 + i * 11} cy="7" r="2.5" fill="#FACC15" stroke="#141517" strokeWidth="1" />
        ))}
        {/* Black OLED Glass Screen */}
        <rect x="14" y="20" width="102" height="60" rx="3" fill="#020617" stroke="#475569" strokeWidth="1.5" />
        {/* Mini Sketched Telemetry Line Wave */}
        <path d="M20 50 H35 L40 38 L45 58 L50 46 L55 52 H75 L80 42 L85 54 H110" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="22" y="32" fill="#FACC15" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">0.96" SSD1306</text>
        <text x="22" y="72" fill="#38BDF8" fontSize="6.5" fontFamily="JetBrains Mono">RSSI: -64dBm OK</text>
      </svg>
      <span className="font-mono text-[8px] font-bold text-[#575961]">OLED 128x64 // I2C</span>
    </div>
  );
};

export const LoRaModuleDoodle: React.FC<{ className?: string }> = ({
  className = "w-28 h-26 text-[#141517]"
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Blue PCB */}
        <rect x="10" y="16" width="90" height="64" rx="4" fill="#0369A1" stroke="#141517" strokeWidth="2" />
        {/* Metal Shield Can */}
        <rect x="20" y="24" width="50" height="42" rx="3" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
        <text x="45" y="44" textAnchor="middle" fill="#0F172A" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">SX1278</text>
        <text x="45" y="53" textAnchor="middle" fill="#0F172A" fontSize="6" fontFamily="JetBrains Mono">433MHz</text>
        {/* Helical Spring Antenna Doodle */}
        <path d="M80 34 C88 34, 88 40, 80 40 C72 40, 72 46, 80 46 C88 46, 88 52, 80 52 C72 52, 72 58, 80 58 V68" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
        {/* Radio Waves */}
        <path d="M92 42 C96 46, 96 52, 92 56" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M97 38 C103 44, 103 54, 97 60" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
      <span className="font-mono text-[8px] font-bold text-[#0369A1]">LoRa SX1278 // SPI</span>
    </div>
  );
};

// ==========================================
// 4. DEVELOPMENT BOARDS (ESP32, Arduino Uno, Raspberry Pi)
// ==========================================

export const ESP32DevKitDoodle: React.FC<{ 
  className?: string;
  onHoverPin?: (pin: string) => void;
  interactive?: boolean;
}> = ({
  className = "w-52 h-44 text-[#141517]",
  onHoverPin,
  interactive = true
}) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Black DevKit PCB */}
        <rect x="25" y="10" width="150" height="130" rx="8" fill="#141517" stroke="#334155" strokeWidth="2" />
        {/* Micro-USB Port on top */}
        <rect x="85" y="4" width="30" height="12" rx="2" fill="#94A3B8" stroke="#141517" strokeWidth="1.5" />
        {/* EN and BOOT tactile buttons */}
        <rect x="35" y="20" width="12" height="12" rx="2" fill="#E2E8F0" stroke="#141517" strokeWidth="1.2" />
        <circle cx="41" cy="26" r="3" fill="#DC2626" />
        <text x="41" y="38" textAnchor="middle" fill="#94A3B8" fontSize="5" fontFamily="JetBrains Mono">EN</text>

        <rect x="153" y="20" width="12" height="12" rx="2" fill="#E2E8F0" stroke="#141517" strokeWidth="1.2" />
        <circle cx="159" cy="26" r="3" fill="#000000" />
        <text x="159" y="38" textAnchor="middle" fill="#94A3B8" fontSize="5" fontFamily="JetBrains Mono">BOOT</text>

        {/* Metal RF Shield Can (ESP-WROOM-32) */}
        <rect x="55" y="45" width="90" height="75" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
        <rect x="62" y="52" width="76" height="14" rx="2" fill="#1E293B" />
        <text x="100" y="62" textAnchor="middle" fill="#FAF7F0" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">ESP-WROOM-32</text>
        
        {/* Wi-Fi Antenna Trace on top of shield */}
        <path d="M75 75 H125 M85 82 H115 M92 89 H108" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
        <text x="100" y="108" textAnchor="middle" fill="#1E293B" fontSize="6.5" fontFamily="JetBrains Mono">Xtensa LX6 240MHz</text>

        {/* Left & Right Pin Headers with Tooltip Interaction */}
        {[...Array(15)].map((_, i) => (
          <React.Fragment key={i}>
            <circle 
              cx="32" 
              cy={24 + i * 7.5} 
              r="2.5" 
              fill="#FDE047" 
              stroke="#141517" 
              strokeWidth="1"
              className={interactive ? "hover:scale-140 hover:fill-[#38BDF8] cursor-pointer transition-transform" : ""}
              onMouseEnter={() => onHoverPin && onHoverPin(`GPIO_${i}`)}
            />
            <circle 
              cx="168" 
              cy={24 + i * 7.5} 
              r="2.5" 
              fill="#FDE047" 
              stroke="#141517" 
              strokeWidth="1"
              className={interactive ? "hover:scale-140 hover:fill-[#38BDF8] cursor-pointer transition-transform" : ""}
              onMouseEnter={() => onHoverPin && onHoverPin(`GPIO_${i + 15}`)}
            />
          </React.Fragment>
        ))}
      </svg>
      <div className="text-center font-mono text-[9px] font-bold text-[#1D4ED8]">
        ESP32 DEVKIT V1 // 3.3V
      </div>
    </div>
  );
};

export const ArduinoUnoDoodle: React.FC<{ className?: string }> = ({
  className = "w-48 h-38 text-[#141517]"
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Teal Arduino PCB with irregular cutout */}
        <path d="M20 15 H160 V125 H20 L15 110 V30 Z" fill="#00878F" stroke="#141517" strokeWidth="2.2" strokeLinejoin="round" />
        {/* USB-B Silver Jack */}
        <rect x="12" y="24" width="24" height="26" fill="#94A3B8" stroke="#141517" strokeWidth="1.8" />
        {/* DC Barrel Jack */}
        <rect x="12" y="80" width="28" height="32" rx="3" fill="#1E293B" stroke="#000" strokeWidth="1.8" />
        <circle cx="26" cy="96" r="6" fill="#475569" />
        {/* ATmega328P DIP-28 Chip */}
        <rect x="75" y="70" width="60" height="24" rx="2" fill="#1E293B" stroke="#141517" strokeWidth="1.5" />
        <text x="105" y="85" textAnchor="middle" fill="#FAF7F0" fontSize="7" fontFamily="JetBrains Mono">ATmega328P</text>
        {/* Reset Button */}
        <rect x="52" y="24" width="12" height="12" rx="2" fill="#DC2626" stroke="#141517" strokeWidth="1.2" />
        {/* Digital Header (top) */}
        <rect x="80" y="16" width="70" height="8" fill="#1E293B" />
        {/* Power & Analog Headers (bottom) */}
        <rect x="75" y="115" width="36" height="8" fill="#1E293B" />
        <rect x="116" y="115" width="36" height="8" fill="#1E293B" />
        {/* Infinity Logo sketch */}
        <text x="110" y="48" fill="#FFFFFF" fontSize="12" fontWeight="black" fontFamily="sans-serif">∞</text>
        <text x="100" y="60" textAnchor="middle" fill="#E0F2FE" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">ARDUINO UNO</text>
      </svg>
      <span className="font-mono text-[8px] font-bold text-[#00878F]">ARDUINO UNO // 5V / 16MHz</span>
    </div>
  );
};

export const RaspberryPiDoodle: React.FC<{ className?: string }> = ({
  className = "w-44 h-36 text-[#141517]"
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg viewBox="0 0 170 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Green SBC PCB */}
        <rect x="15" y="15" width="140" height="100" rx="8" fill="#15803D" stroke="#141517" strokeWidth="2.2" />
        {/* 40-Pin GPIO Header (top) */}
        <rect x="35" y="20" width="85" height="14" rx="2" fill="#1E293B" stroke="#141517" strokeWidth="1.2" />
        {[...Array(20)].map((_, i) => (
          <circle key={i} cx={40 + i * 4} cy="24" r="1" fill="#FDE047" />
        ))}
        {[...Array(20)].map((_, i) => (
          <circle key={i} cx={40 + i * 4} cy="30" r="1" fill="#FDE047" />
        ))}
        {/* Quad USB Jacks */}
        <rect x="135" y="42" width="25" height="24" rx="2" fill="#94A3B8" stroke="#141517" strokeWidth="1.5" />
        <rect x="135" y="74" width="25" height="24" rx="2" fill="#94A3B8" stroke="#141517" strokeWidth="1.5" />
        {/* Ethernet Jack */}
        <rect x="132" y="102" width="28" height="18" fill="#CBD5E1" stroke="#141517" strokeWidth="1.5" />
        {/* Broadcom SoC Processor with metal heat spreader */}
        <rect x="65" y="52" width="36" height="36" rx="2" fill="#94A3B8" stroke="#334155" strokeWidth="1.8" />
        <text x="83" y="72" textAnchor="middle" fill="#0F172A" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">BCM2837</text>
        {/* MicroSD on underside label */}
        <text x="83" y="105" textAnchor="middle" fill="#FAF7F0" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">RASPBERRY PI</text>
      </svg>
      <span className="font-mono text-[8px] font-bold text-[#15803D]">RASPBERRY PI // LINUX EDGE</span>
    </div>
  );
};

// ==========================================
// 5. JUMPER WIRES & CONNECTED WIRE SYSTEM
// ==========================================

export const JumperWire: React.FC<{
  start: { x: number; y: number };
  end: { x: number; y: number };
  color?: 'red' | 'blue' | 'black' | 'yellow' | 'green';
  label?: string;
  animatePacket?: boolean;
}> = ({
  start,
  end,
  color = 'blue',
  label,
  animatePacket = true
}) => {
  const colorMap = {
    red: '#EF4444',
    blue: '#1D4ED8',
    black: '#1E293B',
    yellow: '#EAB308',
    green: '#10B981'
  };

  const strokeColor = colorMap[color];
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2 - 25; // Organic catenary droop curve
  const pathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;

  return (
    <g className="select-none pointer-events-none">
      {/* Wire shadow */}
      <path d={pathD} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" strokeLinecap="round" />
      {/* Outer wire insulation */}
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85" />
      {/* Subtle highlight core */}
      <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />

      {/* Terminal Dupont Connector Boots */}
      <circle cx={start.x} cy={start.y} r="3" fill="#141517" />
      <circle cx={end.x} cy={end.y} r="3" fill="#141517" />

      {/* Animated Data Packet / Electron Pulse */}
      {animatePacket && (
        <circle r="3" fill="#FACC15" className="filter drop-shadow-[0_0_4px_#FACC15]">
          <animateMotion path={pathD} dur="2.4s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Wire Annotation Label */}
      {label && (
        <text x={midX} y={midY - 6} textAnchor="middle" fill={strokeColor} fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
          {label}
        </text>
      )}
    </g>
  );
};

// ==========================================
// 6. PCB CONTINUOUS SECTION TRANSITION
// ==========================================

export const PCBContinuousTrace: React.FC<{ 
  label?: string;
  traceColor?: string;
}> = ({
  label = "BUS // I2C + SPI + UART",
  traceColor = "#1D4ED8"
}) => {
  return (
    <div className="relative py-8 select-none overflow-hidden my-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Left Copper Traces with Vias */}
        <svg viewBox="0 0 320 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-1 h-7 text-[#141517]/25" preserveAspectRatio="none">
          {/* Main Bus lines */}
          <path d="M0 14 H160 L180 6 H280 L295 18 H320" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 22 H140 L160 22 L175 14 H270 L285 24 H320" stroke={traceColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          {/* Copper Vias & Test Points */}
          <circle cx="60" cy="14" r="3.5" fill="#FAF7F0" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="180" cy="6" r="3" fill="#FAF7F0" stroke={traceColor} strokeWidth="1.5" />
          <circle cx="280" cy="6" r="3" fill="#FAF7F0" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {/* Center Technical Chip Label */}
        {label && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFFFF] border-1.5 border-[#141517] rounded-lg shadow-[2px_2px_0px_#141517] text-xs font-mono shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#141517] tracking-wider uppercase text-[11px]">{label}</span>
            <span className="text-[9px] text-[#575961] bg-[#F8F5EE] px-1.5 py-0.5 rounded border border-[#141517]/20">TP_01</span>
          </div>
        )}

        {/* Right Copper Traces with Test Points */}
        <svg viewBox="0 0 320 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-1 h-7 text-[#141517]/25" preserveAspectRatio="none">
          <path d="M0 18 H40 L60 6 H160 L180 20 H320" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 10 H30 L45 22 H140 L155 12 H320" stroke={traceColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <circle cx="60" cy="6" r="3" fill="#FAF7F0" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="160" cy="6" r="3" fill="#FAF7F0" stroke={traceColor} strokeWidth="1.5" />
          <circle cx="260" cy="20" r="3.5" fill="#FAF7F0" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </div>
    </div>
  );
};
