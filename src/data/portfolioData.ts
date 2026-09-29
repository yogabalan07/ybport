import { Project, SkillItem, ExperienceItem, EducationItem, AchievementItem } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: "YOGABALAN B R",
  role: "Embedded Systems • IoT • Full-Stack Development",
  tagline: "Building ideas from circuits to software.",
  supportingLine: "Engineering hardware, software and connected experiences.",
  headline: "Engineer. Builder. Problem Solver.",
  subHeadline: "Exploring the intersection of Embedded Systems, IoT and Software Engineering.",
  bio: "I am a 3rd-year Computer Science Engineering student passionate about crafting end-to-end technological solutions. From designing firmware for microcontrollers and soldering physical sensor nodes to architecting scalable full-stack web applications, I enjoy building systems where the physical and digital worlds seamlessly communicate.",
  email: "yogabalan2007yoga@gmail.com",
  github: "https://github.com/yogabalan07",
  githubUsername: "yogabalan07",
  linkedin: "https://linkedin.com/in/yogabalan-b-r-400a483a",
  location: "Tamil Nadu, India",
  college: "KSR College of Engineering",
  degree: "B.E. Computer Science and Engineering",
  batch: "2024 — 2028",
  currentYear: "3rd Year",
};

export const LINKEDIN_HANDLE = PERSONAL_INFO.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '');

