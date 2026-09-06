// ============================================================
// VARUN B P — PORTFOLIO CONTENT
// SOURCE OF TRUTH: E:\Varun_B_P_Resume.pdf → public/Varun BP Engg Resume.pdf (exact copy)
// Secondary source (only where consistent): RESUME_AI_DSEngg
// ============================================================

export const profile = {
  name: 'Varun B P',
  title: '✨ AI/ML Engineer',
  phone: '+91-9902354121',
  email: 'varunbpvarunbp@gmail.com',
  location: 'Nelamangala, Karnataka, India',
  linkedin: 'https://linkedin.com/in/varunbp09',
  linkedinHandle: 'linkedin.com/in/varunbp09',
  github: 'https://github.com/Varunbp06',
  githubHandle: 'github.com/Varunbp06',
  photo: '/varun-bp.jpg',
  resume: '/Varun%20BP%20Engg%20Resume.pdf',
  summary:
    'AI/ML Engineer specializing in production-grade, full-stack AI systems — from Machine Learning model training and evaluation in PyTorch to Agentic Retrieval-Augmented Generation (RAG) pipelines and Large Language Model (LLM) applications. Builds end to end across FastAPI/PostgreSQL backends and React/Next.js frontends, with Docker and Git tying deployment together. Focused on Generative AI, multi-agent architectures, and explainable ML, with a bias toward systems that are secure, well-tested, and built to run in production, not just a notebook.',
  quote: 'Building intelligent systems that are explainable, reliable, and production-ready.',
};

export const stats = [
  { value: '3+', title: 'PRODUCTION PROJECTS', description: 'Full-stack Agentic AI platforms' },
  { value: '9', title: 'REAL CREDENTIALS', description: 'Certificates in hand + resume-verified courses' },
  { value: '4', title: 'LANGUAGES', description: 'English, Hindi, Kannada, Telugu' },
];

export const skills = [
  {
    category: 'Programming',
    items: ['Python', 'SQL', 'TypeScript', 'JavaScript'],
    icons: ['Python', 'SQL', 'TypeScript', 'JavaScript'],
  },
  {
    category: 'Deep Learning & ML',
    items: ['PyTorch', 'Model Training & Evaluation', 'Model Deployment', 'Transfer Learning', 'Scikit-learn', 'XGBoost', 'CatBoost', 'SHAP', 'Explainable AI', 'NLP'],
    icons: ['PyTorch', 'ScikitLearn', 'XGBoost'],
  },
  {
    category: 'Generative AI & Agentic Systems',
    items: [
      'RAG',
      'LLM Applications',
      'Agentic AI',
      'AI Agents',
      'LangChain',
      'LangGraph',
      'MCP',
      'Prompt Engineering',
      'Embeddings',
      'Hugging Face',
      'FAISS',
      'Vector Databases',
      'Reranking',
    ],
    icons: ['LangChain', 'HuggingFace'],
  },
  {
    category: 'Backend & Web',
    items: ['FastAPI', 'REST APIs', 'React', 'Next.js', 'NextAuth', 'JWT', 'PostgreSQL', 'SQLite'],
    icons: ['FastAPI', 'React', 'NextJs', 'PostgreSQL'],
  },
  {
    category: 'Tools & Infrastructure',
    items: ['Git', 'Docker', 'CI/CD', 'Linux', 'Cloud Deployment', 'RBAC', 'FHIR R4', 'OMOP CDM'],
    icons: ['Git', 'Docker', 'Linux'],
  },
];

