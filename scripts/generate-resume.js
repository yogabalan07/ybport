import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

// Setup styles
const pageWidth = doc.internal.pageSize.getWidth();
const margin = 16;
const contentWidth = pageWidth - margin * 2;
let y = 18;

// Header
doc.setFont('helvetica', 'bold');
doc.setFontSize(22);
doc.setTextColor(20, 21, 23);
doc.text('YOGABALAN B R', margin, y);

y += 6;
doc.setFont('helvetica', 'normal');
doc.setFontSize(11);
doc.setTextColor(29, 78, 216); // Accent blue
doc.text('Embedded Systems • IoT • Full-Stack Development', margin, y);

y += 5;
doc.setFontSize(9);
doc.setTextColor(87, 89, 97);
doc.text('Email: yogabalan2007yoga@gmail.com  |  GitHub: github.com/yogabalan07  |  Location: Tamil Nadu, India', margin, y);

y += 4;
doc.setDrawColor(20, 21, 23);
doc.setLineWidth(0.5);
doc.line(margin, y, pageWidth - margin, y);

// Section: Education
y += 7;
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(20, 21, 23);
doc.text('EDUCATION', margin, y);

y += 5;
doc.setFontSize(10);
doc.text('KSR College of Engineering', margin, y);
doc.setFont('helvetica', 'normal');
doc.text('2024 — 2028 | 3rd Year', pageWidth - margin, y, { align: 'right' });

y += 4;
doc.setFontSize(9);
doc.setTextColor(87, 89, 97);
doc.text('Bachelor of Engineering — Computer Science and Engineering', margin, y);

y += 4;
doc.text('Relevant Coursework: Data Structures, Microprocessors, Computer Networks, Operating Systems, DBMS, Embedded Systems', margin, y);

// Section: Experience
y += 7;
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(20, 21, 23);
doc.text('EXPERIENCE', margin, y);

y += 5;
doc.setFontSize(10);
doc.text('Touchmark Descience Pvt Ltd — Web Development Intern', margin, y);
doc.setFont('helvetica', 'normal');
doc.text('Chennai, TN | 2026', pageWidth - margin, y, { align: 'right' });

y += 4;
doc.setFontSize(9);
doc.setTextColor(40, 42, 48);
const expBullets = [
  '• Collaborated in cross-functional agile team engineering responsive UI components with React & Tailwind CSS.',
  '• Integrated secure REST API endpoints with Spring Boot microservices and PostgreSQL databases.',
  '• Built critical modules for an Enterprise Inventory System, improving query performance and data accuracy.'
];
expBullets.forEach(b => {
  doc.text(b, margin, y);
  y += 4;
});

// Section: Technical Skills
y += 3;
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(20, 21, 23);
doc.text('TECHNICAL SKILLS', margin, y);

y += 5;
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.setTextColor(40, 42, 48);
doc.text('• Programming Languages: C, C++, Python, JavaScript (ES6+), TypeScript, SQL', margin, y);
y += 4;
doc.text('• Embedded & Hardware: ESP32, Arduino, Raspberry Pi, LoRa SX1278 (433MHz), MPU6050 IMU, FreeRTOS, SPI/I2C/UART', margin, y);
y += 4;
doc.text('• Web & Cloud: React, Vite, Node.js, Express, Tailwind CSS, PostgreSQL, Firebase, Supabase, REST APIs', margin, y);
y += 4;
doc.text('• Developer Tools: Git, GitHub, VS Code, PlatformIO, Linux/Bash, Postman', margin, y);

// Section: Projects
y += 6;
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(20, 21, 23);
doc.text('FEATURED PROJECTS', margin, y);

const projects = [
  {
    name: 'ESP32 LoRa Morse Communicator (Hardware & RF)',
    desc: 'Off-grid 433MHz transceiver with SX1278 modules transmitting encrypted text and Morse code audio over 3+ km without internet.',
    tech: 'ESP32, LoRa SX1278, C++, FreeRTOS, SPI, I2C OLED'
  },
  {
    name: 'Two-Wheeled Self-Balancing Robot (Robotics & Control)',
    desc: 'Inverted pendulum robot powered by discrete PID loop control and MPU6050 accelerometer/gyroscope complementary filtering.',
    tech: 'Arduino Uno, MPU6050, PID Algorithm, PWM Motor Drivers, C++'
  },
  {
    name: 'CONNECT — Academic Discussion Platform (Full-Stack Web)',
    desc: 'Campus forum for engineering students and faculty featuring Markdown/LaTeX math notes, verification workflows, and topic categorization.',
    tech: 'React, TypeScript, Node.js, Express, PostgreSQL, Tailwind CSS'
  },
  {
    name: 'NRB Vidyalaya Learning Management System (EdTech)',
    desc: 'Hindi literacy and pronunciation learning platform with interactive phonetic audio synthesis, quizzes, and teacher grading dashboards.',
    tech: 'React, Vite, Node.js, Firebase Firestore, Web Audio API'
  },
  {
    name: 'Enterprise Business Management System',
    desc: 'Inventory, purchase ledger, and vendor analytics system with ACID compliant schemas and automated invoice PDF generation.',
    tech: 'React, TypeScript, Spring Boot, PostgreSQL, Tailwind CSS'
  }
];

projects.forEach(p => {
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 21, 23);
  doc.text(p.name, margin, y);

  y += 3.8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 64, 72);
  doc.text(p.desc, margin, y, { maxWidth: contentWidth });

  y += 3.8;
  doc.setFontSize(8);
  doc.setTextColor(29, 78, 216);
  doc.text(`Tech: ${p.tech}`, margin, y);
});

// Section: Honors & Achievements
y += 6;
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(20, 21, 23);
doc.text('HONORS & ACHIEVEMENTS', margin, y);

y += 5;
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.setTextColor(40, 42, 48);
doc.text('• Hackathon Winner — 1st Place in Inter-Collegiate Technical Hackathon (IoT Emergency Alert Solution)', margin, y);
y += 4;
doc.text('• Project Competition Winner — Gold Medal / 1st Prize in State-Level Engineering Expo for LoRa Terminal', margin, y);
y += 4;
doc.text('• Regional Technical Demonstrator — Selected to demonstrate robotics and balancing algorithms at collegiate tech summits', margin, y);

// Save file
const pdfBuffer = doc.output('arraybuffer');
fs.writeFileSync(path.resolve('./public/resume-yogabalan.pdf'), Buffer.from(pdfBuffer));
console.log('Successfully generated public/resume-yogabalan.pdf');
