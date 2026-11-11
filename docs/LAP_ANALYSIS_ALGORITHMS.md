# LAP ANALYSIS ALGORITHMS SPECIFICATION
## ASISH: THE ENGINEERING FRONTIER — Living Engineering Digital Twin

**Project**: ASISH — THE ENGINEERING FRONTIER  
**Repository**: `https://github.com/T-Bone47/Minecraft-folio`  
**Engineer**: Asish Oliver M  
**Document**: Numerical Methods, Corner Segmentation & Spatial Delta Algorithms  
**Version**: 2.0.0  

---

## 1. Problem Formulation: The Temporal Skew Fallacy

In traditional time-based comparison of two racing laps:
$$\Delta t_{\text{naive}}(i) = t_1(i) - t_2(i)$$
This formulation introduces severe progressive temporal distortion: a car that is faster in Sector 1 will reach Turn 2 earlier in absolute time. If one compares the two cars at timestamp $t = 30.0\text{ s}$, Car 1 is already accelerating down the back straight while Car 2 is still braking for the chicane!

### The Solution: Distance-Aligned Discretization
To compare true driver performance and locate exact apex deficits, the two runs must be aligned by **spatial track progress** $s \in [0, 1]$:
$$s = \frac{\theta}{2\pi}, \quad \text{where } \theta \text{ is the angular position along the circular track.}$$

---

## 2. Mathematical Formulation of the Spatial Delta Solver

### 2.1 Track Spatial Discretization
We partition the circuit perimeter ($L \approx 282.74\text{ m}$) into $N = 100$ equidistant spatial points:
$$s_k = \frac{k}{N}, \quad d_k = s_k \cdot L \quad (k = 0, 1, \dots, N)$$

### 2.2 Piecewise Linear Binary Search Interpolation
For any progress value $s_k$, we locate the adjacent enclosing samples $(S_a, S_b)$ such that:
$$S_a.\text{lapProgress} \le s_k \le S_b.\text{lapProgress}$$
Using binary search ($O(\log M)$ where $M$ is sample count).

The interpolation factor $\alpha$ is:
$$\alpha = \frac{s_k - S_a.\text{lapProgress}}{S_b.\text{lapProgress} - S_a.\text{lapProgress}}$$

We interpolate speed $v(s_k)$ and elapsed time $t(s_k)$:
$$v(s_k) = S_a.\text{speed} + \alpha \cdot (S_b.\text{speed} - S_a.\text{speed})$$
$$t(s_k) = S_a.\text{timestamp} + \alpha \cdot (S_b.\text{timestamp} - S_a.\text{timestamp})$$

### 2.3 True Spatial Time Delta
The distance-aligned time loss curve $\Delta t(s_k)$ is:
$$\Delta t(s_k) = t_{\text{visitor}}(s_k) - t_{\text{ref}}(s_k)$$
- A positive slope $\frac{d(\Delta t)}{ds} > 0$ indicates time being lost to the reference.
- A negative slope $\frac{d(\Delta t)}{ds} < 0$ indicates time being gained.

---

## 3. Corner Segmentation (Turns 1 to 4)

On the Frontier Campus circuit ($R = 45\text{ m}$), 4 canonical corner complexes are defined:

| Corner | Name | Progress Range | Character |
|---|---|---|---|
| **Turn 1** | North-East Sweeper | $s \in [0.12, 0.28]$ | High-speed lateral grip test; sensitive to steering smoothness |
| **Turn 2** | South-East Chicane | $s \in [0.36, 0.50]$ | Medium-speed directional transition; braking stability |
| **Turn 3** | South-West Hairpin | $s \in [0.60, 0.76]$ | Heavy deceleration zone; minimum apex velocity retention |
| **Turn 4** | Final Traction Zone | $s \in [0.84, 0.98]$ | Early throttle commitment onto main pit straight |

### Metrics Computed Per Corner:
- **Approach Speed**: Velocity at entrance milestone ($s_{\text{start}}$).
- **Apex Speed**: Minimum velocity within corner boundary $\min_{s \in \text{corner}} v(s)$.
- **Exit Speed**: Velocity at exit milestone ($s_{\text{end}}$).
- **Braking Onset**: Distance coordinate where brake input first exceeds $0.20$.
- **Segment Elapsed Time**: $t(s_{\text{end}}) - t(s_{\text{start}})$.

---

## 4. Grounded Actionable Coaching Insights

Insights are deterministically derived from computed corner and sector deltas:
- **Boundary Contacts**: Flags curb collisions with speed penalty evidence.
- **Apex Deficits**: Triggers when apex speed is $> 10\text{ km/h}$ lower than reference.
- **Early/Late Braking**: Flags when braking begins $> 8\text{ m}$ earlier than reference.
- **Throttle Delay**: Flags hesitant power delivery on corner exit.
