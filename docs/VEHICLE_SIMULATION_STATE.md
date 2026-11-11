# VEHICLE SIMULATION STATE & KINEMATICS SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin

**Project**: ASISH — THE ENGINEERING FRONTIER  
**Repository**: `https://github.com/T-Bone47/Minecraft-folio`  
**Engineer**: Asish Oliver M  
**Document**: Vehicle Dynamics & Simulation Specification  
**Version**: 2.0.0  

---

## 1. Simulation Philosophy & Disclaimers

The Frontier-01 vehicle model is an engaging, deterministic **in-browser vehicle kinematics simulator** designed for teaching and technical demonstrations. It is **not** a sub-millimetre multi-body professional Formula 1 vehicle dynamics simulator (such as rFactor Pro, Vi-Grade, or AVL VSM). All physics equations run client-side in TypeScript with zero WebAssembly or native C++ dependencies.

---

## 2. Modelled Physical Quantities & Coordinate Frames

### 2.1 State Vector Definition
The simulation state $S_t$ at discrete timestep $t$ contains:

| State Variable | Symbol | Internal Unit | Display Unit | Description | Range |
|---|---|---|---|---|---|
| Longitudinal Position | $x$ | metres ($\text{m}$) | $\text{m}$ | World X Cartesian coordinate | $[-55, +55]$ |
| Lateral Position | $z$ | metres ($\text{m}$) | $\text{m}$ | World Z Cartesian coordinate | $[-55, +55]$ |
| Yaw Heading | $\psi$ | radians ($\text{rad}$) | degrees ($^\circ$) | Heading angle around vertical Y axis | $[0, 2\pi)$ |
| Forward Velocity | $v$ | $\text{m/s}$ | $\text{km/h}$ | Longitudinal vehicle speed | $[-5.0, +22.0]$ |
| Steering Angle | $\delta$ | $\text{rad}$ | degrees ($^\circ$) | Steered front wheel angle | $[-0.55, +0.55]$ |
| Throttle Demand | $u_{\text{th}}$ | dimensionless | fraction | Accelerator pedal input | $[0.0, 1.0]$ |
| Brake Demand | $u_{\text{br}}$ | dimensionless | fraction | Braking pedal / handbrake input | $[0.0, 1.0]$ |
| Track Progress | $s$ | $\text{rad}$ | fraction $[0, 1]$ | Cumulative angle along circular circuit | $[0.0, 2\pi]$ |
| Sector Gate | $g$ | integer | integer | Next required timing gate | $[1, 5]$ |
| Boundary Contacts | $c$ | integer | count | Curb barrier collision count | $\ge 0$ |

---

## 3. Numerical Integration & Equations of Motion

### 3.1 Fixed Timestep
The simulation updates with a fixed integration timestep:
$$\Delta t = \frac{1}{60} \approx 0.01667\text{ seconds}$$
Frame rate variations are absorbed using an explicit time accumulator:
```ts
accumulator += Math.min(delta, 0.1);
while (accumulator >= FIXED_DT) {
  accumulator -= FIXED_DT;
  state = stepDrive(state, input);
}
```

### 3.2 Speed-Sensitive Steering Attenuation
High-speed steering sensitivity is damped to simulate pneumatic trail and prevent high-speed snap oversteer:
$$\delta_{\text{target}} = \frac{\delta_{\text{input}} \cdot 0.55}{1 + |v| \cdot 0.025}$$
$$\delta_{t+1} = \delta_t + (\delta_{\text{target}} - \delta_t) \cdot \min(1, 9 \Delta t)$$

### 3.3 Longitudinal Forces & Drag
Total longitudinal acceleration combines engine tractive effort, aerodynamic drag, and rolling resistance:
$$F_{\text{drag}} = 0.015 \cdot v \cdot |v| + 0.35 \cdot \text{sgn}(v)$$
$$v_{t+1} = \text{clamp}\left(v_t + (u_{\text{th}} \cdot 8 - F_{\text{drag}}) \Delta t, -5.0, 22.0\right)$$

Braking deceleration is applied linearly with priority over throttle:
$$v_{t+1} = \text{sgn}(v) \cdot \max(0, |v| - u_{\text{br}} \cdot 18 \Delta t)$$

### 3.4 Kinematic Bicycle Yaw & Position Integration
$$\psi_{t+1} = \psi_t + \left(\frac{v_t}{2.8} \cdot \tan(\delta_t)\right) \Delta t$$
$$x_{t+1} = x_t + \sin(\psi_{t+1}) \cdot v_{t+1} \Delta t$$
$$z_{t+1} = z_t + \cos(\psi_{t+1}) \cdot v_{t+1} \Delta t$$

---

## 4. Track Boundary Clamping & Collision Damping

The circuit centerline forms a circle of radius $R = 45\text{ m}$ with half-width $w = 2.5\text{ m}$.
Safe radius bounds are defined as:
$$r_{\text{safe}} = \text{clamp}\left(\sqrt{x^2 + z^2}, R - w + 0.8, R + w - 0.8\right)$$

When the vehicle breaches track limits:
1. Coordinates are projected back to $r_{\text{safe}}$:
   $$x \leftarrow x \cdot \frac{r_{\text{safe}}}{r}, \quad z \leftarrow z \cdot \frac{r_{\text{safe}}}{r}$$
2. Speed is degraded by a curb friction factor:
   $$v \leftarrow v \cdot 0.75$$
3. The collision counter increments, invalidating qualifying lap status.

---

## 5. Checkpoint & Lap Validation State Machine

The track features 4 sequential gates at progress milestones $k \cdot \frac{\pi}{2}$ radians ($k = 1, 2, 3, 4$).
- A lap is completed **only** when gates are crossed in strict order: $1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 5$.
- Reversing travel creates negative progress increments ($\Delta s < 0$), preventing reverse direction exploits.
- Laps completed with collisions are recorded and inspectable in the debrief, but flagged as `valid: false`.
