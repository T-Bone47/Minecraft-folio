# ENGINEERING WHAT-IF DECISION ENGINE SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin

**Project**: ASISH — THE ENGINEERING FRONTIER  
**Repository**: `https://github.com/T-Bone47/Minecraft-folio`  
**Engineer**: Asish Oliver M  
**Document**: What-If Decision Engine Specification  
**Version**: 2.0.0  

---

## 1. Concept & Integrity Rule

The **Race Engineering Decision Centre** allows the visitor to act as the race engineer. After completing a lap and reviewing telemetry in the debrief, the visitor explores hypothetical setup adjustments.

### Absolute Non-Negotiable Integrity Rule:
**Original measured telemetry is NEVER modified.**
When a what-if scenario is evaluated:
1. The base measured lap is copied to a separate `hypotheticalLap` entity.
2. The `source` property is explicitly set to `"hypothetical"`.
3. The `provenanceLabel` is set to `"HYPOTHETICAL ENGINEERING SCENARIO"`.
4. All model assumptions and trade-offs are explicitly itemized in the UI.

---

## 2. Modelled Setup Levers

### 2.1 Braking Point Offset ($\Delta d_{\text{brake}}$)
- Shifting deceleration onset deeper (e.g. $-8\text{ m}$ into Turn 3 hairpin) reduces total segment elapsed time by:
  $$\Delta t_{\text{entry}} = |\Delta d_{\text{brake}}| \cdot 0.032\text{ s}$$
- **Trade-Off**: Elevated risk of front-axle micro-locking and trajectory overshoot.

### 2.2 Aerodynamic Downforce Trim
- **High Downforce**: Increases cornering speed ($+4\%$ in turns) but increases drag on straights (top speed limited by $\sim 14\text{ km/h}$). Net lap impact: $-0.27\text{ s}$.
- **Low Drag (Monza Trim)**: Increases straight-line top speed ($+12\text{ km/h}$) but reduces apex grip through Turns 1 and 3. Net lap impact: $+0.20\text{ s}$.
- **Balanced**: Factory default compromise.

### 2.3 Tire Compound Friction
- **Soft Compound (C5)**: $+14\%$ mechanical grip coefficient $\mu$. Net lap impact: $-0.65\text{ s}$.
  - **Trade-Off**: Steep thermal wear cliff after 4–6 flying laps.
- **Hard Compound (C1)**: Lower mechanical grip ($+0.72\text{ s}$ per lap).
  - **Trade-Off**: Maximum stint durability with high thermal resistance.

### 2.4 Throttle Ramp Aggressiveness
- **Aggressive**: Instant wide-open throttle application on corner exit (saves $-0.18\text{ s}$ on straight).
  - **Trade-Off**: Risk of snap oversteer / wheelspin under low lateral grip.

---

## 3. Verdict Generation Logic

The engine assigns an engineering verdict:
- **`APPROVED FOR STINT`**: Net predicted delta $< -0.25\text{ s}$ with acceptable stability margins.
- **`MARGINAL GAIN`**: Net predicted delta between $-0.25\text{ s}$ and $+0.25\text{ s}$.
- **`REJECTED (HIGH DEFICIT)`**: Net predicted delta $> +0.25\text{ s}$.
