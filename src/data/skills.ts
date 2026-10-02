import type { SkillGroup } from './types';

/**
 * Skill inventory. Categories and fundamentals come from the resume-backed
 * portfolio data; the AI/ML entries reflect the shipped project stack.
 * No proficiency scores are invented anywhere on the site.
 */
export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    summary: 'Core programming languages used across every project',
    items: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    category: 'Frontend',
    summary: 'Interfaces for dashboards, chat products and marketing pages',
    items: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    category: 'Backend & APIs',
    summary: 'Services, REST contracts and integration layers',
    items: ['Flask', 'FastAPI', 'REST APIs', 'API Integration', 'SQLAlchemy', 'JWT / RBAC'],
  },
  {
    category: 'Databases',
    summary: 'Normalized schemas, aggregations and vector stores',
    items: ['MySQL', 'PostgreSQL', 'SQLite', 'Qdrant', 'Chroma / Milvus', 'Redis'],
  },
  {
    category: 'AI & Generative AI',
    summary: 'LLM applications, retrieval pipelines and agent workflows',
    items: [
      'Prompt Engineering',
      'AI Application Development',
      'RAG',
      'LLM Applications',
      'Agentic AI',
      'LangChain',
      'LangGraph',
      'MCP',
      'Embeddings',
      'Vector Databases',
      'Hugging Face',
    ],
  },
  {
    category: 'Machine Learning',
    summary: 'Training, evaluation and explanation of models',
    items: [
      'PyTorch',
      'Scikit-learn',
      'XGBoost',
      'CatBoost',
      'Model Training & Evaluation',
      'Transfer Learning',
      'NLP',
      'SHAP',
      'Explainable AI',
    ],
  },
  {
    category: 'Tools & Infrastructure',
    summary: 'Shipping, testing and deployment workflow',
    items: ['Git', 'GitHub', 'Docker', 'Postman', 'VS Code', 'Linux', 'CI/CD', 'Cloud Deployment'],
  },
  {
    category: 'Fundamentals',
    summary: 'Computer-science foundations behind the stack',
    items: [
      'Data Structures & Algorithms',
      'OOP',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
      'Software Engineering',
      'SDLC',
      'Agile',
    ],
  },
];
