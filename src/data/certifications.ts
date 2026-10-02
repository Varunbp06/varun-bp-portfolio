import type { Certification } from './types';

/**
 * Credentials — three explicit, never-blurred states:
 *
 *  'earned'    → a genuine document is held by Varun and served from
 *                `/public/certificates` (PASS.png/svg). Rendered as the real
 *                certificate image, openable and downloadable.
 *  'completed' → a course credited on the resume. The original certificate
 *                image is not available, so the card is a labelled
 *                representation that links to the issuer's official page —
 *                never a re-issued third-party document.
 *  'open'      → a real, currently-available program listed as a next step.
 *                Clearly labelled preview, with the official program link.
 *
 * No credential ID, completion date or verification URL is ever invented.
 */
export const certifications: Certification[] = [
  // ---------------------------- EARNED ----------------------------
  {
    id: 'hf-llm-fundamentals',
    title: 'The LLM Course',
    issuer: 'Hugging Face',
    status: 'earned',
    category: 'LLM & Gen AI',
    year: '2026',
    dateLabel: 'July 6, 2026',
    level: 'Beginner → Intermediate',
    description:
      "Hugging Face's official free curriculum covering the fundamentals of large language models and transformers.",
    topics: ['LLMs', 'Transformers', 'Fine-tuning'],
    asset: '/certificates/hf-llm-course-certificate.svg',
    assetKind: 'svg',
    verifyUrl: 'https://huggingface.co/learn/llm-course',
  },
  {
    id: 'hf-agents-course',
    title: 'Agents Course',
    issuer: 'Hugging Face',
    status: 'earned',
    category: 'LLM & Gen AI',
    year: '2026',
    dateLabel: 'February 12, 2026',
    level: 'Intermediate',
    description:
      "Hugging Face's hands-on course on building LLM agents — smolagents, LlamaIndex, LangGraph and Agentic RAG.",
    topics: ['AI Agents', 'smolagents', 'Agentic RAG'],
    asset: '/certificates/hf-agents-course-certificate.png',
    assetKind: 'png',
    verifyUrl: 'https://huggingface.co/learn/agents-course/en/unit1/get-your-certificate',
  },
  {
    id: 'hf-context-engineering',
    title: 'Context Engineering Course',
    issuer: 'Hugging Face',
    status: 'earned',
    category: 'LLM & Gen AI',
    year: '2026',
    dateLabel: 'March 9, 2026',
    level: 'Beginner → Intermediate',
    description:
      "Hugging Face's course on context engineering — context fundamentals, prompt design and a capstone project.",
    topics: ['Context Engineering', 'Prompt Design', 'Capstone'],
    asset: '/certificates/hf-context-engineering-certificate.png',
    assetKind: 'png',
    verifyUrl: 'https://huggingface.co/learn/context-course/unit0/introduction',
  },
  {
    id: 'hf-mcp-course',
    title: 'Model Context Protocol (MCP) Course',
    issuer: 'Hugging Face',
    status: 'earned',
    category: 'LLM & Gen AI',
    year: '2026',
    dateLabel: 'April 17, 2026',
    level: 'Intermediate',
    description:
      "Hugging Face's MCP course, in partnership with Anthropic — MCP fundamentals and building a full application.",
    topics: ['MCP', 'Tool Use', 'AI Agents'],
    asset: '/certificates/hf-mcp-course-certificate.png',
    assetKind: 'png',
    verifyUrl: 'https://huggingface.co/learn/mcp-course/unit3/certificate',
  },
  {
    id: 'ms-agent-tools',
    title: 'Develop an agent with integrated tools',
    issuer: 'Microsoft',
    status: 'earned',
    category: 'LLM & Gen AI',
    year: '2026',
    dateLabel: 'May 21, 2026',
    level: 'Intermediate',
    description:
      'Microsoft Applied Skills assessment on developing an agent with integrated tools.',
    topics: ['AI Agents', 'Tool Use', 'Azure AI'],
    asset: '/certificates/ms-agent-tools-applied-skills.png',
    assetKind: 'png',
    verifyUrl:
      'https://learn.microsoft.com/en-us/credentials/applied-skills/develop-an-agent-with-integrated-tools/',
  },

  // --------------------------- COMPLETED ---------------------------
  {
    id: 'da-prompt-engineering',
    title: 'ChatGPT Prompt Engineering for Developers',
    issuer: 'DeepLearning.AI & OpenAI',
    status: 'completed',
    category: 'LLM & Gen AI',
    year: '2025',
    level: 'Intermediate',
    description:
      'Best practices for prompt engineering LLM APIs — iterative prompting, summarisation and building a custom chatbot.',
    topics: ['Prompt Engineering', 'LLM APIs', 'Chatbots'],
    verifyUrl: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
  },
  {
    id: 'db-genai-fundamentals',
    title: 'Generative AI Fundamentals Accreditation',
    issuer: 'Databricks',
    status: 'completed',
    category: 'LLM & Gen AI',
    year: '2025',
    level: 'Beginner',
    description:
      "Databricks' free accreditation on how large language models work, how to apply them, and responsible AI foundations.",
    topics: ['LLMs', 'Lakehouse AI', 'Responsible AI'],
    verifyUrl: 'https://www.databricks.com/learn/training/generative-ai-fundamentals-accreditation',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
  },
  {
    id: 'ms-explore-genai',
    title: 'Explore Generative AI',
    issuer: 'Microsoft Learn',
    status: 'completed',
    category: 'LLM & Gen AI',
    year: '2025',
    level: 'Beginner',
    description:
      'Microsoft Learn path explaining how generative AI models generate content and how Azure AI services apply them in products.',
    topics: ['Generative AI', 'Azure AI', 'Copilots'],
    verifyUrl: 'https://learn.microsoft.com/en-us/training/paths/introduction-generative-ai/',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
  },
  {
    id: 'ms-azure-ai-fundamentals',
    title: 'Azure AI Fundamentals (AI-900)',
    issuer: 'Microsoft Learn',
    status: 'completed',
    category: 'AI & ML',
    year: '2025',
    level: 'Beginner',
    description:
      'Studied Azure AI services, responsible AI principles and cloud-based machine learning workflows.',
    topics: ['Azure AI', 'Responsible AI', 'Cloud ML'],
    verifyUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
  },
  {
    id: 'ibm-ai-fundamentals',
    title: 'Artificial Intelligence Fundamentals',
    issuer: 'IBM SkillsBuild',
    status: 'completed',
    category: 'AI & ML',
    year: '2025',
    level: 'Beginner',
    description:
      "IBM's free foundational program covering core AI concepts, machine-learning workflows, neural networks and AI ethics.",
    topics: ['AI Concepts', 'ML Workflows', 'AI Ethics'],
    verifyUrl: 'https://skillsbuild.org/',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
  },
  {
    id: 'ibm-genai-fundamentals',
    title: 'Generative AI Fundamentals',
    issuer: 'IBM',
    status: 'completed',
    category: 'LLM & Gen AI',
    year: '2025',
    level: 'Beginner',
    description:
      'Explored large language models, prompt engineering techniques and how LLM capabilities integrate into software development.',
    topics: ['LLMs', 'Prompt Engineering', 'AI Integration'],
    verifyUrl: 'https://skillsbuild.org/',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
  },
  {
    id: 'cisco-python-essentials-1',
    title: 'Python Essentials 1',
    issuer: 'Cisco Networking Academy',
    status: 'completed',
    category: 'AI & ML',
    year: '2025',
    level: 'Beginner',
    description:
      'Strengthened Python fundamentals: data types, control flow, functions and object-oriented programming.',
    topics: ['Python', 'OOP', 'Functions'],
    verifyUrl: 'https://www.netacad.com/courses/python-essentials-1',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
  },

  // ----------------------------- OPEN -----------------------------
  {
    id: 'helsinki-elements-of-ai',
    title: 'Elements of AI',
    issuer: 'University of Helsinki',
    status: 'open',
    category: 'AI & ML',
    year: 'Next',
    level: 'Beginner',
    description:
      "The University of Helsinki's free online course series explaining AI — theory plus practical exercises at your own pace.",
    topics: ['AI Literacy', 'ML Basics', 'Neural Networks'],
    verifyUrl: 'https://www.elementsofai.com/',
  },
  {
    id: 'kaggle-intermediate-ml',
    title: 'Intermediate Machine Learning',
    issuer: 'Kaggle Learn',
    status: 'open',
    category: 'AI & ML',
    year: 'Next',
    level: 'Intermediate',
    description:
      "Kaggle's free hands-on micro-course on missing values, pipelines, cross-validation, XGBoost and data leakage.",
    topics: ['Pipelines', 'XGBoost', 'Data Leakage'],
    verifyUrl: 'https://www.kaggle.com/learn/intermediate-machine-learning',
  },
  {
    id: 'mongodb-genai-apps',
    title: 'Building GenAI Apps — Learning Badge',
    issuer: 'MongoDB University',
    status: 'open',
    category: 'Cloud & Data',
    year: 'Next',
    level: 'Intermediate',
    description:
      "MongoDB University's free GenAI path — Atlas Vector Search, semantic search and RAG chatbots with LangChain, closed by an assessed badge.",
    topics: ['Vector Search', 'RAG', 'LangChain'],
    verifyUrl: 'https://learn.mongodb.com/learning-paths/building-genai-apps-learning-badge-path',
  },
  {
    id: 'aws-cloud-practitioner-essentials',
    title: 'AWS Cloud Practitioner Essentials',
    issuer: 'AWS Skill Builder',
    status: 'open',
    category: 'Cloud & Data',
    year: 'Next',
    level: 'Beginner',
    description:
      "AWS' free digital course covering core AWS services, pricing, security and architecture — the foundation for the Cloud Practitioner exam.",
    topics: ['AWS Core', 'Security', 'Architecture'],
    verifyUrl: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/',
  },
  {
    id: 'cisco-intro-cybersecurity',
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Skills for All',
    status: 'open',
    category: 'Cybersecurity',
    year: 'Next',
    level: 'Beginner',
    description:
      'A free Cisco course introducing security threats, vulnerabilities and best practices — with a digital badge on completion.',
    topics: ['Threats', 'Network Defense', 'Best Practices'],
    verifyUrl: 'https://skillsforall.com/course/introduction-cybersecurity',
  },
  {
    id: 'google-intro-genai',
    title: 'Introduction to Generative AI',
    issuer: 'Google Cloud',
    status: 'open',
    category: 'LLM & Gen AI',
    year: 'Next',
    level: 'Beginner',
    description:
      "Google Cloud's free introductory microlearning on large language models, prompt design and responsible generative AI.",
    topics: ['LLMs', 'Prompt Design', 'Vertex AI'],
    verifyUrl: 'https://www.cloudskillsboost.google/course_templates/536',
  },
];

export const credentialStatuses = ['All', 'Earned', 'Completed', 'Next up'] as const;

export const credentialCounts = {
  earned: certifications.filter((c) => c.status === 'earned').length,
  completed: certifications.filter((c) => c.status === 'completed').length,
  open: certifications.filter((c) => c.status === 'open').length,
};
