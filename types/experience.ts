export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  period: string;
  focus: string[];
  isPersonalProject: false;
}

export interface EducationEntry {
  institution: string;
  program: string;
}