// ============================================================
// S-TIER PROJECTS — TOP 3 PRODUCTION PLATFORMS (2025–2026)
// The flagship, deployable platforms. Each has a REAL live demo
// (Vercel URL found in the repo's own deploy config, verified HTTP 200)
// AND a real GitHub repo (found in workspace git remotes).
// ============================================================
export const sTierProjects = [
  {
    name: 'Aurelia AI',
    shortName: 'Aurelia AI',
    category: 'Multi-Tenant AI Support',
    tagline: 'Multi-Tenant AI Customer Support Platform',
    year: '2026',
    live: 'https://aurelia-ai-topaz.vercel.app',
    github: 'https://github.com/Varunbp06/aurelia-ai',
    description:
      'Built a full-stack AI customer support platform with multi-tenant, Qdrant-backed knowledge bases, SSE streaming chat, and document/website ingestion into a RAG pipeline.',
    points: [
      'Full-stack AI customer support platform: multi-tenant Qdrant-backed knowledge bases, SSE streaming chat, and RAG ingestion.',
      'Embeddable TypeScript chat widget and admin dashboard with multi-provider LLM support (OpenAI, Anthropic, Google, DeepSeek).',
      'JWT/bcrypt-secured and SSRF-protected ingestion pipeline.',
    ],
    tech: ['Next.js 14', 'React 18', 'TypeScript', 'FastAPI', 'Python 3.11', 'SQLAlchemy 2.0', 'PostgreSQL/SQLite', 'Redis', 'Qdrant', 'Vector Search', 'RAG', 'LLMs', 'Docker', 'JWT'],
    flow: ['Document & website ingestion', 'Tenant Qdrant index', 'Scoped retrieval', 'Multi-provider LLM', 'SSE streaming chat'],
    tier: 'S',
    flagship: true,
  },
  {
    name: 'NexaMind AI',
    shortName: 'NexaMind AI',
    category: 'Agentic RAG / Full-Stack AI',
    tagline: 'Enterprise Agentic RAG Workspace',
    year: '2025',
    live: 'https://nexamindai.vercel.app',
    github: 'https://github.com/Varunbp06/nexamind-ai',
    description:
      'Engineered a full-stack Agentic RAG workspace enabling document chat, streaming AI conversations, and AI agent workflows across a Next.js/React frontend and a FastAPI/Python backend.',
    points: [
      'Full-stack Agentic RAG workspace: document chat, streaming AI conversations, and AI agent workflows (Next.js/React + FastAPI/Python).',
      'Document ingestion, parsing, chunking, and vector indexing pipelines (Chroma/Milvus) with MCP tool integrations.',
      'NextAuth/JWT authentication and RBAC/SSRF protections across the platform.',
    ],
    tech: ['Next.js 16', 'React 19', 'TypeScript 5', 'Tailwind CSS 4', 'FastAPI', 'Python 3.11', 'SQLAlchemy', 'PostgreSQL/SQLite', 'Chroma/Milvus', 'Redis', 'NextAuth', 'JWT', 'RAG', 'LLMs'],
    flow: ['Document ingestion', 'Parsing & chunking', 'Chroma/Milvus index', 'MCP agent tools', 'Streaming chat'],
    tier: 'S',
  },
  {
    name: 'Aurevia Health AI',
    shortName: 'Aurevia Health AI',
    category: 'Clinical Intelligence / Multi-Agent RAG',
    tagline: 'Clinical Intelligence Platform',
    year: '2025',
    live: 'https://aurevia-health-ai.vercel.app',
    github: 'https://github.com/Varunbp06/aurevia-health-ai',
    description:
      'Developed a privacy-first Clinical Intelligence Platform combining a React/FastAPI stack with LangGraph-based multi-agent RAG for clinical decision support workflows.',
    points: [
      'Privacy-first Clinical Intelligence Platform: React/FastAPI stack with LangGraph multi-agent RAG for clinical decision support.',
      'Integrated ML components (CatBoost, XGBoost, TabICLv2) with SHAP explainability and a multi-organ digital twin.',
      'Applies FHIR R4/OMOP CDM standards with RBAC and PII redaction.',
    ],
    tech: ['React 19', 'FastAPI', 'LangGraph', 'Ollama', 'FHIR R4', 'OMOP CDM v5.4', 'CatBoost', 'XGBoost', 'SHAP', 'RAG', 'PostgreSQL/SQLite', 'Docker', 'JWT', 'RBAC'],
    flow: ['React + FastAPI app', 'LangGraph multi-agent RAG', 'CatBoost / XGBoost models', 'SHAP explainability', 'FHIR R4 · OMOP output'],
    tier: 'S',
  },
];

