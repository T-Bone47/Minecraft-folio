import type { Project } from "@/types/project";

const authoredProjects: Project[] = [
  {
    id: "live-f1-intelligence",
    slug: "live-f1-intelligence",
    title: "Live F1 Intelligence",
    shortTitle: "Live F1 Intelligence",
    category: "motorsport",
    domains: ["motorsport", "data"],
    status: "active",
    year: "2026",
    featured: true,
    facility: "Telemetry Tower / Race Control",

    tagline: "Real-time F1 telemetry, event normalisation & race intelligence pipeline",
    description:
      "A provider-independent telemetry pipeline that ingests live data streams from OpenF1, FastF1, Jolpica, and F1 SignalR, validates and normalises records into a canonical event model, and derives real-time timing, pace, tyre degradation, battle detection, and strategy intelligence.",

    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "TimescaleDB",
      "WebSockets",
      "Docker",
      "Pandas",
      "NumPy",
      "FastF1",
      "OpenF1",
      "Jolpica",
      "F1 SignalR",
    ],

    metrics: [
      { value: "1,067,193", label: "Canonical Events", isVerified: true, evidence: "verified" },
      { value: "0", label: "Malformed Records", isVerified: true, evidence: "verified" },
      { value: "~2,650", label: "Events / Second", isVerified: true, evidence: "verified" },
      { value: "~0.10 ms", label: "P50 Latency / Event", isVerified: true, evidence: "verified" },
      { value: "99 MB", label: "Peak Memory Usage", isVerified: true, evidence: "verified" },
    ],

    // 01 PROBLEM
    problemStatement:
      "Formula 1 timing and telemetry data is fragmented across proprietary feeds, open-source community scrapers, and official WebSocket endpoints. Upstream feeds suffer from schema drift, connection jitter, irregular sample rates (from 1 Hz timing deltas to 200 Hz car telemetry), and missing packets during red flags or Safety Car periods. Downstream race strategy and performance tools cannot rely on raw provider formats without breaking on schema changes.",

    // 02 SYSTEM
    systemOverview:
      "Live F1 Intelligence is a high-throughput, provider-agnostic data pipeline designed to ingest multi-source telemetry, sanitize and validate payloads at the boundary, normalise them into a strictly typed canonical event model, and compute derived race intelligence in sub-millisecond real time.",

    // 03 ARCHITECTURE
    architecture: {
      summary:
        "Four providers feed a unified ingestion → validation → normalisation pipeline into one canonical event model, which then drives nine concurrent intelligence engines and publishes live telemetry over WebSockets.",
      pipeline: [
        { label: "Data Ingestion (OpenF1, FastF1, Jolpica, F1 SignalR)" },
        { label: "Schema Validation & Sanitization" },
        { label: "Event Normalisation & Timestamp Alignment" },
        {
          label: "Canonical Event Model (Deterministic Replay & Provenance Tagging)",
          children: [
            "Timing & Delta Tracking",
            "Sector Analysis & Micro-Sectors",
            "Rolling Pace & Outlier Rejection",
            "Tyre Degradation Regression",
            "Battle & DRS Gap Detection",
            "Race Control State Machine",
            "Strategy Candidates & Pit Windows",
            "Qualifying Intelligence",
            "Practice Long-Run Analysis",
          ],
        },
        { label: "WebSocket & TimescaleDB Persistence Engine" },
        { label: "Live Telemetry & Strategy Dashboard" },
      ],
      stack: ["Python", "FastAPI", "PostgreSQL", "TimescaleDB", "WebSockets", "Docker"],
    },

    // 04 ENGINEERING APPROACH
    engineeringApproach:
      "The core architectural principle is strict separation between ingestion feeds and analytical consumers. Every incoming telemetry record is decorated with immutable cryptographic provenance metadata (provider ID, reception timestamp, sequence index). Records pass through a zero-allocation validation loop before conversion into canonical event structs, enabling deterministic replay of complete race sessions for offline strategy backtesting.",

    // 05 IMPLEMENTATION
    implementationDetails:
      "Implemented in Python 3.12 utilizing FastAPI for asynchronous HTTP and WebSocket routing, backed by TimescaleDB hyper-tables for high-frequency time-series queries. Custom deserializers parse car telemetry, position coordinates, and lap timings. A sliding-window regression model calculates dynamic tyre wear coefficients per stint while filtering out slow laps caused by yellow flags, traffic, or out-laps.",

    // 06 VALIDATION
    validationStrategy:
      "System integrity is validated against recorded race session fixtures from the 2024 and 2025 Formula 1 seasons. End-to-end integration tests verify that 1,067,193 canonical events stream through the ingestion and normalisation layers with zero dropped packets and zero malformed records. Performance benchmarks measure event processing latency under burst conditions.",

    // 07 RESULTS / EVIDENCE
    resultsAndEvidence:
      "Benchmark validation confirms the pipeline processes approximately 2,650 events per second with a median (p50) processing latency of ~0.10 ms per event. Total system memory remained stable at 99 MB peak across a full 57-lap Grand Prix simulation, confirming zero memory leaks in the event dispatch loop.",

    // 08 LIMITATIONS
    limitations:
      "Upstream public endpoints (e.g., OpenF1) can experience rate limits or latency spikes during live broadcast events. Tyre compound telemetry from third-party feeds relies on manual transponder updates and can lag pit exit events by 10–15 seconds.",

    // 09 WHAT I LEARNED
    whatILearned:
      "Engineering data pipelines for live motorsport requires designing for dirty data first. Establishing a strict canonical boundary model early eliminated downstream cascade failures and allowed new analysis modules to be built in hours without touching feed ingestion code.",

    // 10 NEXT ITERATION
    nextIteration:
      "Implementing real-time predictive Monte Carlo pit window simulations that factor in forecasted Safety Car probabilities, pit lane transit deltas, and live traffic re-entry gaps.",

    engineeringDecisions: [
      {
        title: "Provider-Independent Canonical Event Model",
        rationale:
          "Decouples analytical consumers from upstream feed quirks and breaking API changes across OpenF1, FastF1, Jolpica, and SignalR.",
      },
      {
        title: "Zero-Allocation Event Parsing Loop",
        rationale:
          "Maintains sub-millisecond p50 processing latency during multi-car telemetry bursts without triggering Python garbage collection pauses.",
      },
      {
        title: "Deterministic Replay Architecture",
        rationale:
          "Enables historical race sessions to be replayed tick-for-tick at arbitrary playback speeds for algorithm verification and strategy backtesting.",
      },
    ],

    currentState: "Active — continuous live telemetry pipeline and intelligence engine.",
    links: {
      repository: "https://github.com/T-Bone47",
    },
  },

  {
    id: "f1-lap-time-simulator",
    slug: "f1-lap-time-simulator",
    title: "F1 Lap-Time Simulator",
    shortTitle: "Lap-Time Simulator",
    category: "motorsport",
    domains: ["simulation", "motorsport"],
    status: "near-completion",
    year: "2025",
    featured: true,
    facility: "Simulation Lab",

    tagline: "Vehicle performance & numerical lap simulation solver",
    description:
      "A numerical vehicle-performance solver that models aerodynamic downforce, tyre grip, power-limited traction, and friction-circle limits to calculate maximum cornering speeds, forward/backward velocity profiles, and sector performance decompositions.",

    technologies: [
      "MATLAB",
      "Python",
      "NumPy",
      "SciPy",
      "Matplotlib",
    ],

    metrics: [
      { value: "MATLAB V1", label: "Primary Implementation", isVerified: true, evidence: "verified" },
      { value: "Exact", label: "Analytical Corner-Speed Match", isVerified: true, evidence: "verified" },
      { value: "Passed", label: "Baseline Verification Suite", isVerified: true, evidence: "verified" },
      { value: "Closed-Form", label: "Aero Corner Speed Solution", isVerified: true, evidence: "verified" },
    ],

    // 01 PROBLEM
    problemStatement:
      "Physical circuit testing in motorsport is severely constrained by regulations and budget caps. Engineering teams require deterministic, physics-based simulation tools to evaluate aerodynamic package revisions, gear ratios, and suspension stiffness before touching the track. Black-box machine learning models cannot provide physical sensitivity derivatives required for engineering setup decisions.",

    // 02 SYSTEM
    systemOverview:
      "A quasi-steady-state point-mass vehicle performance simulator originally designed in MATLAB with an analytical Python/NumPy verification implementation. It takes discretized 3D track curvature and elevation data and converges on optimal cornering and longitudinal acceleration profiles across the entire lap.",

    // 03 ARCHITECTURE
    architecture: {
      summary:
        "Sequential physics pipeline: track geometry and vehicle mass properties feed tyre friction and aerodynamic maps into a power-limited friction circle solver, generating corner speeds, forward/backward integration sweeps, and lap performance decomposition.",
      pipeline: [
        { label: "Track Discretization (Curvature, Elevation, Banking)" },
        { label: "Vehicle Mass & Aerodynamic Model (Cl, Cd, Frontal Area)" },
        { label: "Tyre Normal Load Calculation (Static + Aero Downforce)" },
        { label: "Friction Circle Boundary (Lateral vs Longitudinal Grip)" },
        { label: "Corner Apex Speed Solver (Analytical Equilibrium)" },
        { label: "Forward Acceleration Sweep (Traction & Power Limited)" },
        { label: "Backward Braking Sweep (Braking & Grip Limited)" },
        { label: "Velocity Envelope Merge & Lap Time Integration" },
        { label: "Sector-by-Sector Performance Decomposition" },
      ],
      stack: ["MATLAB", "Python", "NumPy", "SciPy", "Matplotlib"],
    },

    // 04 ENGINEERING APPROACH
    engineeringApproach:
      "The simulator employs a quasi-steady-state formulation where the vehicle is treated as a point mass subject to gravity, aerodynamic downforce ($F_z = 0.5 \\rho C_L A v^2$), drag ($F_d = 0.5 \\rho C_D A v^2$), and tyre friction limits dictated by a friction ellipse. Velocity envelopes are determined by multi-pass integration: calculating apex corner speeds, accelerating forward out of corners until power-limited or terminal velocity, and integrating backward from braking zones.",

    // 05 IMPLEMENTATION
    implementationDetails:
      "Engineered in MATLAB for numerical matrix operations and ported to Python 3 with NumPy for automated continuous integration verification. Track profiles are discretized into arc-length segments with curvature radii $\\kappa(s)$. Aerodynamic coefficients are mapped to vehicle ride height curves. The engine power curve defines longitudinal thrust limits across gear shifts.",

    // 06 VALIDATION
    validationStrategy:
      "Validated against analytical constant-radius steady-state cornering equations ($v = \\sqrt{\\frac{\\mu g R}{1 - \\frac{0.5 \\rho C_L A \\mu R}{m}}}$) to confirm the numerical solver matches the closed-form result. Energy conservation checks compare kinetic and potential energy transfer against engine work and braking dissipation. A Python/NumPy reference implementation was used to run these checks under automated continuous integration; the MATLAB V1 solver itself is not independently verified by that harness.",

    // 07 RESULTS / EVIDENCE
    resultsAndEvidence:
      "The analytical constant-radius corner-speed validation matched the numerical solver exactly, and the full baseline verification suite passes. The simulator decomposes lap-time deltas between low-drag and high-downforce aerodynamic configurations across sector types. No specific lap time is published here: outputs shown in this portfolio are illustrative demo output, not a verified benchmark result.",

    // 08 LIMITATIONS
    limitations:
      "Point-mass formulation assumes zero transient weight transfer delay and does not model damper velocity compliance over high curbs or chassis roll/pitch transient stiffness.",

    // 09 WHAT I LEARNED
    whatILearned:
      "Signature engineering discovery: during an aero sweep the original iterative corner-speed calculation diverged at high downforce configurations, oscillating between speed and downforce-dependent normal load. Analysing that failure mode showed the governing quadratic force balance has an exact closed-form solution. Replacing the iteration removed the divergence entirely and made the solver stable across the sweep. PROBLEM: solver divergence at high downforce. DECISION: replace the iteration with a closed-form solution. TRADEOFF: no longer able to absorb non-ideal tyre or load-transfer corrections inside the iteration. RESULT: numerically stable across the full aero sweep.",

    // 10 NEXT ITERATION
    nextIteration:
      "Expanding the solver to a 4-wheel quasi-transient bicycle model incorporating dynamic longitudinal load transfer and tire thermal degradation sweeps.",

    engineeringDecisions: [
      {
        title: "Exact Closed-Form Solution for Corner Speeds",
        rationale:
          "Replaced divergent iterative fixed-point solvers with an exact analytical solution of the aerodynamic-tyre force balance equation.",
      },
      {
        title: "Dual Forward-Backward Velocity Envelope Sweeps",
        rationale:
          "Guarantees that vehicle speed never exceeds braking deceleration limits on entry or traction friction limits on corner exit.",
      },
    ],

    currentState: "Near completion — numerical verification and sensitivity decomposition complete.",
    links: {
      repository: "https://github.com/T-Bone47",
    },
  },

  {
    id: "racemind-ai",
    slug: "racemind-ai",
    title: "RaceMind-AI",
    shortTitle: "RaceMind-AI",
    category: "motorsport",
    domains: ["motorsport", "ai-ml"],
    status: "active",
    year: "2026",
    featured: true,
    facility: "Race Engineering Garage",

    tagline: "AI-assisted race engineering software for competitive motorsport & simulation",
    description:
      "A game-agnostic telemetry abstraction layer that ingests high-frequency UDP telemetry, builds structured session memory, and powers an AI race engineer for real-time strategy calls, tire wear models, fuel targets, and voice coaching.",

    technologies: [
      "Python",
      "FastAPI",
      "UDP Sockets",
      "WebSockets",
      "SQLAlchemy",
      "PostgreSQL",
      "Docker",
      "Pytest",
      "LLM Integration",
    ],

    metrics: [
      { value: "60 Hz", label: "UDP Telemetry Ingestion Rate", isVerified: true, evidence: "verified" },
      { value: "< 25 ms", label: "Packet Parse to State Latency", isVerified: true, evidence: "verified" },
      { value: "100%", label: "Game-Agnostic State Representation", isVerified: true, evidence: "verified" },
      { value: "Codemasters F1", label: "Validated Game Protocol", isVerified: true, evidence: "verified" },
    ],

    // 01 PROBLEM
    problemStatement:
      "Drivers in competitive motorsport and high-level sim racing operate at high cognitive workloads. Analyzing multi-lap tyre degradation curves, computing undercut/overcut pit deltas, and adjusting fuel consumption targets while driving at 300+ km/h is overwhelming. Existing telemetry overlays display raw numbers but lack contextual engineering reasoning.",

    // 02 SYSTEM
    systemOverview:
      "RaceMind-AI acts as a digital virtual race engineer. It captures live UDP telemetry from simulation titles, abstracts proprietary packet structures into a standardized session state, runs deterministic strategy calculations, and provides natural-language engineering guidance via text or voice.",

    // 03 ARCHITECTURE
    architecture: {
      summary:
        "Telemetry flow: Raw UDP packets feed an abstraction adapter that normalises session state. Strategic, tyre, fuel, weather, and coaching models feed structured state to an AI race engineer for contextual decision-making.",
      pipeline: [
        { label: "Raw UDP Telemetry Stream (F1 / Sim Title)" },
        { label: "Game Protocol Packet Parser (Codemasters F1 2024 Specification)" },
        { label: "Game-Agnostic Telemetry Normalisation" },
        {
          label: "Session State & Strategy Engine",
          children: [
            "Stint Tyre Thermal & Wear Degradation Model",
            "Fuel Target & Lift-and-Coast Calculations",
            "Weather Radar & Crossover Timing",
            "Undercut / Overcut Pit Window Analyzer",
            "Driver Coaching & Micro-Sector Delta Detection",
          ],
        },
        { label: "FastAPI Backend & Asynchronous SQLAlchemy Database" },
        { label: "AI Race Engineer Reasoning Core (Contextual LLM Prompts)" },
        { label: "Driver Voice / Audio Radio Uplink" },
      ],
      stack: ["Python", "FastAPI", "UDP Sockets", "WebSockets", "SQLAlchemy", "PostgreSQL", "Docker"],
    },

    // 04 ENGINEERING APPROACH
    engineeringApproach:
      "Strict separation between telemetry acquisition, domain physics calculations, and language generation. Raw telemetry is processed asynchronously at 60 Hz without blocking the AI reasoning core. The language model is never exposed to raw telemetry numbers; it receives structured, aggregated engineering state summaries with specific strategy options.",

    // 05 IMPLEMENTATION
    implementationDetails:
      "Implemented with Python's asyncio and socket libraries for high-rate UDP packet reception. The data layer uses FastAPI with WebSockets for real-time client streaming and SQLAlchemy with PostgreSQL for stint persistence. The strategy engine computes pit window delta equations deterministically before querying the AI layer for verbal phrasing.",

    // 06 VALIDATION
    validationStrategy:
      "Validated through simulated UDP telemetry replays recorded from Codemasters F1 Grand Prix races. Pytest test suites test packet parsing boundary conditions, malformed packet recovery, and pit-window delta calculations.",

    // 07 RESULTS / EVIDENCE
    resultsAndEvidence:
      "Real-time UDP packet parsing latency measured below 25 ms. Strategy engine accurately identifies optimal undercut windows when trailing cars enter within 1.8 seconds of the lead car and tire degradation crosses the critical pace penalty threshold.",

    // 08 LIMITATIONS
    limitations:
      "Currently tested and validated specifically on Codemasters F1 UDP protocol. Support for iRacing and Assetto Corsa Competizione is architected but currently planned for future implementation. Desktop UI client is currently in active development.",

    // 09 WHAT I LEARNED
    whatILearned:
      "Latency and conciseness are paramount in race engineering communications. A race engineer must never deliver a paragraph when a driver needs three words: 'Box box, confirm.' Prompts must enforce brevity, operational clarity, and high signal-to-noise ratio.",

    // 10 NEXT ITERATION
    nextIteration:
      "Adding edge-accelerated local text-to-speech voice synthesis and multi-sim protocol adapters for iRacing and rFactor 2.",

    engineeringDecisions: [
      {
        title: "Decoupled Telemetry Abstraction Layer",
        rationale:
          "Enables identical strategy calculations and AI coaching logic to run across different racing simulations by translating game packets into a single canonical session schema.",
      },
      {
        title: "Deterministic Strategy Verification Before LLM Query",
        rationale:
          "Eliminates hallucinated pit stops by ensuring all lap time delta and fuel numbers are strictly calculated by Python math before being provided to the AI voice layer.",
      },
    ],

    currentState: "Backend implemented and tested on Codemasters F1 protocol. Desktop UI in development.",
    illustrativeLabel: "ILLUSTRATIVE DEMO SESSION",
    links: {
      repository: "https://github.com/T-Bone47",
    },
  },

  {
    id: "f1-race-manager",
    slug: "f1-race-manager",
    title: "F1 Race Manager",
    shortTitle: "F1 Race Manager",
    category: "simulation-game",
    domains: ["game"],
    status: "in-development",
    year: "2026",
    featured: false,
    facility: "Team Operations HQ",
    isGame: true,

    tagline: "F1 team management & strategy simulation game",
    description:
      "A strategic Formula 1 team management and race simulation game developed in Unity (C#). Players lead a constructor through car R&D, staff contracts, budget caps, and dynamic race-weekend strategy decisions covering tyres, weather, Safety Cars, and reliability.",

    technologies: [
      "Unity",
      "C#",
      "Python",
      "JSON",
    ],

    metrics: [
      { value: "Game", label: "Architecture Type", isVerified: true, evidence: "verified" },
      { value: "C# / Unity", label: "Core Simulation Engine", isVerified: true, evidence: "verified" },
      { value: "Deterministic", label: "Race State Machine", isVerified: true, evidence: "verified" },
      { value: "In Dev", label: "Project Status", isVerified: true, evidence: "verified" },
    ],

    // 01 PROBLEM
    problemStatement:
      "Commercial management games often compromise between either overly simplistic mobile timers or overly obtuse spreadsheets. Motorsport enthusiasts want a strategic management game that captures the tension of pit wall strategy calls under dynamic weather and Safety Car deployments while managing multi-year car development within financial regulations.",

    // 02 SYSTEM
    systemOverview:
      "A Formula 1 team management and race strategy simulation game [GAME — IN DEVELOPMENT]. It simulates constructor operations across two primary modules: Headquarters Long-Term Operations (staff, facilities, R&D, finance) and Race Weekend Tactical Command (strategy, stint execution, weather forecasting, safety car reactions).",

    // 03 ARCHITECTURE
    architecture: {
      summary:
        "The game couples an off-track constructor operations layer with a deterministic on-track race weekend simulation engine running decoupled from rendering frame rates.",
      pipeline: [
        {
          label: "Constructor Operations Layer (Off-Track)",
          children: [
            "Driver & Engineering Staff Contracts",
            "Aerodynamic Wind Tunnel & CFD Allocation",
            "Chassis, PU, & Aero R&D Progression",
            "Financial Regulations & Budget Cap Ledger",
            "Factory Facility Upgrades",
          ],
        },
        {
          label: "Race Weekend Simulation Engine (On-Track)",
          children: [
            "Session State Machine (Practice, Quali, Race)",
            "Dynamic Weather & Rain Track Wetness Model",
            "Tyre Compound Thermal Degradation & Grain",
            "Safety Car & Virtual Safety Car Deployments",
            "Component Mechanical Reliability Failures",
            "Traffic Dirty Air Penalties & Pit Lane Re-entry",
          ],
        },
      ],
      stack: ["Unity", "C#", "Python"],
    },

    // 04 ENGINEERING APPROACH
    engineeringApproach:
      "The simulation engine is architected in pure C# POCOs (Plain Old CLR Objects) decoupled from Unity's MonoBehaviour and GameObject rendering hierarchy. This architectural separation enables the race simulation to run in headless background threads at 100x real-time speed for automated game balance testing and Monte Carlo season validation.",

    // 05 IMPLEMENTATION
    implementationDetails:
      "Built with Unity 6 using C#. State serialization uses structured JSON schemas for multi-season save persistence. Statistical balancing tools written in Python evaluate car upgrade curves and tire wear progression to ensure competitive AI team behavior.",

    // 06 VALIDATION
    validationStrategy:
      "Validated through batch headless race simulations running 1,000 algorithmic race runs across different circuits to audit Safety Car probability distributions, undercut success rates, and championship points spread.",

    // 07 RESULTS / EVIDENCE
    resultsAndEvidence:
      "Headless simulation runs 57 laps of Grand Prix race logic in approximately 320 milliseconds in batch mode. The game state machine correctly triggers dynamic strategy recalculations when rainfall reaches the intermediate tire crossover threshold.",

    // 08 LIMITATIONS
    limitations:
      "This is a STRATEGY SIMULATION GAME, NOT a physical vehicle-performance simulator. It models statistical race interactions and strategy tradeoffs rather than continuous vehicle dynamics or computational fluid mechanics.",

    // 09 WHAT I LEARNED
    whatILearned:
      "Decoupling the game's simulation logic from the game engine's rendering loop is essential for performance, maintainability, and automated balance testing.",

    // 10 NEXT ITERATION
    nextIteration:
      "Completing driver negotiation AI personality traits and expanding real-time pit wall audio-visual presentation elements.",

    engineeringDecisions: [
      {
        title: "Decoupled Headless Simulation Core",
        rationale:
          "Runs race logic independently of Unity rendering frames, enabling fast automated Monte Carlo balance testing and reproducible race results.",
      },
      {
        title: "Distinct Category Classification",
        rationale:
          "Clearly designated as an interactive strategic game to maintain strict distinction from engineering tools like Live F1 Intelligence and the numerical Lap-Time Simulator.",
      },
    ],

    currentState: "In development — strategic gameplay systems and UI implementation.",
    links: {
      repository: "https://github.com/T-Bone47",
    },
  },

  {
    id: "ea-fc-intelligence",
    slug: "ea-fc-intelligence",
    title: "Football Intelligence OS (EA FC Intelligence)",
    shortTitle: "Football Intelligence OS",
    category: "ai-ml",
    domains: ["ai-ml", "data"],
    status: "active",
    year: "2025",
    featured: false,
    facility: "AI / Data Lab",

    tagline: "Player-intelligence and recommendation engine over the FC26 player dataset",
    description:
      "An AI/ML player-intelligence and recommendation engine built over the FC26 player dataset of 16,228 players. It cleans and normalises the attribute table, projects players into a latent representation space, and serves role-similarity recommendations. This engine is scoped to the FC26 dataset itself and is distinct from any separate research into FUT card data, APIs or licensing.",

    technologies: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Matplotlib",
      "Seaborn",
    ],

    metrics: [
      { value: "16,228", label: "FC26 Players In Dataset", isVerified: true, evidence: "verified" },
      { value: "128D", label: "Latent Player Embedding Space", isVerified: true, evidence: "verified" },
      { value: "Unsupervised", label: "Representation Learning", isVerified: true, evidence: "verified" },
    ],

    // 01 PROBLEM
    problemStatement:
      "The FC26 player dataset describes 16,228 players across many correlated physical, technical and behavioural attributes. Reading that table by hand does not reveal which players are genuinely interchangeable within a tactical role, and similarity search across raw columns is dominated by scale differences between attribute groups.",

    // 02 SYSTEM
    systemOverview:
      "An AI/ML intelligence pipeline that transforms raw player attribute metrics into dense latent representation vectors, applies dimensionality reduction, and evaluates tactical similarity through cosine distance and cluster analysis.",

    // 03 ARCHITECTURE
    architecture: {
      summary:
        "Data-to-intelligence pipeline: attribute data ingestion and robust outlier filtering feed normalization and feature weighting into dense embedding vectors, evaluated by similarity scoring algorithms.",
      pipeline: [
        { label: "Raw Sports Player Dataset Ingestion" },
        { label: "Data Cleaning & Missing-Value Imputation" },
        { label: "Domain-Weighted Feature Normalization (MinMax / RobustScaler)" },
        { label: "Dimensionality Reduction & Latent Space Embeddings (PCA / t-SNE)" },
        { label: "Tactical Role Profiling & Archetype Clustering (K-Means / GMM)" },
        { label: "Cosine Similarity Matrix & Replacement Recommendation Engine" },
        { label: "Multi-Axis Radar Profiler & Visual Scouting Report Generation" },
      ],
      stack: ["Python", "Pandas", "Scikit-learn", "NumPy"],
    },

    // 04 ENGINEERING APPROACH
    engineeringApproach:
      "Applies unsupervised learning and geometric vector space mathematics. Player attributes are grouped into positional domains (e.g., ball progression, defensive duel win rates, recovery pacing) and normalized to prevent absolute physical attributes from skewing tactical recommendations.",

    // 05 IMPLEMENTATION
    implementationDetails:
      "Engineered in Python using Pandas for tabular data wrangling and Scikit-learn for dimensionality reduction and distance calculations. Role-weighted cosine similarity measures the angular distance between player capability vectors, surfacing non-obvious player alternatives across leagues.",

    // 06 VALIDATION
    validationStrategy:
      "Clustering quality is assessed with silhouette scores over the latent space, and nearest-neighbour retrieval is inspected qualitatively against known positional groups before recommendations are trusted.",

    // 07 RESULTS / EVIDENCE
    resultsAndEvidence:
      "The engine produces a 128-dimensional representation for each of the 16,228 players and returns role-similarity recommendations from that space. No accuracy or alignment score is claimed: this is an active implementation and its quantitative evaluation is still in progress.",

    // 08 LIMITATIONS
    limitations:
      "Evaluates seasonal aggregate player attributes only. It does not process real-time spatio-temporal tracking data, and it works from the public FC26 attribute dataset — it has no access to any licensed or proprietary EA data feed. Separate FUT card data / API / licensing research is a distinct effort and is not part of this engine.",

    // 09 WHAT I LEARNED
    whatILearned:
      "Domain knowledge in feature engineering is far more decisive than model complexity. Properly grouping and weighting tactical sub-attributes yielded significantly better recommendations than feeding unweighted raw metrics into deep neural architectures.",

    // 10 NEXT ITERATION
    nextIteration:
      "Integrating age-progression trajectory curves to forecast player attribute development over subsequent seasons.",

    engineeringDecisions: [
      {
        title: "Domain-Weighted Positional Embeddings",
        rationale:
          "Prevents generic attributes like sprint speed from overpowering specialized tactical metrics like progressive passing accuracy in midfield role searches.",
      },
      {
        title: "Strict Analytics Scope",
        rationale:
          "Focuses strictly on the machine learning player intelligence and recommendation architecture, keeping it separate from external card-gaming APIs.",
      },
    ],

    currentState: "Active — analytics pipeline and scouting recommendation algorithms.",
    links: {
      repository: "https://github.com/T-Bone47",
    },
  },

  {
    id: "vyaparpulse",
    slug: "vyaparpulse",
    title: "VyaparPulse",
    shortTitle: "VyaparPulse",
    category: "ai-ml",
    domains: ["ai-ml", "data"],
    status: "active",
    year: "2024",
    featured: false,
    facility: "Intelligence / Forecasting Lab",

    tagline: "Voice-first financial intelligence & revenue forecasting platform for MSMEs",
    description:
      "A voice-first merchant financial intelligence system created for Smart India Hackathon. It transcribes spoken transactions using an offline Vosk engine, extracts structured ledger items via an LLM, safeguards duplicate records, and forecasts 7-day revenues using XGBoost.",

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "TailwindCSS",
      "Capacitor",
      "Python",
      "FastAPI",
      "SQLite",
      "SQLAlchemy",
      "Vosk",
      "XGBoost",
      "Pandas",
    ],

    metrics: [
      { value: "Offline", label: "Local Speech-to-Text Processing", isVerified: true, evidence: "verified" },
      { value: "7-Day", label: "Predictive Revenue Forecast Window", isVerified: true, evidence: "verified" },
      { value: "100%", label: "Idempotent Duplicate Protection", isVerified: true, evidence: "verified" },
      { value: "< 800 ms", label: "Voice-to-Ledger Commit Latency", isVerified: true, evidence: "verified" },
    ],

    // 01 PROBLEM
    problemStatement:
      "Small retail merchants and micro-enterprises operate in fast-paced counter environments where typing sales into software disrupts customer interactions. Consequently, store owners resort to fragmented paper notebooks, resulting in uncollected customer credit, untracked inventory shrinkage, and zero predictive visibility into upcoming cash flows.",

    // 02 SYSTEM
    systemOverview:
      "VyaparPulse is a voice-first financial ledger and revenue intelligence platform originated as a Smart India Hackathon team project. It enables store owners to speak transactions naturally, converts speech into structured ledger entries without external cloud audio latency, and forecasts upcoming revenue using machine learning.",

    // 03 ARCHITECTURE
    architecture: {
      summary:
        "Speech input is transcribed locally with Vosk, structured into canonical transactions by an LLM, audited by a reconciliation and duplicate-prevention backend, and analyzed by an XGBoost model for revenue forecasting.",
      pipeline: [
        { label: "Spoken Audio Input (Merchant Speech at Counter)" },
        { label: "Offline Vosk Speech-to-Text Transcription" },
        { label: "Structured LLM Extraction (Entity, Amount, Unit, Mode)" },
        { label: "Canonical Transaction Schema & Idempotency Key Generation" },
        { label: "FastAPI Backend & SQLAlchemy Ledger Reconciliation" },
        { label: "XGBoost Time-Series ML Engine (Lag Features, Day-of-Week)" },
        { label: "7-Day Revenue Forecast with Confidence Intervals" },
        { label: "Business Insights & Cashflow Health Diagnostics" },
      ],
      stack: [
        "React",
        "TypeScript",
        "Vite",
        "TailwindCSS",
        "Capacitor",
        "Python",
        "FastAPI",
        "SQLite",
        "Vosk",
        "XGBoost",
      ],
    },

    // 04 ENGINEERING APPROACH
    engineeringApproach:
      "Architected with an offline-first priority. Counter speech is transcribed locally on-device using a lightweight Vosk acoustic model, eliminating cloud latency and protecting sensitive merchant financial data. The backend enforces strict transaction idempotency keys to prevent duplicate sales entries when users repeat confirmations.",

    // 05 IMPLEMENTATION
    implementationDetails:
      "Frontend engineered in React and Vite with Capacitor for cross-platform mobile packaging. The backend is built with FastAPI and SQLite/SQLAlchemy. The revenue forecasting module uses XGBoost regression trained on historical daily sales, incorporating rolling window averages, day-of-week encodings, and holiday lag indicators.",

    // 06 VALIDATION
    validationStrategy:
      "Validated through team testing with simulated Indian retail transaction audio across varied ambient background noise levels. Tested edge cases including partial sentences, currency unit colloquialisms, and insufficient historical transaction periods.",

    // 07 RESULTS / EVIDENCE
    resultsAndEvidence:
      "Offline voice-to-structured-ledger commits execute in under 800 ms. The XGBoost forecasting model generates 7-day revenue projections with explicit confidence interval bands and gracefully falls back to descriptive historical averages when fewer than 14 days of transaction history exist.",

    // 08 LIMITATIONS
    limitations:
      "Acoustic transcription accuracy degrades in extremely loud market environments. Forecasting requires a minimum of two weeks of regular transactions before machine learning confidence scores exceed baseline statistical medians.",

    // 09 WHAT I LEARNED
    whatILearned:
      "Building for real-world merchants taught me that system robustness under network drops and simple voice UX matter vastly more than complex dashboard widgets. Providing graceful fallbacks for missing data is mandatory in production systems.",

    // 10 NEXT ITERATION
    nextIteration:
      "Adding multi-lingual regional language models and automated supplier purchase reordering via WhatsApp Business webhooks.",

    engineeringDecisions: [
      {
        title: "Offline-First Local STT Engine (Vosk)",
        rationale:
          "Eliminates network dependency and cloud transcription API costs while keeping merchant transaction audio on-device.",
      },
      {
        title: "Idempotent Transaction Deduping",
        rationale:
          "Protects the ledger from accidental double-counting when merchants re-confirm verbal commands within short time windows.",
      },
      {
        title: "Graceful Cold-Start Forecasting Fallback",
        rationale:
          "Prevents misleading ML predictions for newly opened accounts by displaying descriptive moving averages until sufficient historical data accumulates.",
      },
    ],

    currentState: "Active prototype platform originated at Smart India Hackathon.",
    links: {
      repository: "https://github.com/T-Bone47",
    },
  },

  {
    id: "saksham",
    slug: "saksham",
    title: "SAKSHAM — Applied AI / ML Intelligence Pipeline",
    shortTitle: "SAKSHAM",
    category: "ai-ml",
    domains: ["ai-ml", "data"],
    status: "in-development",
    year: "2026",
    featured: false,
    facility: "AI / Data Lab",

    tagline: "Assistive intelligence and multi-modal machine learning pipelines for accessibility and enablement",
    description:
      "An applied machine learning intelligence pipeline focused on automated feature extraction, model evaluation, and accessible assistive workflows. Developed under rigorous verification principles without proprietary overhead.",

    technologies: [
      "Python 3.12",
      "Scikit-learn",
      "PyTorch",
      "NumPy",
      "Pandas",
      "FastAPI",
    ],

    metrics: [
      { value: "In Development", label: "Verification Grade", isVerified: false, evidence: "in-development" },
      { value: "Multi-Modal", label: "Architecture Type", isVerified: false, evidence: "in-development" },
      { value: "0", label: "Fabricated Claims", isVerified: true, evidence: "verified" },
    ],

    // 01 PROBLEM
    problemStatement:
      "Assistive technologies and social enablement applications frequently encounter brittle performance in edge deployment due to unvetted cloud dependencies, inference latency, and brittle preprocessing pipelines.",

    // 02 SYSTEM
    systemOverview:
      "SAKSHAM is an applied machine learning framework providing lightweight, edge-compatible feature preprocessing, offline model evaluation, and accessible API endpoints.",

    // 03 ARCHITECTURE
    architecture: {
      summary:
        "Multi-stage pipeline: multi-modal feature ingestion feeds lightweight normalization, local model inference, and accessible REST API dispatch.",
      pipeline: [
        { label: "Multi-Modal Signal Ingestion" },
        { label: "Data Sanitization & Missing Value Imputation" },
        { label: "Feature Extraction & Vector Normalization" },
        { label: "Edge-Compatible Machine Learning Inference" },
        { label: "Accessible API Endpoint Dispatch" },
      ],
      stack: ["Python 3.12", "Scikit-learn", "NumPy", "Pandas", "FastAPI"],
    },

    // 04 ENGINEERING APPROACH
    engineeringApproach:
      "Prioritizes low-latency local execution, robust exception boundaries, and modular microservices architecture over unverified black-box cloud APIs.",

    // 05 IMPLEMENTATION
    implementationDetails:
      "Implemented in Python 3.12 with clean interface contracts, asynchronous request handling via FastAPI, and strict typing across all data pipelines.",

    // 06 VALIDATION
    validationStrategy:
      "Validation is performed using reproducible synthetic fixtures and unit-tested boundary evaluations. System limits are documented and verified prior to production deployment.",

    // 07 RESULTS / EVIDENCE
    resultsAndEvidence:
      "In active engineering development. Pipeline stages pass local unit verification with zero fabricated performance metrics or unverified benchmark claims.",

    // 08 LIMITATIONS
    limitations:
      "Edge deployment memory constraints require quantized model architectures. Multi-lingual dialect support remains bounded by local dictionary coverage.",

    // 09 WHAT I LEARNED
    whatILearned:
      "Designing accessible and assistive software requires treating edge failure modes and latency as core architectural constraints rather than afterthoughts.",

    // 10 NEXT ITERATION
    nextIteration:
      "Quantized ONNX runtime acceleration and real-time streaming audio pipeline evaluation.",

    currentState: "Active research and engineering development.",
    links: {
      repository: "https://github.com/T-Bone47",
    },
  },
];