export const PROJECTS: Project[] = [
  {
    id: "esp32-lora-morse",
    name: "ESP32 LoRa Morse Communicator",
    tagline: "Long-range off-grid tactical communication system using 433MHz LoRa & Morse code encoding.",
    category: ["IoT", "Embedded"],
    description: "A resilient wireless transceiver built using dual ESP32 nodes and SX1278 LoRa modules. It allows peer-to-peer transmission of text converted into Morse audio pulses and visual LED signaling over 3+ kilometers without cellular or internet infrastructure.",
    problemSolved: "Enables off-grid emergency and field communications in zero-cellular network zones with low power draw and high noise immunity.",
    keyFeatures: [
      "Sub-GHz long-range LoRa packet transceiver protocol with CRC verification",
      "Real-time Morse code audio buzzer modulation and tactile paddle input",
      "0.96 inch I2C OLED display rendering signal RSSI, SNR, and decoded characters",
      "Deep sleep optimization with interrupt-driven wake on transmit/receive"
    ],
    technologies: ["ESP32", "LoRa SX1278", "C++", "FreeRTOS", "SPI", "I2C OLED", "Embedded C"],
    architectureNotes: "Point-to-point RF modulation (433MHz, 125kHz bandwidth, Spreading Factor 7) paired with a circular message buffer and hardware timer interrupts for jitter-free Morse timing.",
    pinoutOrComponents: ["ESP32 DevKit V1", "SX1278 LoRa SPI (SCK:18, MISO:19, MOSI:23, CS:5)", "SSD1306 OLED (I2C 21/22)", "Piezo Buzzer (PWM GPIO 25)", "CW Morse Key"],
    annotation: "3.2km tested range with zero packet loss!",
    badge: "Hardware & RF",
    sketchType: "circuit"
  },
  {
    id: "self-balancing-robot",
    name: "Two-Wheeled Self-Balancing Robot",
    tagline: "Inverted pendulum robotic platform powered by real-time PID control and MPU6050 IMU fusion.",
    category: ["Embedded", "IoT"],
    description: "An autonomous balancing robot implementing an inverted pendulum dynamic model. Sensor data from an MPU6050 accelerometer/gyroscope is filtered using a complementary filter to determine tilt angles, feeding a discrete PID algorithm for dual stepper/DC motor balance response.",
    problemSolved: "Mastery of control systems, sensor noise filtration, dynamic equilibrium, and sub-millisecond microcontroller loop control.",
    keyFeatures: [
      "Complementary filter merging accelerometer and gyroscope vectors at 200Hz",
      "Proportional-Integral-Derivative (PID) loop computed at precise 5ms intervals",
      "L298N dual H-bridge motor driver with optical encoder speed feedback",
      "Wireless Bluetooth tuning parameter overrides for real-time PID calibration"
    ],
    technologies: ["Arduino Uno", "MPU6050 IMU", "C++", "PID Control", "PWM Motor Drivers", "Embedded Systems"],
    architectureNotes: "Interrupt-driven IMU polling via I2C at 400kHz. Angle error calculation passed into PID mathematical algorithm to adjust motor PWM polarity and magnitude.",
    pinoutOrComponents: ["Arduino ATmega328P", "MPU6050 (A4/A5)", "L298N Driver (Pins 5,6,9,10)", "12V Li-ion Battery Pack", "Chassis & High-Torque Gearmotors"],
    annotation: "Tuned Kp=18.5, Ki=0.04, Kd=2.2 for steady balance",
    badge: "Robotics & Control",
    sketchType: "robot"
  },
  {
    id: "connect-academic",
    name: "CONNECT — Academic Discussion Platform",
    tagline: "Collaborative knowledge-sharing and peer-mentorship platform for engineering students and faculty.",
    category: ["Web", "Full Stack"],
    description: "A centralized academic forum designed for departmental knowledge exchange, resource indexing, code snippet sharing, and interactive question-and-answer threads with verified faculty moderation.",
    problemSolved: "Eliminated fragmented WhatsApp/Telegram study groups by consolidating subject repositories, past question papers, and vetted peer answers into a structured system.",
    keyFeatures: [
      "Markdown & LaTeX math syntax editor for technical derivations and code blocks",
      "Department-wise & semester-wise categorizations with real-time tag indexing",
      "Upvoting, solution verification, and peer recognition reputation system",
      "Instant notification dispatch for course instructors and peer collaborators"
    ],
    technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    architectureNotes: "RESTful API architecture backed by relational schemas with full-text search indexing on post bodies and tag associations.",
    githubUrl: "https://github.com/yogabalan07/connect",
    annotation: "Supports code highlighting + LaTeX math",
    badge: "Full Stack",
    sketchType: "network"
  },
  {
    id: "nrb-vidyalaya-lms",
    name: "NRB Vidyalaya LMS",
    tagline: "Dedicated Hindi learning management system with interactive curriculum modules and phonetic tests.",
    category: ["Web", "Full Stack"],
    description: "A specialized digital learning platform tailored for students to master Hindi language literacy, grammar, and pronunciation. Features structured lesson paths, audio pronunciation samples, and interactive assessment modules.",
    problemSolved: "Provides rural and bilingual school students with an intuitive, self-paced Hindi learning environment with audio-assisted comprehension.",
    keyFeatures: [
      "Varnamala (alphabet) interactive soundboards with syllable phonetics",
      "Gamified quiz mechanics with instant score feedback and progress tracking",
      "Teacher dashboard for homework assignment uploads and student grading",
      "Lightweight responsive interface optimized for low-bandwidth school tablets"
    ],
    technologies: ["React", "Vite", "Node.js", "Firebase", "Web Audio API", "Tailwind CSS"],
    architectureNotes: "Client-rendered interactive modules utilizing Firebase Firestore for synchronized student progression tracking and offline cache storage.",
    githubUrl: "https://github.com/yogabalan07/NRB-Vidyalaya-LMS-",
    annotation: "Audio-assisted phonetic engine",
    badge: "EdTech",
    sketchType: "dashboard"
  },
  {
    id: "enterprise-bms",
    name: "Enterprise Business Management System",
    tagline: "Comprehensive inventory tracking, purchase ledger, and supplier analytics platform.",
    category: ["Web", "Full Stack"],
    description: "An enterprise-grade operational management dashboard built to manage multi-warehouse stock levels, generate purchase orders, track vendor deliveries, and automate invoice reconciliations.",
    problemSolved: "Replaced manual spreadsheet accounting with automated re-order triggers, audit logs, and accurate valuation tracking.",
    keyFeatures: [
      "Real-time stock ledger with automatic threshold warnings and re-order drafts",
      "Multi-role access control (Admin, Warehouse Manager, Accounts, Auditor)",
      "Automated PDF invoice generation and tax breakdown reporting",
      "Interactive analytics charts depicting seasonal inventory velocity"
    ],
    technologies: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "Tailwind CSS", "REST API"],
    architectureNotes: "Strict ACID compliant relational schema using transaction isolation levels to prevent negative inventory locks during concurrent checkout sessions.",
    annotation: "Zero inventory discrepancy with ACID locks",
    badge: "Enterprise",
    sketchType: "dashboard"
  },
  {
    id: "alumni-portal",
    name: "Online Alumni Networking Portal",
    tagline: "Connecting graduating batches with established industry alumni for mentorship and career referrals.",
    category: ["Web", "Full Stack"],
    description: "A modern institutional bridge connecting collegiate alumni working worldwide with current students. Includes curated job boards, 1-on-1 mentorship scheduling, and alumni directory search with industry filters.",
    problemSolved: "Bridges the gap between college placements and alumni working at top tech firms, making referral requests and mock interviews systematic.",
    keyFeatures: [
      "Verified graduate directory with filtering by company, domain, and grad year",
      "Direct mentorship request workflow with integrated calendar scheduling",
      "Alumni-exclusive job opening & internship referral noticeboard",
      "College milestone feeds and donation / endowment tracking"
    ],
    technologies: ["React", "Node.js", "Express", "Supabase", "PostgreSQL", "Tailwind CSS"],
    architectureNotes: "Row Level Security (RLS) policies on Supabase PostgreSQL protecting private alumni contact details while maintaining public profile discoverability.",
    githubUrl: "https://github.com/yogabalan07/Online-Alumni-Networking-Portal-s",
    annotation: "Secure RLS privacy controls",
    badge: "Community",
    sketchType: "network"
  },
  {
    id: "training-attendance-system",
    name: "Training Attendance & Feedback System",
    tagline: "Automated session logging, geo/QR verification, and structured evaluation for campus workshops.",
    category: ["Web", "Full Stack"],
    description: "A seamless college workshop management tool streamlining student roll calls during technical bootcamps, computing session feedback metrics, and issuing automated certificate eligibility reports.",
    problemSolved: "Eliminated paper sign-in sheets and inaccurate feedback collection during high-volume campus placement drives and seminars.",
    keyFeatures: [
      "Dynamic time-limited QR code check-ins preventing proxy attendance",
      "Post-session multi-criteria trainer evaluation forms with sentiment scores",
      "Automated attendance percentage calculator and threshold warning exports",
      "One-click CSV/Excel report generation for departmental accreditation"
    ],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    architectureNotes: "Time-synchronized token generation for QR scanning paired with rate-limiting middleware to handle 300+ simultaneous student scans per minute.",
    githubUrl: "https://github.com/yogabalan07/Training-Attendance-Feedback-Management",
    annotation: "Sub-second QR verification at scale",
    badge: "Campus Tool",
    sketchType: "dashboard"
  }
];