// ============================================================
// A-TIER PROJECTS — COLLEGE AI & DATA SCIENCE BUILDS (B.E. coursework, 2025)
// Categories confirmed by Varun; framed honestly (no fake repos).
// ============================================================
export const aTierProjects = [
  {
    name: 'Deepfake Detection Using Machine Learning',
    shortName: 'Deepfake Detection',
    category: 'Computer Vision / Deep Learning',
    tagline: 'Spatial-temporal deepfake detection pipeline',
    year: '2025',
    description:
      'Implemented a PyTorch deep learning pipeline for binary deepfake detection — extracting spatial artifacts and modeling temporal inconsistencies across video frames with XceptionNet, BiLSTM, and attention mechanisms.',
    points: [
      'Combined XceptionNet, BiLSTM, and attention to learn spatial-temporal representations for manipulated-video classification.',
      'Applied transfer learning, data augmentation, temporal sampling, and full model training/evaluation workflows to improve robustness across deepfake datasets.',
      'Used Grad-CAM and attention visualization for Explainable AI — identifying the image regions and learned patterns behind REAL/FAKE predictions.',
      'Evaluated with accuracy, precision, recall, F1-score, and cross-dataset testing to analyze generalization and failure cases.',
    ],
    tech: ['Python', 'PyTorch', 'XceptionNet', 'BiLSTM', 'Attention Mechanisms', 'Grad-CAM', 'Transfer Learning'],
    tier: 'A',
  },
  {
    name: 'Image Forgery & Tampering Detection',
    shortName: 'Image Forgery Detection',
    category: 'Computer Vision / Digital Forensics',
    tagline: 'Pixel-level tampering detection & localization',
    year: '2025',
    description:
      'College research project on image forgery detection and localization — studying how manipulation traces are exposed and locating tampered regions at the pixel level.',
    points: [
      'Studied state-of-the-art forgery detection: anomaly-feature tracing networks that flag spliced/copy-moved/enhanced regions without extra preprocessing.',
      'Compared explainable forgery-localization approaches (FakeShield, HiFi_IFDL) that output masks of exactly where an image was altered.',
      'Applied CNNs + transfer learning in PyTorch and evaluated localization with pixel-level metrics.',
    ],
    tech: ['Python', 'PyTorch', 'CNN', 'Transfer Learning', 'OpenCV', 'Digital Forensics'],
    tier: 'A',
  },
  {
    name: 'Chronic Kidney Disease Prediction',
    shortName: 'Disease Prediction',
    category: 'Healthcare ML / Explainable AI',
    tagline: 'ML risk prediction with model explainability',
    year: '2025',
    description:
      'College machine-learning project predicting chronic disease risk from clinical lab values — training and evaluating classifiers while tackling real medical-data problems like class imbalance.',
    points: [
      'Built and compared gradient-boosted and classical ML classifiers (XGBoost, CatBoost, scikit-learn) on clinical records.',
      'Handled missing values and class imbalance; reported accuracy, precision, recall and F1 across train/test splits.',
      'Used SHAP for Explainable AI so each prediction shows which lab markers drove the risk.',
    ],
    tech: ['Python', 'Scikit-learn', 'XGBoost', 'CatBoost', 'SHAP', 'Pandas'],
    tier: 'A',
  },
  {
    name: 'Mental Health Sentiment NLP',
    shortName: 'Sentiment NLP',
    category: 'NLP / Transformer Fine-tuning',
    tagline: 'Fine-tuned RoBERTa text classification',
    year: '2025',
    description:
      'College NLP project fine-tuning transformer models to classify sentiment in mental-health text — my hands-on introduction to tokenization, training loops, and evaluation of LLM-era models.',
    points: [
      'Fine-tuned RoBERTa/BERT-style transformers in PyTorch to classify emotional states in text.',
      'Applied class weighting for skewed sentiment distributions; evaluated with accuracy, precision, recall and F1.',
      'Studied open-source references (Mental-Health-RoBERTa) to compare architectures and training recipes.',
    ],
    tech: ['Python', 'PyTorch', 'Hugging Face', 'Transformers', 'RoBERTa', 'NLP'],
    tier: 'A',
  },
];