// Public repository review on 2026-11-07. Historical narratives remain author-reported;
// no external performance claim is independently reproduced by this portfolio.
const reviewedSources: Record<string,{repository:string;documentation?:string;summary:string}> = {
 "live-f1-intelligence": {repository:"https://github.com/T-Bone47/live-f1-intelligence",documentation:"https://github.com/T-Bone47/live-f1-intelligence/tree/main/docs",summary:"The repository reports 1,067,193 events from one 2026 Dutch GP recording and approximately 2,650 events/s, 0.10 ms median latency and 99 MB peak memory in its backtest. These results were not rerun here. PostgreSQL persistence is implemented; TimescaleDB is optional."},
 "racemind-ai": {repository:"https://github.com/T-Bone47/RaceMind-AI",documentation:"https://github.com/T-Bone47/RaceMind-AI/tree/main/docs",summary:"The README describes a FastAPI backend, a normalised telemetry boundary, a strategy engine and AI engineer. It reports backend verification while describing website and desktop applications as pending. No numeric latency or ingestion-rate benchmark was verified in this review."},
 "f1-lap-time-simulator": {repository:"https://github.com/T-Bone47/f1-pro-simulator-",documentation:"https://github.com/T-Bone47/f1-pro-simulator-/blob/master/LIMITATIONS.md",summary:"The public source includes a point-mass simulation and explicit limitations. Its limitations document describes a Python reference fallback where MATLAB is unavailable. The playable campus car is a separate educational model; no equivalence to the project solver is claimed."},
 "f1-race-manager": {repository:"https://github.com/T-Bone47/race-manager",documentation:"https://github.com/T-Bone47/race-manager/tree/main/Documentation",summary:"The repository describes an in-progress data pipeline and C# determinism scaffold. Its README explicitly lists the real simulation core and local Unity project as future work. This is not a completed racing game."},
 "ea-fc-intelligence": {repository:"https://github.com/T-Bone47/EA_FC_INTELLIGENCE",summary:"Public source repository located. Dataset counts, embedding dimensions and evaluation claims in the legacy narrative have not been independently validated here."},
 "vyaparpulse": {repository:"https://github.com/T-Bone47/vyaparpulse-ai",summary:"Public source describes an offline-first intelligence engine for forecasting, anomaly detection and explainable business insights. The local teaching forecast uses synthetic data; it is not a benchmark of this project."}
};
export const projects: Project[] = authoredProjects.map(p => {
 const source=reviewedSources[p.slug];
 return {...p,
  status:p.slug==="f1-race-manager"?"in-development":p.status,
  links:source?{repository:source.repository,documentation:source.documentation??source.repository+"#readme"}:{},
  metrics:p.slug==="live-f1-intelligence"?p.metrics?.map(m=>({...m,isVerified:false,evidence:"repository-reported" as const,note:"One repository-reported recorded session; not independently reproduced."})):[],
  resultsAndEvidence:source?.summary??"No project-specific public source or measurement artifact was verified in this audit. The existing description is author-supplied and remains unverified.",
  evidenceReview:{checkedAt:"2026-11-07",status:source?"Source located; results are repository-reported":"Implementation evidence pending",summary:source?.summary??"SAKSHAM remains in development. No model accuracy, deployment status or completed capability is asserted here."},
  validationStrategy:source?"Review the linked repository documentation and tests for project validation. This portfolio's tests validate only the local demonstrations; they do not certify the external project.":"Validation evidence is pending. No external measurements are presented.",
 };
});

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

export const featuredProjects = (): Project[] => projects.filter((project) => project.featured);
