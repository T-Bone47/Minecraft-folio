/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Extensible Engineering Skill Taxonomy & Curated Role Presets
 */

import type { CanonicalSkill, CuratedRolePreset } from "./types";

export const CANONICAL_SKILL_TAXONOMY: CanonicalSkill[] = [
  // ==========================================
  // 1. PROGRAMMING LANGUAGES
  // ==========================================
  {
    id: "lang-python",
    name: "Python",
    category: "languages",
    aliases: ["python3", "python 3", "py"],
    keywords: ["python", "asyncio", "fastapi", "pydantic", "numpy", "pandas"],
    description: "Production Python 3.12, asynchronous programming with asyncio, numerical processing with NumPy/Pandas, and typed APIs with Pydantic.",
  },
  {
    id: "lang-typescript",
    name: "TypeScript",
    category: "languages",
    aliases: ["ts"],
    disambiguation: [
      { confusedWith: "JavaScript", distinction: "Strict static type system with generics, discriminated unions, and noImplicitAny." },
    ],
    keywords: ["typescript", "strict types", "generics", "ts"],
    description: "Strict static typing, generic constraints, discriminated union state machines, and typed Next.js/React architectures.",
  },
  {
    id: "lang-javascript",
    name: "JavaScript",
    category: "languages",
    aliases: ["js", "es6", "esnext", "ecmascript"],
    disambiguation: [
      { confusedWith: "Java", distinction: "Dynamic prototype-based scripting language running in V8/browser, distinct from compiled JVM Java." },
    ],
    keywords: ["javascript", "es6", "v8", "event loop", "promises"],
    description: "Modern ECMAScript, event loop concurrency, zero-allocation buffers, and browser runtime performance.",
  },
  {
    id: "lang-sql",
    name: "SQL",
    category: "languages",
    aliases: ["postgres sql", "postgresql", "ansi sql", "relational database"],
    disambiguation: [
      { confusedWith: "NoSQL", distinction: "Relational structured query language enforcing schemas, ACID transactions, and relational joins." },
    ],
    keywords: ["sql", "queries", "joins", "indexes", "transactions", "ddl"],
    description: "Relational query authoring, hypertable partition indexing, complex analytical joins, and transactional isolation.",
  },
  {
    id: "lang-cpp",
    name: "C++",
    category: "languages",
    aliases: ["cpp", "cplusplus"],
    keywords: ["c++", "cpp", "native", "pointers", "memory management"],
    description: "Native systems programming, memory safety constraints, and low-latency numerical kernels.",
  },

  // ==========================================
  // 2. SOFTWARE ENGINEERING PRINCIPLES
  // ==========================================
  {
    id: "se-api-design",
    name: "API Design & Contracts",
    category: "software-engineering",
    aliases: ["rest api design", "api contracts", "interface design", "typed interfaces"],
    keywords: ["api design", "openapi", "endpoints", "contracts", "pydantic schemas"],
    description: "Contract-first API design, strict boundary validation, semantic HTTP status codes, and deterministic schemas.",
  },
  {
    id: "se-testing",
    name: "Automated Testing & QA",
    category: "software-engineering",
    aliases: ["unit testing", "integration testing", "test automation", "e2e testing", "tdd"],
    keywords: ["testing", "pytest", "unit tests", "integration tests", "puppeteer", "qa automation"],
    description: "Comprehensive testing matrices: unit test suites, mathematical invariant assertion, and headless browser automation.",
  },
  {
    id: "se-system-architecture",
    name: "System Architecture & Modular Design",
    category: "software-engineering",
    aliases: ["software architecture", "clean architecture", "modular design", "separation of concerns"],
    keywords: ["system architecture", "modularity", "clean architecture", "domain boundaries", "coupling"],
    description: "Decoupled domain boundaries, dependency inversion, pure algorithmic cores, and maintainable distributed codebases.",
  },
  {
    id: "se-state-management",
    name: "State Management & State Machines",
    category: "software-engineering",
    aliases: ["finite state machine", "fsm", "zustand", "immutable state", "redux pattern"],
    keywords: ["state management", "fsm", "state machine", "zustand", "transitions"],
    description: "Deterministic finite state machines, unidirectional data flow, reactive state stores, and transactional transitions.",
  },
  {
    id: "se-performance",
    name: "Performance & Optimization",
    category: "software-engineering",
    aliases: ["performance optimization", "low latency", "profiling", "zero allocation", "sub-millisecond"],
    keywords: ["performance", "latency", "throughput", "memory leaks", "optimization", "sub-millisecond"],
    description: "Sub-millisecond processing budgets, zero-allocation ring buffers, garbage collection minimization, and frame budget adherence.",
  },
  {
    id: "se-security",
    name: "Software Security & Cryptography",
    category: "software-engineering",
    aliases: ["cryptographic audit", "hmac", "sha-256", "tamper proof", "data privacy"],
    keywords: ["security", "cryptography", "hmac", "sha-256", "signatures", "merkle", "privacy"],
    description: "Cryptographic evidence digests, HMAC SHA-256 signing, non-repudiation, tamper-evident audit trails, and zero-PII storage.",
  },

  // ==========================================
  // 3. BACKEND & INFRASTRUCTURE
  // ==========================================
  {
    id: "be-fastapi",
    name: "FastAPI & Async Python Backends",
    category: "backend-infra",
    aliases: ["fastapi", "uvicorn", "async backend", "python web framework"],
    keywords: ["fastapi", "async def", "uvicorn", "starlette", "web server"],
    description: "High-throughput asynchronous Python web microservices, dependency injection, and automated OpenAPI documentation.",
  },
  {
    id: "be-websockets",
    name: "WebSockets & Real-Time Event Fan-Out",
    category: "backend-infra",
    aliases: ["websocket", "real-time streaming", "bidirectional streaming", "socket server"],
    keywords: ["websockets", "ws", "streaming", "real-time events", "fan-out", "backpressure"],
    description: "Full-duplex WebSocket connections, real-time telemetry streaming, client backpressure mitigation, and event fan-out.",
  },
  {
    id: "be-timescaledb",
    name: "TimescaleDB & PostgreSQL Time-Series",
    category: "backend-infra",
    aliases: ["timescale", "timescaledb", "postgresql", "time-series database", "hypertables"],
    keywords: ["timescaledb", "hypertables", "postgres", "time-series", "continuous aggregates"],
    description: "High-frequency time-series persistence, automated hypertable partitioning, continuous analytical aggregates, and data compression.",
  },
  {
    id: "be-docker",
    name: "Docker & Containerization",
    category: "backend-infra",
    aliases: ["docker", "container", "dockerfile", "docker-compose"],
    keywords: ["docker", "containers", "multi-stage build", "containerization"],
    description: "Multi-stage Docker builds, isolated runtime environments, minimal production images, and container orchestration.",
  },
  {
    id: "be-distributed-systems",
    name: "Distributed Stream Processing & Pipelines",
    category: "backend-infra",
    aliases: ["distributed systems", "event streaming", "stream processing", "pipeline architecture"],
    keywords: ["distributed systems", "streaming pipeline", "event processing", "ingestion", "throughput"],
    description: "High-throughput stream ingestion, multi-provider fan-in, circuit breaking, and distributed failure tolerance.",
  },

  // ==========================================
  // 4. AI & MACHINE LEARNING
  // ==========================================
  {
    id: "ai-feature-engineering",
    name: "Feature Engineering & Data Preprocessing",
    category: "ai-ml",
    aliases: ["feature engineering", "data preprocessing", "feature extraction", "signal normalization"],
    keywords: ["features", "feature engineering", "preprocessing", "scaling", "lagged features"],
    description: "Creation of time-series lagged features, signal normalization, outlier rejection, and domain-informed transform functions.",
  },
  {
    id: "ai-model-evaluation",
    name: "Model Evaluation & Leakage Prevention",
    category: "ai-ml",
    aliases: ["model validation", "cross-validation", "time-series split", "leakage prevention"],
    keywords: ["evaluation", "metrics", "rmse", "cross-validation", "data leakage", "chronological split"],
    description: "Rigorous chronological cross-validation, target leakage detection, precision/recall trade-offs, and residual analysis.",
  },
  {
    id: "ai-time-series",
    name: "Time-Series Forecasting & XGBoost",
    category: "ai-ml",
    aliases: ["demand forecasting", "xgboost", "time-series regression", "gradient boosting"],
    keywords: ["forecasting", "xgboost", "time-series", "regression trees", "trend analysis"],
    description: "Gradient boosted decision trees for multi-step horizon forecasting, seasonal decomposition, and prediction confidence intervals.",
  },
  {
    id: "ai-embeddings-drift",
    name: "Semantic Embeddings & Vector Drift Detection",
    category: "ai-ml",
    aliases: ["embeddings", "vector similarity", "cosine distance", "data drift", "distribution shift"],
    keywords: ["embeddings", "cosine distance", "semantic drift", "vector search", "centroid"],
    description: "Real-time cosine distance measurement in 1536-dimensional embedding spaces, semantic drift detection, and adversarial boundary scanning.",
  },
  {
    id: "ai-governance-rmf",
    name: "AI Governance & NIST AI RMF Compliance",
    category: "ai-ml",
    aliases: ["ai governance", "grc", "nist ai rmf", "iso 42001", "model risk management"],
    keywords: ["ai governance", "nist ai rmf", "iso 42001", "compliance", "risk management", "audit"],
    description: "Automated continuous AI risk management, NIST AI RMF executable controls, and cryptographic compliance evidence logging.",
  },
  {
    id: "ai-ondevice-asr",
    name: "On-Device Speech Recognition (ASR)",
    category: "ai-ml",
    aliases: ["vosk", "speech to text", "stt", "offline speech", "asr"],
    keywords: ["vosk", "speech recognition", "speech-to-text", "audio parsing", "offline asr"],
    description: "Quantized, lightweight on-device acoustic models (Vosk) running purely locally on CPU without external cloud APIs.",
  },

  // ==========================================
  // 5. DATA ENGINEERING & TELEMETRY
  // ==========================================
  {
    id: "de-stream-ingestion",
    name: "Multi-Source Telemetry Ingestion",
    category: "data-engineering",
    aliases: ["telemetry ingestion", "data ingestion", "feed ingestion", "provider adapters"],
    keywords: ["ingestion", "telemetry feeds", "stream ingestion", "multi-source", "events/sec"],
    description: "Provider-agnostic ingestion pipelines receiving heterogeneous high-frequency data streams (> 2,600 events/sec sustained).",
  },
  {
    id: "de-canonical-normalization",
    name: "Event Normalization & Canonical Modeling",
    category: "data-engineering",
    aliases: ["event normalization", "canonical model", "data sanitization", "schema normalization"],
    keywords: ["normalization", "canonical event", "schema validation", "sanitization", "provenance"],
    description: "Transforming disparate third-party formats into unified, strictly-typed canonical structs with cryptographic provenance headers.",
  },
  {
    id: "de-spatial-alignment",
    name: "Spatial Distance-Domain Telemetry Resampling",
    category: "data-engineering",
    aliases: ["distance domain", "spatial resampling", "lap alignment", "micro-sectors"],
    keywords: ["spatial resampling", "distance-domain", "cubic spline", "lap alignment", "micro-sectors"],
    description: "Resampling temporal time-series onto uniform fixed spatial track distance bins (10m) to eliminate time-distortion during lap comparisons.",
  },
  {
    id: "de-session-replay",
    name: "Deterministic Session Replay & Timing Towers",
    category: "data-engineering",
    aliases: ["session replay", "timing tower", "telemetry replay", "event replay"],
    keywords: ["replay", "timing tower", "playback", "session replay", "telemetry trace"],
    description: "Deterministic playback of complete Grand Prix sessions (> 1M records) driving 20-car live timing towers and delta traces.",
  },

  // ==========================================
  // 6. MOTORSPORT & VEHICLE SIMULATION
  // ==========================================
  {
    id: "ms-strategy-engine",
    name: "Race Strategy & Undercut Decision Trees",
    category: "motorsport-sim",
    aliases: ["race strategy", "pit stop optimizer", "undercut", "overcut", "safety car strategy"],
    keywords: ["race strategy", "pit stop", "undercut", "overcut", "safety car", "decision tree"],
    description: "Dynamic pit stop window solvers calculating net race time delta under Safety Car/VSC, undercut matrices, and traffic traps.",
  },
  {
    id: "ms-tyre-degradation",
    name: "Non-Linear Tyre Thermal Degradation Modeling",
    category: "motorsport-sim",
    aliases: ["tyre degradation", "tyre wear", "thermal cliff", "pace decay", "friction circle"],
    keywords: ["tyre degradation", "compound wear", "thermal cliff", "pace decay", "friction curve"],
    description: "Polynomial degradation modeling (wear scaling with age exponent and quadratic thermal penalties exceeding optimal temperature).",
  },
  {
    id: "ms-vehicle-kinematics",
    name: "Quasi-Static Lap Simulation & Vehicle Kinematics",
    category: "motorsport-sim",
    aliases: ["lap time simulation", "quasi-static solver", "vehicle dynamics", "point mass solver"],
    keywords: ["vehicle dynamics", "lap simulation", "friction circle", "g-g diagram", "apex speed"],
    description: "Point-mass vehicle dynamics solvers adhering to friction ellipse limits, downforce sensitivity, and braking deceleration envelopes.",
  },
  {
    id: "ms-udp-telemetry",
    name: "High-Speed UDP Sim Telemetry Bridges",
    category: "motorsport-sim",
    aliases: ["udp telemetry", "sim rig telemetry", "binary deserializer", "f1 24 udp"],
    keywords: ["udp", "socket", "sim telemetry", "struct unpack", "binary packet"],
    description: "60 Hz low-latency UDP socket receivers with binary struct deserialization and sequence jitter filtering.",
  },

  // ==========================================
  // 7. FRONTEND & USER EXPERIENCE
  // ==========================================
  {
    id: "fe-react-nextjs",
    name: "React 19 & Next.js App Router",
    category: "frontend",
    aliases: ["react", "next.js", "nextjs", "react 19", "app router", "ssr"],
    disambiguation: [
      { confusedWith: "Reactive Programming", distinction: "Component-based UI library with hooks, concurrent rendering, and server components, not general RxJS observable streams." },
    ],
    keywords: ["react", "next.js", "app router", "server components", "hooks", "jsx"],
    description: "Modern component architecture, Next.js App Router with server-side rendering (SSR), static site generation (SSG), and sub-frame React rendering.",
  },
  {
    id: "fe-offline-first",
    name: "Offline-First Architecture & Durable Queues",
    category: "frontend",
    aliases: ["offline-first", "local-first", "indexeddb", "sqlite wal", "sync queue"],
    keywords: ["offline-first", "sync queue", "sqlite", "indexeddb", "reconciliation", "durability"],
    description: "Resilient offline-first state machines writing to local durable queues with monotonic sequence reconciliation upon reconnection.",
  },
  {
    id: "fe-threejs-webgl",
    name: "Three.js & React Three Fiber 3D Graphics",
    category: "frontend",
    aliases: ["three.js", "r3f", "webgl", "3d graphics", "shaders"],
    keywords: ["three.js", "r3f", "webgl", "3d canvas", "shaders", "materials"],
    description: "High-performance WebGL 3D rendering, voxel geometry generation, lighting shaders, and camera interpolation rigs.",
  },
  {
    id: "fe-accessibility",
    name: "Web Accessibility (A11y) & Performance Budgets",
    category: "frontend",
    aliases: ["accessibility", "a11y", "reduced motion", "wcag", "responsive design"],
    keywords: ["accessibility", "a11y", "reduced motion", "screen reader", "keyboard navigation"],
    description: "Universal accessibility compliance: reduced-motion preference detection, complete keyboard navigation, and responsive 2D fallback routes.",
  },
];

