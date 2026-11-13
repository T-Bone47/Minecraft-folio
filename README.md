# ASISH: THE ENGINEERING FRONTIER
### An Explorable 3D Voxel Universe & Verified Engineering Defense System

[![Production Status](https://img.shields.io/badge/Production-READY%20%26%20ALIASED-success?style=for-the-badge&logo=vercel)](https://asish-engineering-world.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Unit%20Tests-167%2F167%20PASSING-emerald?style=for-the-badge&logo=node.js)](tests/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.29%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Physics Rate](https://img.shields.io/badge/Physics%20Step-60.0%20Hz%20RK4-blue?style=for-the-badge)](lib/frontier/drive.ts)
[![Accessibility](https://img.shields.io/badge/WCAG-2.2%20AA%20Compliant-purple?style=for-the-badge)](docs/ACCESSIBILITY.md)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

> **"Don't just show engineering capability. Let visitors challenge, simulate, and verify it."**

**Production Domain:** [https://asish-engineering-world.vercel.app](https://asish-engineering-world.vercel.app)  
**Author:** **Asish Oliver M** · Motorsport Software Engineer & AI/ML Systems Specialist  
**Education:** B.Tech Computer Science & Engineering, VIT-AP University  
**Location:** Trichy, Tamil Nadu, India `[10.7905° N, 78.7047° E]`  
**Contact:** `dreamteamoliver@gmail.com` · [GitHub @T-Bone47](https://github.com/T-Bone47) · [LinkedIn Profile](https://www.linkedin.com/in/asish-oliver-56b454324)

---

## 🏎️ Interactive Engineering Laboratories

Every major facility runs live client-side physical and numerical computations:

| Laboratory & Facility | Direct Production Link | Computational Core & Invariants | Senior Engineer & Recruiter Verification |
| :--- | :--- | :--- | :--- |
| **F1 Garage & Aerodynamics Setup** | [`/garage`](https://asish-engineering-world.vercel.app/garage) | Venturi underfloor ground effect suction, front/rear wing attack angles ($\alpha_f, \alpha_r$), heave spring rates ($k_{\text{heave}}$), and terminal velocity ($v_{\max}$). | Proves vehicle dynamics, aerodynamic efficiency ($L/D$), and porpoising prevention across Monza, Silverstone, Monaco, and Spa. |
| **Ghost Lap & FastF1 Telemetry** | [`/telemetry`](https://asish-engineering-world.vercel.app/telemetry) | Official FastF1 / OpenF1 Monza and Silverstone 2024 GPS telemetry overlay. Pearson $r \ge 0.984$, $R^2 \ge 0.984$ against 60Hz vehicle dynamics. | Proves high-frequency telemetry streaming and correlation against real-world Formula 1 telemetry. |
| **Race Strategy & Tire Degradation** | [`/strategy`](https://asish-engineering-world.vercel.app/strategy) | Monte Carlo stochastic simulation (300 iterations). Non-linear tire thermal wear ($\Delta t_{\text{deg}} = \alpha \cdot l^\beta$), fuel weight burn-off ($-0.033\,\text{s/kg}$), and Virtual Safety Car cheap pit-stop windows. | Demonstrates operations research, probabilistic risk modeling, and pit wall strategy optimization. |
| **Browser Chaos & Stress-Test Lab** | [`/chaos`](https://asish-engineering-world.vercel.app/chaos) | 10,000 eps telemetry burst flood, 800ms network jitter, 30% packet loss, and 25ms CPU starvation lag injection. | Proves distributed systems resilience, ring buffer eviction, and deterministic bounded memory $\le 48.0\,\text{MB}$. |
| **Quake-Style Engineering CLI** | [`/cli`](https://asish-engineering-world.vercel.app/cli) *(or press `~` anywhere)* | Retro monospace UNIX shell with tab auto-completion, command history, and direct telemetry/setup CLI execution. | Demonstrates CLI developer tooling, keyboard-driven ergonomics, and interactive runtime command execution. |
| **Hiring Committee 1-Click Dossier** | [`/dossier`](https://asish-engineering-world.vercel.app/dossier) | 4 Specialized Tracks (Motorsport, Systems, AI/ML, Architect). Print-optimized 2-page PDF layout, ATS blurb generator, and verifiable commit SHAs. | Equips hiring managers and committee chairs with executive decision briefs and proof-backed deliberation answers. |
| **Voxel Redstone-to-Silicon Gates** | [`/silicon`](https://asish-engineering-world.vercel.app/silicon) | Interactive switchboard levers, truth tables, redstone conduits, and embedded AutoSAR C++ firmware for ABS and DRS systems. | Bridges Minecraft redstone visual logic directly to real automotive silicon and production firmware. |
| **Frontier Systems Forge** | [`/forge`](https://asish-engineering-world.vercel.app/forge) | Executable architectural topology builder with node connections, latency analysis, and throughput verification. | Proves distributed systems architecture and causal graph evaluation. |
| **Frontier ProofCast Documentary** | [`/proofcast`](https://asish-engineering-world.vercel.app/proofcast) | Interactive 60-second and 3-minute engineering documentary player with verified GitHub provenance and code snippets. | Narrative clarity and engineering communication for technical recruiters and executives. |
| **Frontier Live Pulse Observatory** | [`/observatory`](https://asish-engineering-world.vercel.app/observatory) | Real GitHub engineering observatory inspecting 5 repositories, commit trends, and release cadence. | Demonstrates production software delivery and continuous open-source contribution. |

---

## 🔬 Mathematical & Architectural Invariants

The Engineering Frontier operates under formal mathematical invariants verified by automated test suites:

$$F_{\text{down}} = \frac{1}{2} \rho v^2 S C_L \quad \text{and} \quad F_{\text{drag}} = \frac{1}{2} \rho v^2 S C_D$$

$$\Delta t_{\text{deg}}(l) = \alpha \cdot l^\beta \quad \text{where} \quad \beta \in [1.08, 1.34]$$

$$\text{MemAllocated}(t) \le B_{\max} \cdot \text{sizeof}(\text{Packet}) + M_{\text{runtime}} \le 48.0\,\text{MB} \quad \forall t \ge 0$$

- **Physical Integration:** 60.0 Hz fixed time-step Runge-Kutta 4th order (RK4) integration loop.
- **Bounded Memory:** Zero unbounded heap allocation; circular ring buffer ($B_{\max} = 2048$) with tail eviction.
- **Time-Series Integrity:** Strictly non-decreasing monotonic timestamps ($\Delta t_i > 0$) stripping NaN kinematics.
- **Visual Design:** Authentic **Frontier Voxel Design System** with 8 original pixel materials and 0 CSS framework bloat.

---

## 🛠️ Tech Stack & Systems

- **Frontend Core:** Next.js 15.5.29 (App Router, Turbopack, Server Components), React 19, TypeScript
- **3D Graphics & Simulation:** Three.js 0.180, React Three Fiber 9, GLSL Shaders, WebGL 2.0
- **State & Ingest Architecture:** Zustand Monolithic Store, Circular Ring Buffers, Web Audio API
- **Motorsport Engineering:** FastF1 / OpenF1 GPS Telemetry Parser, Runge-Kutta 4th Order Lap Simulator, Pacejka Tire Model
- **Testing & Quality:** Node.js Native Test Runner (`node:test`), 167 unit tests across 16 test suites
- **Deployment:** Vercel Production Infrastructure (Automated CI/CD, Edge CDN, Statically Pre-rendered)

---

## 🚀 Quick Start & Local Verification

```bash
# Clone the repository
git clone https://github.com/T-Bone47/Minecraft-folio.git
cd Minecraft-folio

# Install locked dependencies
npm ci

# Run the 167-test automated verification suite
npm test

# Run Next.js production build (compiles all 86 static routes)
npm run build

# Start local development server
npm run dev
```

Visit `http://localhost:3000` to enter the Engineering Frontier. Press `~` or `` ` `` to toggle the Quake CLI Shell from anywhere.

---

## 📄 License & Attribution

Designed and developed by **Asish Oliver M**. Released under the [MIT License](LICENSE).  
Canonical production URL: [https://asish-engineering-world.vercel.app](https://asish-engineering-world.vercel.app)