export const SKILLS: SkillItem[] = [
  // Programming
  { name: "C", category: "Programming", proficiencyLabel: "Hardware & OS Level", tag: "Firmware / Logic", context: "Memory management, bit manipulation, microcontroller registers, and algorithm implementations." },
  { name: "Python", category: "Programming", proficiencyLabel: "Data & Scripting", tag: "Automation / AI", context: "Hardware interfacing scripts, data manipulation, automation tools, and backend prototyping." },
  { name: "JavaScript", category: "Programming", proficiencyLabel: "Modern ES6+", tag: "Interactive Web", context: "DOM manipulation, asynchronous event loops, real-time client state management." },
  { name: "TypeScript", category: "Programming", proficiencyLabel: "Strict Typing", tag: "Enterprise Scale", context: "Type-safe interfaces, refactoring confidence, robust backend API contracts." },
  
  // Embedded / IoT
  { name: "ESP32", category: "Embedded / IoT", proficiencyLabel: "Core Controller", tag: "Wi-Fi + BLE", context: "FreeRTOS tasks, Wi-Fi web servers, low-power sleep modes, and hardware interrupts." },
  { name: "Arduino", category: "Embedded / IoT", proficiencyLabel: "Prototyping", tag: "Sensors & Actuators", context: "Rapid hardware prototyping, PWM motor control, serial telemetries, and shield integrations." },
  { name: "Raspberry Pi", category: "Embedded / IoT", proficiencyLabel: "Single Board Computer", tag: "Linux & Edge", context: "Linux-based edge nodes, local MQTT brokers, GPIO sensor telemetry daemons." },
  { name: "Sensors", category: "Embedded / IoT", proficiencyLabel: "Analog & Digital", tag: "I2C / SPI / ADC", context: "Interfacing MPU6050, ultrasonic, temperature/humidity, soil moisture, and current sensors." },
  { name: "LoRa", category: "Embedded / IoT", proficiencyLabel: "Sub-GHz RF", tag: "Long Range Off-Grid", context: "SX1278 transceiver tuning, packet CRC validation, spreading factors, and telemetry links." },
  { name: "Embedded Systems", category: "Embedded / IoT", proficiencyLabel: "Architecture", tag: "Firmware Design", context: "Timer registers, hardware interrupts, watchdog timers, power budgeting." },
  { name: "IoT", category: "Embedded / IoT", proficiencyLabel: "Connected Devices", tag: "MQTT & HTTP", context: "Edge-to-cloud data ingestion, sensor payload optimization, device dashboards." },

  // Web Development
  { name: "React", category: "Web Development", proficiencyLabel: "Component UI", tag: "Hooks & State", context: "Modular responsive user interfaces, custom hooks, performant rendering lifecycles." },
  { name: "Vite", category: "Web Development", proficiencyLabel: "Build Tooling", tag: "Lightning Fast", context: "Modern ESM build pipelines, bundle optimization, development server configuration." },
  { name: "Node.js", category: "Web Development", proficiencyLabel: "Server Runtime", tag: "Event-Driven", context: "Asynchronous backend APIs, file streaming, microservices, and network protocols." },
  { name: "Express", category: "Web Development", proficiencyLabel: "REST Framework", tag: "Routing & Middlewares", context: "RESTful endpoint architectures, JWT authentication, rate limiting, and request validation." },
  { name: "HTML", category: "Web Development", proficiencyLabel: "Semantic Markup", tag: "Accessibility", context: "Clean DOM structure, semantic tags, search engine indexing, and screen reader friendliness." },
  { name: "CSS", category: "Web Development", proficiencyLabel: "Layout & Motion", tag: "Flexbox / Grid", context: "Modern responsive CSS, keyframe animations, typography scales, print styling." },
  { name: "Tailwind CSS", category: "Web Development", proficiencyLabel: "Utility-First", tag: "Design Systems", context: "Custom theme design tokens, clean responsive layouts, micro-interaction states." },

  // Backend / Database
  { name: "Firebase", category: "Backend / Database", proficiencyLabel: "Cloud Backend", tag: "Auth & Firestore", context: "Firestore document collections, real-time listeners, client auth states." },
  { name: "Supabase", category: "Backend / Database", proficiencyLabel: "Postgres BaaS", tag: "RLS & Auth", context: "Row Level Security policies, automated Postgres APIs, user role authorizations." },
  { name: "PostgreSQL", category: "Backend / Database", proficiencyLabel: "Relational DBMS", tag: "ACID & Indexing", context: "Relational schema design, foreign keys, compound indexes, query execution plans." },

  // Tools
  { name: "Git", category: "Tools", proficiencyLabel: "Version Control", tag: "Branches & Rebasing", context: "Atomic commits, conflict resolution, collaborative pull request workflows." },
  { name: "GitHub", category: "Tools", proficiencyLabel: "Collaboration", tag: "Actions & Repos", context: "Open-source collaboration, issue tracking, CI/CD automated builds, and portfolio hosting." },
  { name: "VS Code", category: "Tools", proficiencyLabel: "Primary IDE", tag: "Extensions & Debugging", context: "PlatformIO for embedded development, TypeScript language server, remote SSH debugging." },
  { name: "Linux", category: "Tools", proficiencyLabel: "OS Environment", tag: "Bash & Systemd", context: "Bash scripting, process supervision, SSH server management, cron automation." },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Web Development Intern",
    company: "Touchmark Descience Pvt Ltd",
    location: "Chennai, Tamil Nadu",
    period: "2026",
    highlights: [
      "Collaborated in an agile cross-functional engineering team building enterprise web solutions.",
      "Engineered responsive, reusable user interface components using React and Tailwind CSS.",
      "Integrated secure REST API endpoints with Spring Boot microservices and PostgreSQL databases.",
      "Implemented critical modules for an Enterprise Inventory Management System, improving data accuracy and record retrieval times."
    ],
    technologies: ["React", "Spring Boot", "PostgreSQL", "TypeScript", "REST APIs", "Git"],
    sketchNote: "Real-world team shipping production code!"
  }
];