// ==========================================
// 8. CURATED ROLE PRESETS
// ==========================================
export const CURATED_ROLE_PRESETS: CuratedRolePreset[] = [
  {
    id: "role-motorsport-software",
    slug: "motorsport-software",
    title: "Motorsport Software Engineer",
    shortTitle: "Motorsport SWE",
    discipline: "Vehicle Telemetry, Strategy Systems & Real-Time Dynamics",
    targetAudience: "Formula 1, WEC, IMSA Race Teams & Simulation Providers",
    defaultBudget: "QUICK_90S",
    description: "Architecting low-latency binary telemetry ingestion, distance-domain lap alignment, and real-time undercut decision engines.",
    recommendedGuideNpcId: "dr-elena-rostova",
    coreRequirements: [
      { canonicalSkillId: "ms-strategy-engine", skillName: "Race Strategy & Undercut Decision Trees", category: "motorsport-sim", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "ms-tyre-degradation", skillName: "Non-Linear Tyre Thermal Degradation Modeling", category: "motorsport-sim", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "de-spatial-alignment", skillName: "Spatial Distance-Domain Telemetry Resampling", category: "data-engineering", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "ms-udp-telemetry", skillName: "High-Speed UDP Sim Telemetry Bridges", category: "motorsport-sim", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "lang-python", skillName: "Python", category: "languages", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "se-performance", skillName: "Performance & Optimization", category: "software-engineering", priority: "PREFERRED", importance: 4 },
    ],
  },

  {
    id: "role-backend-systems",
    slug: "backend",
    title: "Backend & Distributed Systems Engineer",
    shortTitle: "Backend Systems",
    discipline: "High-Throughput Microservices, Relational DBs & Real-Time APIs",
    targetAudience: "Enterprise Cloud Platforms, Real-Time Financial & Analytics Systems",
    defaultBudget: "PROFESSIONAL_5M",
    description: "Engineering fault-tolerant streaming pipelines, TimescaleDB hypertable persistence, and zero-allocation REST/WebSocket APIs.",
    recommendedGuideNpcId: "marcus-vance",
    coreRequirements: [
      { canonicalSkillId: "be-fastapi", skillName: "FastAPI & Async Python Backends", category: "backend-infra", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "be-timescaledb", skillName: "TimescaleDB & PostgreSQL Time-Series", category: "backend-infra", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "be-websockets", skillName: "WebSockets & Real-Time Event Fan-Out", category: "backend-infra", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "se-api-design", skillName: "API Design & Contracts", category: "software-engineering", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "se-testing", skillName: "Automated Testing & QA", category: "software-engineering", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "be-docker", skillName: "Docker & Containerization", category: "backend-infra", priority: "PREFERRED", importance: 3 },
    ],
  },

  {
    id: "role-aiml-engineer",
    slug: "aiml",
    title: "AI / Machine Learning Engineer",
    shortTitle: "AI/ML Engineer",
    discipline: "Applied Machine Learning, Time-Series Modeling & AI Governance",
    targetAudience: "Autonomous Systems, Quantitative Research & Enterprise AI Platforms",
    defaultBudget: "PROFESSIONAL_5M",
    description: "Developing non-leakage time-series forecasting models, semantic vector drift detectors, and NIST AI RMF automated compliance.",
    recommendedGuideNpcId: "dr-maya-lin",
    coreRequirements: [
      { canonicalSkillId: "ai-model-evaluation", skillName: "Model Evaluation & Leakage Prevention", category: "ai-ml", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "ai-time-series", skillName: "Time-Series Forecasting & XGBoost", category: "ai-ml", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "ai-embeddings-drift", skillName: "Semantic Embeddings & Vector Drift Detection", category: "ai-ml", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "ai-governance-rmf", skillName: "AI Governance & NIST AI RMF Compliance", category: "ai-ml", priority: "PREFERRED", importance: 4 },
      { canonicalSkillId: "lang-python", skillName: "Python", category: "languages", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "ai-feature-engineering", skillName: "Feature Engineering & Data Preprocessing", category: "ai-ml", priority: "REQUIRED", importance: 4 },
    ],
  },

  {
    id: "role-data-engineer",
    slug: "data-engineer",
    title: "Data Systems & Streaming Pipeline Engineer",
    shortTitle: "Data Engineer",
    discipline: "High-Volume Telemetry Streaming, Event Normalization & Replay",
    targetAudience: "Large-Scale Streaming Platforms, IoT & Broadcast Telemetry Networks",
    defaultBudget: "PROFESSIONAL_5M",
    description: "Building resilient stream ingestion pipelines handling 1,000,000+ events with zero dropped records and sub-millisecond p50 latency.",
    recommendedGuideNpcId: "marcus-vance",
    coreRequirements: [
      { canonicalSkillId: "de-stream-ingestion", skillName: "Multi-Source Telemetry Ingestion", category: "data-engineering", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "de-canonical-normalization", skillName: "Event Normalization & Canonical Modeling", category: "data-engineering", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "de-session-replay", skillName: "Deterministic Session Replay & Timing Towers", category: "data-engineering", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "be-timescaledb", skillName: "TimescaleDB & PostgreSQL Time-Series", category: "backend-infra", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "lang-sql", skillName: "SQL", category: "languages", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "se-performance", skillName: "Performance & Optimization", category: "software-engineering", priority: "PREFERRED", importance: 4 },
    ],
  },

  {
    id: "role-full-stack",
    slug: "full-stack",
    title: "Full-Stack & Offline-First Engineer",
    shortTitle: "Full-Stack Engineer",
    discipline: "Responsive Web Platforms, Offline Synchronization & Resilient UX",
    targetAudience: "Modern Product Startups, High-Impact Web Applications & Offline Solutions",
    defaultBudget: "QUICK_90S",
    description: "Bridging asynchronous Python APIs and modern React 19 / Next.js frontends with durable offline SQLite queues and accessible UI.",
    recommendedGuideNpcId: "sarah-jenkins",
    coreRequirements: [
      { canonicalSkillId: "fe-react-nextjs", skillName: "React 19 & Next.js App Router", category: "frontend", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "lang-typescript", skillName: "TypeScript", category: "languages", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "fe-offline-first", skillName: "Offline-First Architecture & Durable Queues", category: "frontend", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "be-fastapi", skillName: "FastAPI & Async Python Backends", category: "backend-infra", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "fe-accessibility", skillName: "Web Accessibility (A11y) & Performance Budgets", category: "frontend", priority: "PREFERRED", importance: 3 },
    ],
  },

  {
    id: "role-simulation-engineer",
    slug: "simulation-engineer",
    title: "Vehicle Simulation & Dynamics Engineer",
    shortTitle: "Simulation Engineer",
    discipline: "Applied Mathematics, Grip Envelopes & Lap Time Prediction",
    targetAudience: "Vehicle Dynamics Teams, Simulation Developers & Automotive OEMs",
    defaultBudget: "DEEP_DIVE",
    description: "Formulating quasi-static lap time solvers, G-G friction ellipse constraints, and aero downforce sensitivity maps.",
    recommendedGuideNpcId: "dr-aaron-chen",
    coreRequirements: [
      { canonicalSkillId: "ms-vehicle-kinematics", skillName: "Quasi-Static Lap Simulation & Vehicle Kinematics", category: "motorsport-sim", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "ms-tyre-degradation", skillName: "Non-Linear Tyre Thermal Degradation Modeling", category: "motorsport-sim", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "lang-python", skillName: "Python", category: "languages", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "se-testing", skillName: "Automated Testing & QA", category: "software-engineering", priority: "PREFERRED", importance: 4 },
    ],
  },

  {
    id: "role-race-strategist",
    slug: "race-strategist",
    title: "Race Strategy & Performance Decision Engineer",
    shortTitle: "Race Strategist",
    discipline: "Tactical Race Calls, Monte Carlo Sim & Pit Stop Window Analysis",
    targetAudience: "Motorsport Pit Wall Strategy Departments & Racing Simulators",
    defaultBudget: "QUICK_90S",
    description: "Evaluating real-time pit entry decisions under safety cars, traffic gap analysis, and tyre wear cliff management.",
    recommendedGuideNpcId: "dr-elena-rostova",
    coreRequirements: [
      { canonicalSkillId: "ms-strategy-engine", skillName: "Race Strategy & Undercut Decision Trees", category: "motorsport-sim", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "ms-tyre-degradation", skillName: "Non-Linear Tyre Thermal Degradation Modeling", category: "motorsport-sim", priority: "REQUIRED", importance: 5 },
      { canonicalSkillId: "de-spatial-alignment", skillName: "Spatial Distance-Domain Telemetry Resampling", category: "data-engineering", priority: "REQUIRED", importance: 4 },
      { canonicalSkillId: "lang-python", skillName: "Python", category: "languages", priority: "REQUIRED", importance: 4 },
    ],
  },
];

export const getSkillById = (id: string): CanonicalSkill | undefined =>
  CANONICAL_SKILL_TAXONOMY.find((s) => s.id === id);

export const getRolePresetBySlug = (slug: string): CuratedRolePreset | undefined =>
  CURATED_ROLE_PRESETS.find((r) => r.slug === slug || r.id === slug);

export const getAllRolePresets = (): CuratedRolePreset[] => CURATED_ROLE_PRESETS;

