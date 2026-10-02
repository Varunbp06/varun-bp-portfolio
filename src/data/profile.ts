import { credentialCounts } from './certifications';
import type { Language, NavItem, Profile, SocialLink, Stat } from './types';

/**
 * Identity + contact facts. Traceable to the resume
 * (`public/Varun BP Engg Resume.pdf`) and to Varun's own accounts.
 */
export const profile: Profile = {
  name: 'Varun B P',
  title: 'Software Engineer | Full Stack Developer | AI Developer',
  roles: [
    'Software Engineer',
    'Full Stack Developer',
    'AI Developer',
    'Agentic RAG Systems',
    'LLM Integrations',
    'Explainable AI',
  ],
  phone: '+91-9902354121',
  email: 'varunbpvarunbp@gmail.com',
  // wa.me deep link derived from the verified phone number above.
  whatsapp: 'https://wa.me/919902354121',
  location: 'Nelamangala, Karnataka, India',
  linkedin: 'https://linkedin.com/in/varunbp09',
  linkedinHandle: 'linkedin.com/in/varunbp09',
  github: 'https://github.com/Varunbp06',
  githubHandle: 'github.com/Varunbp06',
  photo: '/varun-bp.jpg',
  resume: '/Varun%20BP%20Engg%20Resume.pdf',
  resumeFileName: 'Varun BP Engg Resume.pdf',
  summary:
    'Software Engineer and Full Stack Developer with hands-on experience building production-grade web applications, REST APIs and AI-powered platforms. Proficient in React.js, Flask, Python, JavaScript and MySQL, with a strong foundation in software engineering principles, database design and the full SDLC. Experienced in integrating AI capabilities through API-driven architectures, building normalized database schemas, and shipping maintainable, well-documented code.',
  summaryDeep:
    'Beyond the web stack, I build end-to-end AI systems: Machine Learning model training and evaluation in PyTorch, Agentic Retrieval-Augmented Generation pipelines and LLM applications — wired across FastAPI/PostgreSQL backends and React/Next.js frontends, with Docker and Git tying deployment together. I focus on Generative AI, multi-agent architectures and explainable ML, with a bias toward systems that are secure, well-tested and built to run in production, not just in a notebook.',
  quote: 'Building intelligent systems that are explainable, reliable, and production-ready.',
  openToWork: 'Open to Work — Software Engineering & AI roles',
};

/** Primary section flow. Order here drives the navbar, palette and page. */
export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export const socials: SocialLink[] = [
  {
    label: 'GitHub',
    href: profile.github,
    handle: profile.githubHandle,
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: profile.linkedin,
    handle: profile.linkedinHandle,
    icon: 'linkedin',
  },
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    handle: profile.email,
    icon: 'mail',
  },
  {
    label: 'WhatsApp',
    href: profile.whatsapp,
    handle: profile.phone,
    icon: 'whatsapp',
  },
];

export const stats: Stat[] = [
  {
    value: '3+',
    label: 'Production AI Platforms',
    description: 'Shipped, deployed and live as full-stack applications',
  },
  {
    // Derived from the credential data so it can never drift out of sync.
    value: String(credentialCounts.earned + credentialCounts.completed + credentialCounts.open),
    label: 'Credentials & Courses',
    description: 'Certificates in hand plus resume-verified completed courses',
  },
  {
    value: '4',
    label: 'Languages Spoken',
    description: 'English, Hindi, Kannada and Telugu',
  },
];

export const languages: Language[] = [
  { name: 'English', level: 'Full Professional' },
  { name: 'Kannada', level: 'Native' },
  { name: 'Hindi', level: 'Professional' },
  { name: 'Telugu', level: 'Professional' },
];

/** Fact chips shown in the hero — each traceable to the resume/source data. */
export const heroFacts: string[] = [
  'B.E. AI & Data Science · VTU',
  'Karnataka, India',
  '3 production platforms live',
];