export const EDUCATION: EducationItem = {
  degree: "B.E. Computer Science and Engineering",
  institution: "KSR College of Engineering",
  period: "2024 — 2028",
  currentStatus: "3rd Year",
  coursework: [
    "Data Structures & Algorithms",
    "Microprocessors & Microcontrollers",
    "Computer Networks & Protocols",
    "Operating Systems & Systems Programming",
    "Database Management Systems",
    "Object-Oriented Programming (C++/Java)",
    "Embedded Systems Design"
  ],
  academicHighlights: [
    "Maintained strong academic track record across all semesters with focus on practical hardware-software labs",
    "Active contributor and problem solver in collegiate technical symposiums and hardware exhibitions",
    "Student coordinator for department technical workshops and hands-on microcontroller sessions"
  ]
};

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "hackathon-winner",
    title: "Hackathon Winner",
    subtitle: "1st Place in Inter-Collegiate Technical Hackathon",
    category: "Hackathon",
    icon: "trophy",
    date: "2025 - 2026",
    doodleLabel: "Top Performer 🏆",
    description: "Built and deployed an end-to-end IoT sensor logging and emergency alert solution under intense 24-hour time constraint, praised by industry jury for hardware reliability."
  },
  {
    id: "project-competition-winner",
    title: "Project Competition Winner",
    subtitle: "Gold Medal / 1st Prize in State-Level Engineering Expo",
    category: "Competition",
    icon: "medal",
    date: "2025",
    doodleLabel: "Gold Medal 🥇",
    description: "Awarded First Prize for designing and demonstrating the ESP32 LoRa long-range off-grid communication terminal for remote disaster-zone relief."
  },
  {
    id: "technical-exhibitions",
    title: "Technical Project Exhibitions",
    subtitle: "Featured Demonstrator at Regional Tech Summits",
    category: "Exhibition",
    icon: "rocket",
    date: "2024 - 2026",
    doodleLabel: "Live Demo 🚀",
    description: "Selected to represent department at technical symposiums showcasing autonomous robotics, balancing algorithms, and full-stack campus management portals."
  },
  {
    id: "innovation-projects",
    title: "Innovation Projects",
    subtitle: "Campus Incubation & Problem Solver Recognition",
    category: "Innovation",
    icon: "sparkles",
    date: "2024 - Present",
    doodleLabel: "Patents & R&D 💡",
    description: "Authored working prototypes addressing campus attendance bottlenecks and community academic resource sharing with measurable collegiate adoption."
  }
];

