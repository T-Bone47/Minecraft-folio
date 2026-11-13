# ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE 2.0
## DEFENSE TRACK 2: MOTORSPORT LAP DELTA & SPATIAL DISCRETIZATION

**Associated Project:** RaceMind AI Strategy & Telemetry Engine  
**Source Commit:** `850d3c97e4fdf4aa37112efdde2e1eb7bfbd992d`  
**Primary Source File:** `backend/strategy/pit_window.py`  
**Campus Facility:** F1 Race Engineering Garage (`garage`)

---

### 1. Challenge Context
Comparing racing laps via standard time-domain offsets $t_1(\tau) - t_2(\tau)$ is physically invalid because a car that gains time in Sector 1 enters Turn 1 earlier in real time, causing telemetry time-series to go out of phase. Motorsport data analysis requires re-parameterizing telemetry into the spatial distance domain $s \in [0, L_{\text{track}}]$.

$$\Delta T(s) = \int_{0}^{s} \left( \frac{1}{v_1(u)} - \frac{1}{v_2(u)} \right) du$$

---

### 2. Discretization Step Size Sensitivity Analysis
- **$ds = 2$m (Ultra-Fine)**: 2,651 spatial bins. Integral error $< 0.003$s, apex speed error $< 0.1$ km/h. High compute overhead.
- **$ds = 10$m (Recommended)**: 531 spatial bins. Integral error $< 0.015$s, apex speed error $< 0.5$ km/h. Ideal for real-time race engineering.
- **$ds = 50$m (Coarse)**: 106 spatial bins. Integral error $\approx 0.075$s, Turn 3 chicane apex speed clipped by $> 4.0$ km/h, triggering `INV_APEX_SPEED_ACCURACY` failure.

---

### 3. Spline Interpolation Comparison
- **Monotone PCHIP**: Shape-preserving cubic Hermite interpolation. Eliminates Runge oscillations near abrupt braking zones and guarantees monotonic elapsed time progress.
- **Natural Cubic Spline**: Smooth $C^2$ second derivative, but prone to overshoot near $-5.2$G deceleration points.
- **Piecewise Linear**: Fast $O(N)$ execution, but derivative discontinuities introduce artificial acceleration spikes.

