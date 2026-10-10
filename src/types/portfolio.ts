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
  date?: string;
  doodleLabel: string;
  description: string;
}

export type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';

export interface ContributionDayData {
  date: string;
  contributionCount: number;
  color: string;
  contributionLevel: ContributionLevel;
}

export interface ContributionWeekData {
  contributionDays: ContributionDayData[];
}

export interface ContributionCalendarData {
  totalContributions: number;
  weeks: ContributionWeekData[];
}

export interface GitHubRepoApiItem {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}
