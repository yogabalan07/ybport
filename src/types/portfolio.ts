export type ProjectCategory = 'All' | 'Web' | 'IoT' | 'Embedded' | 'Full Stack';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: ('Web' | 'IoT' | 'Embedded' | 'Full Stack')[];
  description: string;
  problemSolved: string;
  keyFeatures: string[];
  technologies: string[];
  architectureNotes: string;
  pinoutOrComponents?: string[];
  githubUrl?: string;
  liveUrl?: string;
  annotation: string;
  badge?: string;
  sketchType: 'circuit' | 'network' | 'dashboard' | 'robot';
}

export interface SkillItem {
  name: string;
  category: 'Programming' | 'Embedded / IoT' | 'Web Development' | 'Backend / Database' | 'Tools';
  proficiencyLabel: string;
  tag: string;
  context: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  technologies: string[];
  sketchNote: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  currentStatus: string;
  coursework: string[];
  academicHighlights: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Hackathon' | 'Competition' | 'Exhibition' | 'Innovation';
  icon: string;
  date: string;
  doodleLabel: string;
  description: string;
}
