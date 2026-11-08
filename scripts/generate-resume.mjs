/**
 * Generates an official, beautifully formatted PDF resume for Asish Oliver M.
 * Uses standard PDF-1.4 syntax with precise text streams, fonts, and xref table.
 * Zero external dependencies.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function generateResumePdf() {
  const content = [];

  // Helper for drawing text
  // Coordinates: 0,0 is bottom-left of Letter page (612 x 792 pt)
  const drawText = (text, x, y, font, size, r = 0, g = 0, b = 0) => {
    // Escape parentheses and backslashes in PDF text strings
    const escaped = text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    return `BT /${font} ${size} Tf ${r} ${g} ${b} rg 1 0 0 1 ${x} ${y} Tm (${escaped}) Tj ET\n`;
  };

  const drawRect = (x, y, w, h, r, g, b, fill = true) => {
    return `${r} ${g} ${b} ${fill ? "rg" : "RG"} ${x} ${y} ${w} ${h} re ${fill ? "f" : "s"}\n`;
  };

  const drawLine = (x1, y1, x2, y2, r, g, b, lineWidth = 1) => {
    return `${lineWidth} w ${r} ${g} ${b} RG ${x1} ${y1} m ${x2} ${y2} l S\n`;
  };

  let pageStream = "";

  // Page background: pristine white
  pageStream += drawRect(0, 0, 612, 792, 1, 1, 1, true);

  // Top header banner: subtle dark carbon bar
  pageStream += drawRect(36, 742, 540, 2, 0.9, 0.5, 0, true); // Orange accent bar

  // Name & Title
  pageStream += drawText("ASISH OLIVER M", 36, 752, "F2", 20, 0.08, 0.08, 0.1);
  pageStream += drawText("MOTORSPORT SOFTWARE ENGINEER  |  AI / ML ENGINEER", 36, 730, "F2", 9.5, 0.2, 0.4, 0.7);

  // Contact line
  const contact = "Trichy, Tamil Nadu, India  *  dreamteamoliver@gmail.com  *  github.com/T-Bone47  *  linkedin.com/in/asish-oliver-56b454324";
  pageStream += drawText(contact, 36, 716, "F1", 8, 0.35, 0.35, 0.4);

  // Divider line
  pageStream += drawLine(36, 706, 576, 706, 0.85, 0.85, 0.88, 1);

  let y = 690;

  // SECTION HELPER
  const addSection = (title) => {
    pageStream += drawText(title, 36, y, "F2", 11, 0.08, 0.08, 0.12);
    pageStream += drawLine(36, y - 4, 576, y - 4, 0.2, 0.4, 0.7, 1.2);
    y -= 18;
  };

  // 1. EXECUTIVE SUMMARY
  addSection("ENGINEERING PROFILE");
  pageStream += drawText(
    "Motorsport Software Engineer and AI/ML Systems Engineer specializing in high-throughput real-time telemetry",
    36, y, "F1", 8.8, 0.2, 0.2, 0.22
  );
  y -= 12;
  pageStream += drawText(
    "pipelines, numerical quasi-steady vehicle dynamics simulation, race strategy modeling, and applied machine learning.",
    36, y, "F1", 8.8, 0.2, 0.2, 0.22
  );
  y -= 12;
  pageStream += drawText(
    "Committed to zero-fabrication engineering rigor, mathematical verification, strict architectural decoupling, and clean systems design.",
    36, y, "F1", 8.8, 0.2, 0.2, 0.22
  );
  y -= 22;

  // 2. EDUCATION
  addSection("EDUCATION");
  pageStream += drawText("VIT-AP UNIVERSITY", 36, y, "F2", 9.5, 0.1, 0.1, 0.15);
  pageStream += drawText("2021 - Present", 480, y, "F2", 9, 0.3, 0.3, 0.35);
  y -= 12;
  pageStream += drawText("Integrated M.Tech in Computer Science and Engineering", 36, y, "F1", 9, 0.25, 0.25, 0.28);
  y -= 12;
  pageStream += drawText(
    "Core Coursework: Distributed Systems, High-Performance Computing, Machine Learning, Numerical Methods, Software Architecture.",
    36, y, "F1", 8, 0.4, 0.4, 0.45
  );
  y -= 22;

  // 3. PROFESSIONAL EXPERIENCE
  addSection("ENGINEERING EXPERIENCE");

  // Role 1
  pageStream += drawText("Independent Motorsport / eSports", 36, y, "F2", 9.5, 0.1, 0.1, 0.15);
  pageStream += drawText("2025 - Present", 480, y, "F2", 9, 0.3, 0.3, 0.35);
  y -= 12;
  pageStream += drawText("Race & Strategy Engineer", 36, y, "F3", 9, 0.2, 0.4, 0.7);
  y -= 12;
  pageStream += drawText(
    "* Architected game-agnostic UDP telemetry acquisition pipeline ingesting high-frequency F1 vehicle motion and physics packets.",
    42, y, "F1", 8.2, 0.2, 0.2, 0.25
  );
  y -= 11;
  pageStream += drawText(
    "* Formulated dynamic stint degradation models & regression curves estimating thermal wear cliff and optimal pit-stop windows.",
    42, y, "F1", 8.2, 0.2, 0.2, 0.25
  );
  y -= 11;
  pageStream += drawText(
    "* Built AI Race Engineer reasoning engine providing automated fuel, tire delta, and safety car tactical advisories.",
    42, y, "F1", 8.2, 0.2, 0.2, 0.25
  );
  y -= 16;

  // Role 2
  pageStream += drawText("IGNICT", 36, y, "F2", 9.5, 0.1, 0.1, 0.15);
  pageStream += drawText("2026 - Present", 480, y, "F2", 9, 0.3, 0.3, 0.35);
  y -= 12;
  pageStream += drawText("AI / Machine Learning Intern", 36, y, "F3", 9, 0.2, 0.4, 0.7);
  y -= 12;
  pageStream += drawText(
    "* Engineered end-to-end Python data preprocessing pipelines, feature engineering, and model evaluation routines.",
    42, y, "F1", 8.2, 0.2, 0.2, 0.25
  );
  y -= 11;
  pageStream += drawText(
    "* Researched unsupervised player representation vectors and dimensionality reduction architectures using PCA and t-SNE.",
    42, y, "F1", 8.2, 0.2, 0.2, 0.25
  );
  y -= 11;
  pageStream += drawText(
    "* Developed offline-first speech-to-text inference integration (Vosk) and time-series demand forecasting models (XGBoost).",
    42, y, "F1", 8.2, 0.2, 0.2, 0.25
  );
  y -= 22;

  // 4. CANONICAL SYSTEMS & PROJECTS
  addSection("CANONICAL ENGINEERING SYSTEMS");

  // Project 1
  pageStream += drawText("Live F1 Intelligence  |  High-Throughput Distributed Telemetry Pipeline", 36, y, "F2", 9, 0.1, 0.1, 0.15);
  pageStream += drawText("Python, FastAPI, TimescaleDB, WebSockets, Docker", 340, y, "F1", 7.5, 0.4, 0.4, 0.45);
  y -= 11;
  pageStream += drawText(
    "* Ingests 4 live feeds (OpenF1, FastF1, Jolpica, SignalR), validates schemas, and normalises events into a single canonical model.",
    42, y, "F1", 8, 0.2, 0.2, 0.25
  );
  y -= 10;
  pageStream += drawText(
    "* Benchmark Evidence: 1,067,193 canonical events processed, 0 malformed records, ~2,650 events/s, ~0.10 ms p50, 99 MB peak memory.",
    42, y, "F1", 8, 0.05, 0.45, 0.3
  );
  y -= 14;

  // Project 2
  pageStream += drawText("F1 Lap-Time Simulator & Lap Prediction  |  Numerical Vehicle Dynamics", 36, y, "F2", 9, 0.1, 0.1, 0.15);
  pageStream += drawText("Python, NumPy, SciPy, Matplotlib", 400, y, "F1", 7.5, 0.4, 0.4, 0.45);
  y -= 11;
  pageStream += drawText(
    "* Formulated quasi-steady-state numerical lap solver utilizing G-G friction circles, aero downforce mapping, and grip envelopes.",
    42, y, "F1", 8, 0.2, 0.2, 0.25
  );
  y -= 10;
  pageStream += drawText(
    "* Computes forward acceleration and backward braking numerical integration passes to solve theoretical minimum lap times.",
    42, y, "F1", 8, 0.2, 0.2, 0.25
  );
  y -= 14;

  // Project 3
  pageStream += drawText("RaceMind-AI  |  Real-Time Race Strategy & UDP Telemetry Bridge", 36, y, "F2", 9, 0.1, 0.1, 0.15);
  pageStream += drawText("Python, UDP Sockets, Streamlit, Scikit-learn", 360, y, "F1", 7.5, 0.4, 0.4, 0.45);
  y -= 11;
  pageStream += drawText(
    "* Game-agnostic telemetry abstraction layer decoding multi-generation F1 UDP packets (velocities, sector deltas, tire temperatures).",
    42, y, "F1", 8, 0.2, 0.2, 0.25
  );
  y -= 10;
  pageStream += drawText(
    "* Implemented rolling stint wear regression and live AI Race Engineer contextual query terminal for undercut/overcut decisions.",
    42, y, "F1", 8, 0.2, 0.2, 0.25
  );
  y -= 14;

  // Project 4
  pageStream += drawText("F1 Race Manager  |  F1 Team Management Simulation Game Engine", 36, y, "F2", 9, 0.1, 0.1, 0.15);
  pageStream += drawText("TypeScript, React, Next.js, State Machine Architecture", 325, y, "F1", 7.5, 0.4, 0.4, 0.45);
  y -= 11;
  pageStream += drawText(
    "* Deterministic race simulation architecture featuring lap-by-lap pace calculation, weather radar volatility, and safety car triggers.",
    42, y, "F1", 8, 0.2, 0.2, 0.25
  );
  y -= 14;

  // Project 5
  pageStream += drawText("Football Intelligence OS  |  128D Player Representation Vector Engine", 36, y, "F2", 9, 0.1, 0.1, 0.15);
  pageStream += drawText("Python, Pandas, Scikit-learn, PCA, Cosine Metric", 345, y, "F1", 7.5, 0.4, 0.4, 0.45);
  y -= 11;
  pageStream += drawText(
    "* Cleaned and normalized 16,228 FC26 players into a dense 128D latent embedding space; serves tactical similarity replacements.",
    42, y, "F1", 8, 0.2, 0.2, 0.25
  );
  y -= 14;

  // Project 6
  pageStream += drawText("VyaparPulse  |  Offline-First Voice Ledger & XGBoost Demand Forecasting", 36, y, "F2", 9, 0.1, 0.1, 0.15);
  pageStream += drawText("Python, FastAPI, Vosk STT, XGBoost, SQLite", 365, y, "F1", 7.5, 0.4, 0.4, 0.45);
  y -= 11;
  pageStream += drawText(
    "* Offline voice-to-structured ledger committing transactions in <800 ms; 7-day revenue forecasting with cold-start fallbacks.",
    42, y, "F1", 8, 0.2, 0.2, 0.25
  );
  y -= 20;

  // 5. TECHNICAL ARSENAL
  addSection("TECHNICAL ARSENAL");
  pageStream += drawText("Languages: Python 3.12, TypeScript, MATLAB, C#, SQL, HTML5 / CSS3", 36, y, "F1", 8.2, 0.2, 0.2, 0.25);
  y -= 11;
  pageStream += drawText("Systems & Backend: FastAPI, Next.js 15, React 19, WebSockets, UDP Sockets, Docker, Microservices Architecture", 36, y, "F1", 8.2, 0.2, 0.2, 0.25);
  y -= 11;
  pageStream += drawText("Data & Time-Series: TimescaleDB, PostgreSQL, SQLite, SQLAlchemy, Pandas, NumPy, FastF1, OpenF1 Ingestion", 36, y, "F1", 8.2, 0.2, 0.2, 0.25);
  y -= 11;
  pageStream += drawText("AI / Machine Learning: Scikit-learn, XGBoost, PyTorch, Vosk Offline STT, PCA, t-SNE Embeddings, Time-Series Forecasting", 36, y, "F1", 8.2, 0.2, 0.2, 0.25);
  y -= 11;
  pageStream += drawText("Motorsport Engineering: Vehicle Dynamics Modeling, Quasi-Steady Lap Solver, G-G Friction Circle, Tyre Degradation Regression", 36, y, "F1", 8.2, 0.2, 0.2, 0.25);
  y -= 11;
  pageStream += drawText("3D & Visualization: Three.js, React Three Fiber, WebGL Performance Profiling, Voxel Engine Architecture", 36, y, "F1", 8.2, 0.2, 0.2, 0.25);

  // --- PDF Structure Encoding ---
  const streamBuf = Buffer.from(pageStream, "utf-8");

  const objects = [];
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`);
  objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>\nendobj\n`);
  objects.push(`4 0 obj\n<< /Length ${streamBuf.length} >>\nstream\n${pageStream}\nendstream\nendobj\n`);
  objects.push(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);
  objects.push(`6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);
  objects.push(`7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj\n`);

  let offset = 9; // "%PDF-1.4\n"
  const xref = ["0000000000 65535 f \n"];

  const bodyParts = [];
  for (let i = 0; i < objects.length; i++) {
    xref.push(String(offset).padStart(10, "0") + " 00000 n \n");
    const objBytes = Buffer.from(objects[i], "utf-8");
    offset += objBytes.length;
    bodyParts.push(objBytes);
  }

  const xrefOffset = offset;
  const xrefStr = `xref\n0 ${objects.length + 1}\n${xref.join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const pdf = Buffer.concat([
    Buffer.from("%PDF-1.4\n", "utf-8"),
    ...bodyParts,
    Buffer.from(xrefStr, "utf-8"),
  ]);

  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const outPath = resolve(root, "public/Asish_Oliver_M_Resume.pdf");
  writeFileSync(outPath, pdf);
  console.log(`Successfully generated ${outPath} (${(pdf.length / 1024).toFixed(1)} KB)`);
}

generateResumePdf();

