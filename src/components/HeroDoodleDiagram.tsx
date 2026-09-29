import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Radio, Cloud, Laptop, Activity, Zap } from 'lucide-react';

interface ComponentSpec {
  id: string;
  name: string;
  sub: string;
  details: string;
  specs: string[];
}

export const HeroDoodleDiagram: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ComponentSpec | null>({
    id: 'esp32',
    name: 'ESP32 Microcontroller',
    sub: 'Core Embedded Engine',
    details: 'Xtensa 32-bit dual-core processor @ 240MHz. Integrated 802.11b/g/n Wi-Fi, BLE 4.2, and ultra-low-power co-processor.',
    specs: ['240MHz Clock', '520KB SRAM', '36 GPIO Pins', 'Hardware SPI/I2C/UART']
  });
  
  const [activePin, setActivePin] = useState<string | null>(null);
  const [terminalLineIndex, setTerminalLineIndex] = useState(0);

  const terminalCommands = [
    'LoRa.beginPacket();',
    'sensor.readIMU(MPU6050);',
    'WiFi.connect("Edge_Node_01");',
    'mqttClient.publish("telemetry/v1");',
    'state: SYSTEM_NOMINAL [200Hz]'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalLineIndex((prev) => (prev + 1) % terminalCommands.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const componentsData: Record<string, ComponentSpec> = {
    esp32: {
      id: 'esp32',
      name: 'ESP32 DevKit V1',
      sub: 'Microcontroller Core',
      details: 'Dual-core Xtensa MCU running FreeRTOS tasks, interrupt-driven pin sampling, and real-time power budgeting.',
      specs: ['240MHz Dual-Core', 'Wi-Fi + BLE', 'Deep-Sleep 10µA', 'Hardware PWM']
    },
    lora: {
      id: 'lora',
      name: '433MHz LoRa SX1278',
      sub: 'Sub-GHz RF Transceiver',
      details: 'Long-range spread spectrum communication with high interference immunity. Field-tested up to 3.2km without cellular infrastructure.',
      specs: ['433MHz Band', 'Spreading Factor 7-12', '+20dBm Output', 'P2P Mesh Capable']
    },
    cloud: {
      id: 'cloud',
      name: 'MQTT / Cloud Broker',
      sub: 'Asynchronous Telemetry Broker',
      details: 'Ingests low-latency sensor payloads over lightweight publish/subscribe architecture, backed by PostgreSQL and REST endpoints.',
      specs: ['QoS 1 Delivery', 'JSON / Proto Buffers', 'Auth & TLS Tokenized', 'Real-time Webhook']
    },
    laptop: {
      id: 'laptop',
      name: 'Full-Stack Workstation',
      sub: 'React + Node + Spring Boot',
      details: 'Developer environment managing firmware compiling, serial monitor telemetries, and web applications.',
      specs: ['React + Vite', 'TypeScript Strict', 'PostgreSQL DB', 'Tailwind CSS']
    },
    sensors: {
      id: 'sensors',
      name: 'Sensors: MPU6050 & OLED',
      sub: 'I2C 6-DOF IMU + Display',
      details: '3-axis accelerometer and 3-axis gyroscope with complementary filter algorithm feeding sub-millisecond PID control loops.',
      specs: ['400kHz I2C Bus', '200Hz Sampling', 'PID Loop: 5ms', '0.96" SSD1306 OLED']
    }
  };

  const pinList = [
    { label: '3V3', desc: 'Regulated 3.3V Power Rail' },
    { label: 'GND', desc: 'Common Ground Circuit' },
    { label: 'D21', desc: 'I2C SDA (Data Line)' },
    { label: 'D22', desc: 'I2C SCL (Clock Line)' },
    { label: 'D18', desc: 'LoRa SPI SCK' },
    { label: 'D19', desc: 'LoRa SPI MISO' },
    { label: 'D23', desc: 'LoRa SPI MOSI' },
    { label: 'D5', desc: 'LoRa Chip Select (NSS)' },
  ];

  return (
    <div className="relative w-full max-w-[580px] mx-auto select-none">
      {/* Tape effect on top right */}
      <div className="absolute -top-3 right-8 w-28 h-6 bg-amber-100/90 border-x-2 border-dashed border-amber-300/70 rotate-2 shadow-xs pointer-events-none z-20" />

      {/* Main Engineering Blueprint / Sketch Notebook Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-[#FCFBF8] border-2 border-[#141517] rounded-2xl p-4 sm:p-6 shadow-[5px_6px_0px_#141517] overflow-hidden"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-paper opacity-70 pointer-events-none" />

        {/* Header sketch bar */}
        <div className="relative flex items-center justify-between pb-3 mb-3 border-b border-[#141517]/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#141517]" />
            <span className="w-2.5 h-2.5 rounded-full border border-[#141517]" />
            <span className="w-2.5 h-2.5 rounded-full border border-[#141517]" />
            <span className="text-xs font-mono font-semibold tracking-wider text-[#141517]/80 ml-1">
              SCHEMATIC // FIG 1.0 : EMBEDDED TO CLOUD
            </span>
          </div>
          <span className="font-hand text-sm text-[#1D4ED8] font-bold">
            Interactive Node: Active
          </span>
        </div>

        {/* Interactive SVG Engineering Sketch */}
        <div className="relative w-full aspect-[16/11]">
          <svg viewBox="0 0 540 370" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Defs for patterns and arrowheads */}
            <defs>
              <marker id="arrow-ink" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke="#141517" strokeWidth="1.2" />
              </marker>
              <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke="#1D4ED8" strokeWidth="1.2" />
              </marker>
              <marker id="arrow-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke="#EA580C" strokeWidth="1.2" />
              </marker>
            </defs>

            {/* CIRCUIT TRACES BACKGROUND WITH DRAW EFFECT */}
            <g stroke="#141517" strokeWidth="1.4" opacity="0.35" strokeDasharray="3 3">
              <motion.path 
                d="M175 140 H220 V85 H320" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
              <motion.path 
                d="M175 170 H240 V240 H280" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
              <motion.path 
                d="M110 220 V270 H180" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />
              <motion.path 
                d="M380 180 V250 H340" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </g>

            {/* 1. ESP32 MICROCONTROLLER BOARD (LEFT) */}
            <g 
              transform="translate(35, 75)" 
              className="cursor-pointer group"
              onClick={() => setActiveComponent(componentsData.esp32)}
              onMouseEnter={() => setActiveComponent(componentsData.esp32)}
            >
              {/* Board PCB base */}
              <rect 
                x="0" 
                y="0" 
                width="135" 
                height="180" 
                rx="8" 
                fill={activeComponent?.id === 'esp32' ? '#F0F7FF' : '#FFFFFF'} 
                stroke={activeComponent?.id === 'esp32' ? '#1D4ED8' : '#141517'} 
                strokeWidth={activeComponent?.id === 'esp32' ? "2.6" : "2.2"} 
                className="transition-colors"
              />
              
              {/* ESP-WROOM-32 Shield RF Can */}
              <rect x="18" y="18" width="98" height="85" rx="4" fill="#F4F2EB" stroke="#141517" strokeWidth="1.6" />
              
              {/* PCB Trace Antenna (Meander Line) */}
              <path d="M26 28 H38 V36 H50 V28 H62 V36 H74 V28 H86 V36 H98 V28 H106" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
              
              {/* ESP32 Text */}
              <text x="67" y="60" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" fill="#141517">ESP-32</text>
              <text x="67" y="74" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7.5" fill="#575961">Xtensa Dual-Core</text>
              <text x="67" y="86" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="#1D4ED8">240MHz · Wi-Fi + BLE</text>

              {/* USB-C Port */}
              <rect x="47" y="168" width="40" height="14" rx="2" fill="#E2E8F0" stroke="#141517" strokeWidth="1.5" />
              <circle cx="67" cy="175" r="1.5" fill="#141517" />

              {/* Reset & Boot Buttons */}
              <rect x="12" y="145" width="16" height="12" rx="2" fill="#CBD5E1" stroke="#141517" strokeWidth="1.2" />
              <text x="20" y="166" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="6" fill="#141517">EN</text>
              <rect x="106" y="145" width="16" height="12" rx="2" fill="#CBD5E1" stroke="#141517" strokeWidth="1.2" />
              <text x="114" y="166" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="6" fill="#141517">BOOT</text>

              {/* Status LEDs */}
              <circle cx="28" cy="120" r="3" fill="#EF4444" stroke="#141517" strokeWidth="1" />
              <circle cx="40" cy="120" r="3" fill="#22C55E" stroke="#141517" strokeWidth="1" />

              {/* Left Pin Headers */}
              {[-3, 14, 31, 48, 65, 82, 99, 116, 133, 150].map((y, i) => {
                const pin = pinList[i % pinList.length];
                const isHovered = activePin === pin.label;
                return (
                  <g 
                    key={`lpin-${i}`} 
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setActivePin(pin.label);
                    }}
                    onMouseLeave={() => setActivePin(null)}
                    className="cursor-pointer"
                  >
                    <rect 
                      x="-6" 
                      y={y} 
                      width="6" 
                      height="7" 
                      fill={isHovered ? '#1D4ED8' : '#141517'} 
                      rx="1" 
                    />
                    <circle cx="-3" cy={y + 3.5} r="1" fill="#FFFFFF" />
                  </g>
                );
              })}

              {/* Right Pin Headers */}
              {[-3, 14, 31, 48, 65, 82, 99, 116, 133, 150].map((y, i) => {
                const pin = pinList[(i + 4) % pinList.length];
                const isHovered = activePin === pin.label;
                return (
                  <g 
                    key={`rpin-${i}`} 
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setActivePin(pin.label);
                    }}
                    onMouseLeave={() => setActivePin(null)}
                    className="cursor-pointer"
                  >
                    <rect 
                      x="135" 
                      y={y} 
                      width="6" 
                      height="7" 
                      fill={isHovered ? '#1D4ED8' : '#141517'} 
                      rx="1" 
                    />
                    <circle cx="138" cy={y + 3.5} r="1" fill="#FFFFFF" />
                  </g>
                );
              })}
            </g>

            {/* Hand annotation pointing to ESP32 */}
            <g transform="translate(18, 48)">
              <text x="0" y="0" fontFamily="Caveat" fontSize="16" fontWeight="700" fill="#1D4ED8">
                3.3V Logic Core
              </text>
              <path d="M75 3 C 85 8, 92 16, 92 24" stroke="#1D4ED8" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-blue)" />
            </g>

            {/* 2. WIRELESS RF / WI-FI & LORA BRIDGE (CENTER-TOP) */}
            <g 
              transform="translate(230, 42)" 
              className="cursor-pointer group"
              onClick={() => setActiveComponent(componentsData.lora)}
              onMouseEnter={() => setActiveComponent(componentsData.lora)}
            >
              <rect x="0" y="0" width="110" height="75" rx="6" fill={activeComponent?.id === 'lora' ? '#FFFBEB' : '#FFFFFF'} stroke={activeComponent?.id === 'lora' ? '#EA580C' : '#141517'} strokeWidth="1.8" />
              
              {/* Wi-Fi / LoRa Waves */}
              <g className="rf-wave-pulse">
                <path d="M40 34 A 20 20 0 0 1 70 34" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M33 26 A 30 30 0 0 1 77 26" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M26 18 A 40 40 0 0 1 84 18" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              </g>
              <circle cx="55" cy="38" r="3.5" fill="#EA580C" />
              
              <text x="55" y="52" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#141517">
                433MHz LoRa
              </text>
              <text x="55" y="65" textAnchor="middle" fontFamily="Caveat" fontSize="13" fill="#EA580C">
                Long-Range RF
              </text>
            </g>

            {/* 3. CLOUD IoT BROKER (TOP RIGHT) */}
            <g 
              transform="translate(365, 30)" 
              className="cursor-pointer group"
              onClick={() => setActiveComponent(componentsData.cloud)}
              onMouseEnter={() => setActiveComponent(componentsData.cloud)}
            >
              <path 
                d="M35 50 C 20 50, 10 40, 15 28 C 15 15, 30 10, 45 15 C 55 5, 75 5, 88 15 C 100 12, 115 22, 112 35 C 122 42, 115 50, 102 50 Z" 
                fill={activeComponent?.id === 'cloud' ? '#EFF6FF' : '#FFFFFF'} 
                stroke={activeComponent?.id === 'cloud' ? '#1D4ED8' : '#141517'} 
                strokeWidth={activeComponent?.id === 'cloud' ? "2.5" : "2"} 
              />
              <text x="64" y="32" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#141517">
                MQTT Broker
              </text>
              <text x="64" y="44" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#1D4ED8">
                Cloud Telemetry
              </text>
            </g>

            {/* Connecting arrow from ESP to Cloud */}
            <path d="M178 115 C 220 105, 270 95, 360 48" stroke="#1D4ED8" strokeWidth="1.8" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-blue)" />

            {/* 4. LAPTOP / FULL-STACK DEV CONSOLE (BOTTOM RIGHT) */}
            <g 
              transform="translate(290, 160)" 
              className="cursor-pointer group"
              onClick={() => setActiveComponent(componentsData.laptop)}
              onMouseEnter={() => setActiveComponent(componentsData.laptop)}
            >
              {/* Laptop screen */}
              <rect x="15" y="0" width="190" height="120" rx="6" fill="#141517" stroke={activeComponent?.id === 'laptop' ? '#1D4ED8' : '#141517'} strokeWidth="2.2" />
              <rect x="22" y="8" width="176" height="104" rx="3" fill="#1E2024" />
              
              {/* Terminal Title bar */}
              <rect x="22" y="8" width="176" height="14" fill="#2B2D31" />
              <circle cx="30" cy="15" r="2.5" fill="#EF4444" />
              <circle cx="37" cy="15" r="2.5" fill="#FACC15" />
              <circle cx="44" cy="15" r="2.5" fill="#22C55E" />
              <text x="56" y="18" fontFamily="JetBrains Mono" fontSize="6.5" fill="#94A3B8">bash — yogabalan@dev</text>

              {/* Code lines in editor */}
              <text x="30" y="33" fontFamily="JetBrains Mono" fontSize="7.5" fill="#38BDF8">void setup() &#123;</text>
              <text x="38" y="45" fontFamily="JetBrains Mono" fontSize="7.5" fill="#F8FAFC">&nbsp;&nbsp;Serial.begin(115200);</text>
              <text x="38" y="57" fontFamily="JetBrains Mono" fontSize="7.5" fill="#4ADE80">&nbsp;&nbsp;WiFi.connect(SSID);</text>
              <text x="38" y="69" fontFamily="JetBrains Mono" fontSize="7.5" fill="#F472B6">&nbsp;&nbsp;LoRa.setFrequency(433E6);</text>
              <text x="30" y="81" fontFamily="JetBrains Mono" fontSize="7.5" fill="#38BDF8">&#125;</text>
              
              {/* Live typing command */}
              <text x="30" y="96" fontFamily="JetBrains Mono" fontSize="7.5" fill="#FACC15" fontWeight="bold">
                &gt; {terminalCommands[terminalLineIndex]}
              </text>
              <text x="30" y="107" fontFamily="JetBrains Mono" fontSize="6.5" fill="#94A3B8">// Full-Stack connected</text>

              {/* Laptop base */}
              <path d="M0 120 L220 120 L200 135 L20 135 Z" fill="#E2E8F0" stroke="#141517" strokeWidth="1.8" />
              {/* Trackpad */}
              <rect x="90" y="123" width="40" height="9" rx="1.5" fill="#CBD5E1" stroke="#141517" strokeWidth="0.8" />
            </g>

            {/* Connecting trace from ESP to Laptop */}
            <path d="M178 190 C 230 190, 240 210, 285 210" stroke="#141517" strokeWidth="2" strokeDasharray="5 3" fill="none" markerEnd="url(#arrow-ink)" />

            {/* 5. SENSORS & ACTUATORS CLUSTER (BOTTOM LEFT) */}
            <g 
              transform="translate(60, 275)" 
              className="cursor-pointer group"
              onClick={() => setActiveComponent(componentsData.sensors)}
              onMouseEnter={() => setActiveComponent(componentsData.sensors)}
            >
              <rect 
                x="0" 
                y="0" 
                width="130" 
                height="52" 
                rx="6" 
                fill={activeComponent?.id === 'sensors' ? '#FEF9C3' : '#FFFFFF'} 
                stroke={activeComponent?.id === 'sensors' ? '#CA8A04' : '#141517'} 
                strokeWidth="1.8" 
              />
              <text x="12" y="18" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" fill="#141517">MPU6050 &amp; OLED</text>
              <text x="12" y="32" fontFamily="JetBrains Mono" fontSize="8" fill="#575961">I2C Bus: SCL / SDA</text>
              <text x="12" y="44" fontFamily="JetBrains Mono" fontSize="7.5" fill="#1D4ED8">PID Gyro + Real-time Screen</text>
              <circle cx="112" cy="26" r="8" fill="#FEF08A" stroke="#141517" strokeWidth="1.2" />
              <text x="112" y="29" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fontWeight="bold">6-DOF</text>
            </g>

            {/* Arrow connecting ESP to Sensor */}
            <path d="M102 258 V 272" stroke="#141517" strokeWidth="1.8" fill="none" markerEnd="url(#arrow-ink)" />

            {/* 6. CENTRAL PHILOSOPHY ANNOTATION */}
            <g transform="translate(195, 332)">
              <rect x="-10" y="-18" width="310" height="34" rx="17" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
              <text x="145" y="4" textAnchor="middle" fontFamily="Caveat" fontSize="17" fontWeight="700" fill="#854D0E">
                Build → Test → Break → Learn → Build Again
              </text>
            </g>
          </svg>
        </div>

        {/* Dynamic Interactive Component Inspector (Live Notebook Spec) */}
        {activeComponent && (
          <motion.div 
            key={activeComponent.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 p-3 bg-[#FFFFFF] border-1.5 border-[#141517] rounded-xl shadow-xs"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-[#141517]/10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs text-[#141517]">{activeComponent.name}</span>
                <span className="text-[10px] font-mono text-[#575961]">({activeComponent.sub})</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#1D4ED8]">
                {activePin ? `Pin: ${activePin}` : 'Hovered Element'}
              </span>
            </div>

            <p className="text-xs text-[#575961] mt-1.5 leading-relaxed">
              {activeComponent.details}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {activeComponent.specs.map((s, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F5EE] border border-[#141517]/15 text-[#141517] font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Dynamic inspector footer note */}
        <div className="mt-2 pt-2 border-t border-[#141517]/15 flex items-center justify-between text-xs font-mono text-[#575961]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Node Inspector</span>
          </span>
          <span className="font-hand text-sm text-[#141517] font-semibold">
            {activePin ? `Pin: ${activePin}` : "Click/Hover any node to inspect"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