// Verified against the GitHub API on 2026-09-28: 24 public repositories,
// 19 followers, 0 stars on project repos. Featured repos are linked only
// when a repository with that exact identity was confirmed to exist.
export const GITHUB_STATS = {
  username: "yogabalan07",
  profileUrl: "https://github.com/yogabalan07",
  publicRepos: 24,
  followers: 19,
  featuredRepos: [
    {
      name: "connect",
      desc: "Campus academic discussion platform: subject channels, peer answers, and moderator tools, backed by Firebase.",
      lang: "TypeScript",
      stars: 0,
      forks: 0
    },
    {
      name: "NRB-Vidyalaya-LMS-",
      desc: "Hindi language learning management system with separate student, teacher, and admin portals.",
      lang: "TypeScript",
      stars: 0,
      forks: 0
    },
    {
      name: "Online-Alumni-Networking-Portal-s",
      desc: "College alumni networking platform with directory, connections, real-time chat, and role-based access.",
      lang: "TypeScript",
      stars: 0,
      forks: 0
    },
    {
      name: "Training-Attendance-Feedback-Management",
      desc: "Campus training attendance and feedback system: attendance routes, evaluation forms, and reporting.",
      lang: "TypeScript",
      stars: 0,
      forks: 0
    }
  ]
};