export const education = [
  {
    school: 'Visvesvaraya Technological University (VTU)',
    detail: 'B.E. in Artificial Intelligence & Data Science | CGPA: 7.9/10',
    years: 'Dec 2022 – May 2026',
  },
  {
    school: 'Hoysala PU College',
    detail: 'Pre-University Certificate – Science (PCM) | Aggregate: 78%',
    years: 'Apr 2020 – Apr 2022',
  },
  {
    school: 'SBS School',
    detail: 'SSLC | Aggregate: 90.56%',
    years: '2019',
  },
];

// ============================================================
// CERTIFICATIONS & CREDENTIALS
// Honesty model — every entry carries one of three explicit statuses:
//   'earned'    → genuine document held by Varun (rendered/downloadable).
//                 Only entry with a real certificate file in the repo.
//   'completed' → course credited on Resume 5 (evidence: resume PDF linked
//                 per entry). The original certificate image is UNAVAILABLE,
//                 so the card shows a labelled representation — never a
//                 re-issued document. Links to the issuer's official page.
//   'open'      → a real, currently-available free program Varun can earn
//                 next. The card is a labelled PREVIEW, never a fake issued
//                 certificate; the official program link is provided.
// Program facts (cost, certificate issuance, requirements) were verified
// against the issuers' official pages (Sep 2026) and are recorded per
// entry — never invent completion data, IDs, or verification URLs.
// A repo-wide asset search (certs/badges/PDFs/SVGs/PNGs, no git history
// available) found real certificate files only in public/certificates/:
// the in-hand Hugging Face LLM Course SVG plus three Hugging Face course
// PNGs (Agents, Context Engineering, MCP) supplied by Varun, used unmodified.
// One supplied Microsoft image (Agent Tools) is displayed as supplied per
// Varun's explicit instruction; the Azure OpenAI image was removed per Varun
// because its credential ID was not correct. IDs are never transcribed.
// ============================================================
export const certifications = [
  {
    id: 'hf-llm-fundamentals',
    title: 'The LLM Course',
    issuer: 'Hugging Face',
    instructors: 'Hugging Face Instructors',
    kind: 'certificate',
    status: 'earned',
    category: 'LLM & Gen AI',
    level: 'Beginner → Intermediate',
    credentialType: 'Online course + certificate of achievement',
    cost: 'Free',
    certIssued: 'Certificate of Achievement issued by Hugging Face Instructors on module completion',
    requirements: 'None — self-paced',
    achievement: 'Certificate of Achievement',
    module: '1. Fundamentals of LLMs',
    date: '2026-07-06',
    verifyUrl: 'https://huggingface.co/learn/llm-course',
    // Standalone copy of the real document, served from /public (kept in sync
    // with the SVG art rendered in CertificateArt.jsx).
    asset: '/certificates/hf-llm-course-certificate.svg',
    assetKind: 'svg',
    downloadName: 'Varun-BP-HuggingFace-LLM-Course-Certificate.png',
    openLabel: 'Open The LLM Course',
    description: 'The LLM Course is Hugging Face\'s official, free curriculum covering the fundamentals of large language models.',
    note: 'Certificate of Achievement — verified completion of the first module of The LLM Course by Hugging Face Instructors.',
    topics: ['LLMs', 'Transformers', 'Fine-tuning'],
  },
  {
    id: 'da-prompt-engineering',
    title: 'ChatGPT Prompt Engineering for Developers',
    issuer: 'DeepLearning.AI & OpenAI',
    instructors: 'Isa Fulford (OpenAI) & Andrew Ng (DeepLearning.AI)',
    kind: 'credential',
    status: 'completed',
    category: 'LLM & Gen AI',
    level: 'Intermediate',
    credentialType: 'Short course (hands-on Jupyter notebooks)',
    cost: 'Free short course',
    certIssued: 'No formal certificate — progress tracked on the DeepLearning.AI learning platform',
    requirements: 'Basic Python',
    monogram: 'DL',
    verifyUrl: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
    description: 'Best practices for prompt engineering LLM APIs — iterative prompting, summarization, and building a custom chatbot.',
    topics: ['Prompt Engineering', 'LLM APIs', 'Chatbots'],
  },
  {
    id: 'db-genai-fundamentals',
    title: 'Generative AI Fundamentals Accreditation',
    issuer: 'Databricks',
    kind: 'credential',
    status: 'completed',
    category: 'LLM & Gen AI',
    level: 'Beginner',
    credentialType: 'Accreditation (training + assessed quiz)',
    cost: 'Free on-demand training',
    certIssued: 'Databricks badge on passing the assessment (80% pass rate)',
    requirements: 'None — ~1 hour',
    monogram: 'DB',
    verifyUrl: 'https://www.databricks.com/learn/training/generative-ai-fundamentals-accreditation',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
    description: 'Databricks\' free accreditation on how large language models work, how to apply them, and responsible AI foundations.',
    topics: ['LLMs', 'Lakehouse AI', 'Responsible AI'],
  },
  {
    id: 'ms-explore-genai',
    title: 'Explore Generative AI',
    issuer: 'Microsoft Learn',
    kind: 'credential',
    status: 'completed',
    category: 'LLM & Gen AI',
    level: 'Beginner',
    credentialType: 'Microsoft Learn path (modules + trophy)',
    cost: 'Free',
    certIssued: 'No formal certificate — Learn trophy/XP on the Microsoft Learn profile',
    requirements: 'None — self-paced',
    monogram: 'MS',
    verifyUrl: 'https://learn.microsoft.com/en-us/training/paths/introduction-generative-ai/',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
    description: 'Microsoft Learn path explaining how generative AI models generate content and how Azure AI services apply them in products.',
    topics: ['Generative AI', 'Azure AI', 'Copilots'],
  },
  {
    id: 'ibm-ai-fundamentals',
    title: 'AI Fundamentals',
    issuer: 'IBM SkillsBuild',
    kind: 'credential',
    status: 'completed',
    category: 'AI & ML',
    level: 'Beginner',
    credentialType: 'Online program (IBM SkillsBuild)',
    cost: 'Free',
    certIssued: 'Digital credential via the IBM SkillsBuild platform',
    requirements: 'None — self-paced',
    monogram: 'IBM',
    verifyUrl: 'https://skillsbuild.org/',
    evidenceUrl: '/Varun%20BP%20Engg%20Resume.pdf',
    description: 'IBM\'s free foundational program introducing AI concepts, applications, ethics, and the machine-learning landscape.',
    topics: ['AI Concepts', 'ML Landscape', 'AI Ethics'],
  },
  {
    id: 'helsinki-elements-of-ai',
    title: 'Elements of AI',
    issuer: 'University of Helsinki',
    kind: 'credential',
    status: 'open',
    category: 'AI & ML',
    level: 'Beginner',
    credentialType: 'Online course series (MinnaLearn + University of Helsinki)',
    cost: 'Course content free; shareable certificate purchasable after completion',
    certIssued: 'Digital certificate on the learner profile after meeting completion criteria (certificate purchase required)',
    requirements: 'None — 30–60 hours, self-paced',
    monogram: 'EO',
    learnUrl: 'https://www.elementsofai.com/',
    description: 'The University of Helsinki\'s acclaimed free online course series explaining AI — theory plus practical exercises at your own pace.',
    topics: ['AI Literacy', 'ML Basics', 'Neural Networks'],
  },
  {
    id: 'kaggle-intermediate-ml',
    title: 'Intermediate Machine Learning',
    issuer: 'Kaggle Learn',
    kind: 'credential',
    status: 'open',
    category: 'AI & ML',
    level: 'Intermediate',
    credentialType: 'Hands-on micro-course (exercises + certificate)',
    cost: 'Free — like all Kaggle Learn courses',
    certIssued: 'Completion certificate issued for every finished Kaggle Learn course',
    requirements: 'Introductory ML (models, Pandas) — ~4 hours',
    monogram: 'KG',
    learnUrl: 'https://www.kaggle.com/learn/intermediate-machine-learning',
    description: 'Kaggle\'s free hands-on micro-course on missing values, pipelines, cross-validation, XGBoost and data leakage — with a completion certificate.',
    topics: ['Pipelines', 'XGBoost', 'Data Leakage'],
  },
  {
    id: 'mongodb-genai-apps',
    title: 'Building GenAI Apps — Learning Badge',
    issuer: 'MongoDB University',
    kind: 'credential',
    status: 'open',
    category: 'Cloud & Data',
    level: 'Intermediate',
    credentialType: 'Learning path + assessed badge',
    cost: 'Free learning path',
    certIssued: 'Official Credly badge and digital certificate within 24h of passing the final assessment',
    requirements: 'MongoDB basics — semantic search, RAG with LangChain',
    monogram: 'MDB',
    learnUrl: 'https://learn.mongodb.com/learning-paths/building-genai-apps-learning-badge-path',
    description: 'MongoDB University\'s free GenAI path — Atlas Vector Search, semantic search and RAG chatbots with LangChain, closed by an assessed badge.',
    topics: ['Vector Search', 'RAG', 'LangChain'],
  },
  {
    id: 'aws-cloud-practitioner-essentials',
    title: 'AWS Cloud Practitioner Essentials',
    issuer: 'AWS Skill Builder',
    kind: 'credential',
    status: 'open',
    category: 'Cloud & Data',
    level: 'Beginner',
    credentialType: 'Free digital training (exam preparation)',
    cost: 'Free digital course on AWS Skill Builder',
    certIssued: 'No certificate for the training itself — it prepares for the Cloud Practitioner exam',
    requirements: 'None — self-paced',
    monogram: 'AWS',
    learnUrl: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/',
    description: 'AWS\' free digital course covering core AWS services, pricing, security, and architecture — the foundation for the Cloud Practitioner exam.',
    topics: ['AWS Core', 'Security', 'Architecture'],
  },
  {
    id: 'cisco-intro-cybersecurity',
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Skills for All',
    kind: 'credential',
    status: 'open',
    category: 'Cybersecurity',
    level: 'Beginner',
    credentialType: 'Free online course (Cisco Networking Academy)',
    cost: 'Free',
    certIssued: 'Digital badge and proof of completion via the Cisco platform',
    requirements: 'None — no experience necessary',
    monogram: 'CS',
    learnUrl: 'https://skillsforall.com/course/introduction-cybersecurity',
    description: 'A free Cisco course introducing security threats, vulnerabilities, and best practices — with a digital badge on completion.',
    topics: ['Threats', 'Network Defense', 'Best Practices'],
  },
  {
    id: 'hf-agents-course',
    title: 'Agents Course',
    issuer: 'Hugging Face',
    kind: 'certificate',
    status: 'earned',
    category: 'LLM & Gen AI',
    level: 'Intermediate',
    credentialType: 'Online course + certificate of completion',
    cost: 'Free',
    certIssued: 'Certificate of Completion issued by Hugging Face on course completion',
    requirements: 'Python + basic LLM knowledge',
    achievement: 'Certificate of Completion',
    module: 'AI Agents Course',
    date: '2026-02-12',
    dateLabel: 'February 12, 2026',
    verifyUrl: 'https://huggingface.co/learn/agents-course/en/unit1/get-your-certificate',
    asset: '/certificates/hf-agents-course-certificate.png',
    assetKind: 'png',
    aspect: 1.3889,
    downloadName: 'Varun-BP-HuggingFace-Agents-Course-Certificate.png',
    openLabel: 'Open Agents Course',
    description: 'Hugging Face\'s hands-on course on building LLM agents — smolagents, LlamaIndex, LangGraph and Agentic RAG.',
    topics: ['AI Agents', 'smolagents', 'Agentic RAG'],
  },
  {
    id: 'hf-context-engineering',
    title: 'Context Engineering Course',
    issuer: 'Hugging Face',
    kind: 'certificate',
    status: 'earned',
    category: 'LLM & Gen AI',
    level: 'Beginner → Intermediate',
    credentialType: 'Online course + certificate of completion',
    cost: 'Free',
    certIssued: 'Certificate of Completion issued by Hugging Face on course completion',
    requirements: 'Basic LLM knowledge',
    achievement: 'Certificate of Completion',
    module: 'Context Engineering Course',
    date: '2026-03-09',
    dateLabel: 'March 9, 2026',
    verifyUrl: 'https://huggingface.co/learn/context-course/unit0/introduction',
    asset: '/certificates/hf-context-engineering-certificate.png',
    assetKind: 'png',
    aspect: 1.3889,
    downloadName: 'Varun-BP-HuggingFace-Context-Engineering-Certificate.png',
    openLabel: 'Open Context Course',
    description: 'Hugging Face\'s course on context engineering — context fundamentals, prompt design and a capstone project.',
    topics: ['Context Engineering', 'Prompt Design', 'Capstone'],
  },
  {
    id: 'hf-mcp-course',
    title: 'Model Context Protocol (MCP) Course',
    issuer: 'Hugging Face',
    kind: 'certificate',
    status: 'earned',
    category: 'LLM & Gen AI',
    level: 'Intermediate',
    credentialType: 'Online course + certificate of completion',
    cost: 'Free',
    certIssued: 'Certificate of Completion issued by Hugging Face on course completion',
    requirements: 'Python + basic LLM knowledge',
    achievement: 'Certificate of Completion',
    module: 'MCP Course',
    date: '2026-04-17',
    dateLabel: 'April 17, 2026',
    verifyUrl: 'https://huggingface.co/learn/mcp-course/unit3/certificate',
    asset: '/certificates/hf-mcp-course-certificate.png',
    assetKind: 'png',
    aspect: 1.3889,
    downloadName: 'Varun-BP-HuggingFace-MCP-Course-Certificate.png',
    openLabel: 'Open MCP Course',
    description: 'Hugging Face\'s MCP course, in partnership with Anthropic — MCP fundamentals and building a full application.',
    topics: ['MCP', 'Tool Use', 'AI Agents'],
  },
  {
    id: 'ms-agent-tools',
    title: 'Develop an agent with integrated tools',
    issuer: 'Microsoft',
    kind: 'certificate',
    status: 'earned',
    category: 'LLM & Gen AI',
    level: 'Intermediate',
    credentialType: 'Microsoft Applied Skills assessment',
    cost: 'Free assessment',
    certIssued: 'Microsoft Applied Skills credential',
    requirements: 'Hands-on assessment',
    achievement: 'Applied Skills credential',
    module: 'Applied Skills',
    date: '2026-05-21',
    dateLabel: 'May 21, 2026',
    verifyUrl: 'https://learn.microsoft.com/en-us/credentials/applied-skills/develop-an-agent-with-integrated-tools/',
    asset: '/certificates/ms-agent-tools-applied-skills.png',
    assetKind: 'png',
    aspect: 1.3846,
    downloadName: 'Varun-BP-Microsoft-Agent-Tools-Applied-Skills.png',
    openLabel: 'Open Applied Skills',
    description: 'Microsoft Applied Skills assessment on developing an agent with integrated tools.',
    topics: ['AI Agents', 'Tool Use'],
  },
  {
    id: 'google-intro-genai',
    title: 'Introduction to Generative AI',
    issuer: 'Google Cloud',
    kind: 'credential',
    status: 'open',
    category: 'LLM & Gen AI',
    level: 'Beginner',
    credentialType: 'Microlearning course (Google Cloud Skills Boost)',
    cost: 'Free introductory microlearning (~45 minutes)',
    certIssued: 'Completion badge when all required course activities are finished',
    requirements: 'None — introductory level',
    monogram: 'GC',
    learnUrl: 'https://www.cloudskillsboost.google/course_templates/536',
    description: 'Google Cloud\'s free introductory microlearning on large language models, prompt design and responsible generative AI.',
    topics: ['LLMs', 'Prompt Design', 'Vertex AI'],
  },
];

// Gallery filters: "All" plus status filters plus one per subject category.
export const credentialFilters = ['All', 'Earned', 'Completed', 'Available', 'LLM & Gen AI', 'AI & ML', 'Cloud & Data', 'Cybersecurity'];

export const languages = [
  { name: 'English', level: 'Full Professional' },
  { name: 'Kannada', level: 'Native' },
  { name: 'Hindi', level: 'Professional' },
  { name: 'Telugu', level: 'Professional' },
];

export const typewriterRoles = [
  'Agentic RAG Systems',
  'LLM Integrations',
  'Deep Learning & PyTorch',
  'Explainable AI',
  'Production-Ready AI Applications',
];