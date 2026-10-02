import type { Capability } from './types';

/**
 * Capabilities — what Varun actually builds, derived from shipped project
 * work. These replace the template's fictional design services.
 */
export const capabilities: Capability[] = [
  {
    number: '01',
    title: 'AI Application Development',
    description:
      'End-to-end AI products: retrieval pipelines, streaming chat interfaces, evaluation surfaces and the guardrails that keep them usable in production.',
    tags: ['RAG', 'LLM apps', 'Vector search', 'Evaluation'],
  },
  {
    number: '02',
    title: 'Full Stack Web Development',
    description:
      'Complete applications built across React/Next.js frontends and Python backends — from normalized database schema through to the shipped interface.',
    tags: ['React', 'Next.js', 'Tailwind', 'Flask', 'FastAPI'],
  },
  {
    number: '03',
    title: 'Agentic RAG Systems',
    description:
      'Ingestion, chunking and indexing pipelines wired to multi-agent workflows with tool use — document, website and knowledge-base driven retrieval.',
    tags: ['LangGraph', 'MCP', 'Qdrant', 'Chroma/Milvus', 'Redis'],
  },
  {
    number: '04',
    title: 'API & Backend Engineering',
    description:
      'REST APIs with consistent JSON contracts and HTTP semantics, authentication, RBAC, input sanitisation and SSRF-hardened integration layers.',
    tags: ['REST', 'SQLAlchemy', 'JWT', 'RBAC', 'SSRF protection'],
  },
  {
    number: '05',
    title: 'Machine Learning & Explainability',
    description:
      'Model training, evaluation and deployment in PyTorch and gradient-boosted stacks, with SHAP-based explanations that make predictions auditable.',
    tags: ['PyTorch', 'XGBoost', 'CatBoost', 'SHAP', 'Model evaluation'],
  },
  {
    number: '06',
    title: 'Data & Knowledge Systems',
    description:
      'Normalized relational schemas, aggregation pushed to the server, and healthcare data standards (FHIR R4, OMOP CDM) where interoperability matters.',
    tags: ['MySQL', 'PostgreSQL', 'FHIR R4', 'OMOP CDM'],
  },
];
