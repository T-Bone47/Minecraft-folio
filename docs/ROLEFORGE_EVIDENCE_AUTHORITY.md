# ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
## EVIDENCE AUTHORITY ENGINE SPECIFICATION & ARCHITECTURE

---

### 1. Architectural Mission & Core Principles

The **Evidence Authority Engine** is the cryptographic and architectural truth layer of **Frontier RoleForge 2.0**.
It operates under a non-negotiable professional mandate:

> **Don't just claim engineering capability—cryptographically prove and bound it.**

Traditional portfolio websites and AI job compilers rely on synthetic ATS scores, unverified bullet points, or fictional skills. In contrast, the Evidence Authority Engine:
1. **Validates against real Git commits**: Every capability is tied to an authoritative Git commit SHA verified against remote repositories (`T-Bone47/RaceMind-AI`, `T-Bone47/live-f1-intelligence`, `T-Bone47/Sentinel-AI`, `T-Bone47/vyaparpulse-ai`, and `T-Bone47/Minecraft-folio`).
2. **Anchors to concrete file paths**: Links directly to genuine source code files (e.g., `backend/strategy/pit_window.py`, `backend/app/ingest/pipeline.py`).
3. **Enforces test references**: Requires automated test suite commands (`pytest`, `tsx --test`).
4. **Mandates honest limitations**: Rejects any evidence node claiming 100% perfection without disclosed engineering boundaries (e.g., dry asphalt calibration, REST rate limits, vector drift tolerances).
5. **Classifies provenance objectively**: Categorizes evidence into `VERIFIED`, `PARTIALLY_VERIFIED`, `DOCUMENTED_ONLY`, `EDUCATIONAL_RECONSTRUCTION`, `UNVERIFIED`, and `UNAVAILABLE`.

---

### 2. Verified Repository Matrix

| Project | Authoritative Repository | Verified Commit SHA | Primary Production Tech | Key Verifiable Artifacts |
| :--- | :--- | :--- | :--- | :--- |
| **RaceMind AI** | `https://github.com/T-Bone47/RaceMind-AI` | `850d3c97e4fdf4aa37112efdde2e1eb7bfbd992d` | Python 3.11, Asyncio, UDP, NumPy | `backend/strategy/pit_window.py`, `backend/strategy/tyre.py`, `backend/telemetry/udp_listener.py` |
| **Live F1 Intelligence** | `https://github.com/T-Bone47/live-f1-intelligence` | `975836a2df0e50f9d8be25005ad010168241f985` | Python, FastAPI, TimescaleDB, SignalR | `backend/app/ingest/pipeline.py`, `backend/app/storage/db.py`, `backend/app/analysis/track_geometry.py` |
| **Sentinel AI** | `https://github.com/T-Bone47/Sentinel-AI` | `e2014234bdd9e7b9449c9569dbde0e3342b27873` | Python, FastAPI, NIST AI RMF, Vector DB | `sentinel-ai-backend/app/services/risk_intelligence.py`, `sentinel-ai-backend/app/services/evidence_intelligence.py` |
| **VyaparPulse AI** | `https://github.com/T-Bone47/vyaparpulse-ai` | `6500f738bf0f7fe6c535118bd8c8801a54e2a218` | Python, SQLite, Whisper, FastAPI | `teammate-backend/app/main.py`, `voice-agent/agent.py` |
| **Engineering Campus** | `https://github.com/T-Bone47/Minecraft-folio` | `10d2f63` | Next.js 15, React 19, Three.js, Zustand | `components/world/WorldScene.tsx`, `lib/roleforge/evidenceGraph.ts` |

---

### 3. Verification Ruleset & Scoring Model

Each evidence node is audited across 6 strict rules:

$$\text{IntegrityScore} = \sum_{r \in \text{Rules}} w_r \cdot \mathbb{I}(\text{check}_r = \text{true})$$

1. **`RULE_REPO_FORMAT` ($w = 0.20$)**: Source repository matches `https://github.com/username/repo`.
2. **`RULE_COMMIT_SHA` ($w = 0.20$)**: Commit hash is a valid 7 to 40 character hexadecimal SHA.
3. **`RULE_SOURCE_PATH` ($w = 0.20$)**: Non-empty, space-free relative file path with valid file extension.
4. **`RULE_TEST_COVERAGE` ($w = 0.15$)**: At least 1 automated unit or integration test command documented.
5. **`RULE_DISCLOSED_LIMITATIONS` ($w = 0.15$)**: At least 1 honest engineering boundary disclosed.
6. **`RULE_INTERACTIVE_VERIFICATION` ($w = 0.10$)**: Linked interactive in-world demonstration or trial.

Nodes with $\ge 0.85$ score meeting all structural checks are classified as **`VERIFIED`**.

---

### 4. Machine-Readable Export

The engine outputs a canonical manifest at:
`docs/roleforge-evidence-integrity.json`

This file is version-controlled and checked by CI during automated testing.
