/**
 * Typed models for every piece of portfolio content.
 * Components never hardcode content — they render from `src/data/*`.
 */

export interface NavItem {
  id: string;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle?: string;
  /** Inline icon key resolved by the `SocialIcon` component. */
  icon: 'github' | 'linkedin' | 'mail' | 'whatsapp' | 'phone' | 'pin';
}

export interface Profile {
  name: string;
  /** Short role strip rendered under the name. */
  roles: string[];
  title: string;
  phone: string;
  email: string;
  whatsapp: string;
  location: string;
  linkedin: string;
  linkedinHandle: string;
  github: string;
  githubHandle: string;
  photo: string;
  resume: string;
  resumeFileName: string;
  summary: string;
  summaryDeep: string;
  quote: string;
  openToWork: string;
}

export interface Stat {
  value: string;
  label: string;
  description: string;
}

export interface Capability {
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export interface SkillGroup {
  category: string;
  summary: string;
  items: string[];
}

export interface EducationEntry {
  institution: string;
  qualification: string;
  detail: string;
  score: string;
  years: string;
  coursework: string[];
}

export interface Achievement {
  title: string;
  event: string;
  year: string;
  description: string;
}

export type CredentialStatus = 'earned' | 'completed' | 'open';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  status: CredentialStatus;
  category: 'LLM & Gen AI' | 'AI & ML' | 'Cloud & Data' | 'Cybersecurity';
  year: string;
  dateLabel?: string;
  level: string;
  description: string;
  topics: string[];
  /** Real document held for this credential (served from /public). */
  asset?: string;
  assetKind?: 'png' | 'svg';
  /** Official issuer page for the course / credential. */
  verifyUrl?: string;
  /** Resume PDF page that evidences a completed course. */
  evidenceUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  tagline: string;
  description: string;
  /** Engineering highlights — every line traceable to the project source. */
  highlights: string[];
  tech: string[];
  /** Ordered architecture / data-flow steps. */
  flow: string[];
  github: string;
  live: string;
  /** Optional real screenshots. Empty means the branded CSS panel is used. */
  images: string[];
  /** Tailwind gradient stops for the branded project panel. */
  accent: string;
  featured: boolean;
  status: string;
  /** Present for college/archive work with no public repo. */
  repoNote?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface MarqueeRow {
  id: string;
  tiles: string[];
}
