# LIVING NPC WORKFORCE — WORKSTATION INTEGRATION & LOCAL NAVIGATION
## ASISH: THE ENGINEERING FRONTIER

---

## 1. Campus Workstation Registry

Workstations (`lib/npc/workstationRegistry.ts`) define the physical positions, facing yaw angles, and interaction tolerances for tasks:

| Workstation ID | Facility | Position $[x, y, z]$ | Facing Yaw | Required Prop | Primary Role |
|---|---|---|---|---|---|
| `ws_garage_telemetry` | Garage | `[-12.0, 0.5, -13.8]` | $\pi$ (North) | Tablet | Race Engineer |
| `ws_garage_car_front_left` | Garage | `[-13.4, 0.5, -6.6]` | $-\pi/2$ (East) | Wrench | Vehicle Technician |
| `ws_garage_car_rear_right` | Garage | `[-10.6, 0.5, -9.4]` | $+\pi/2$ (West) | Scanner | Vehicle Technician |
| `ws_garage_car_front_wing` | Garage | `[-12.0, 0.5, -5.2]` | $0$ (South) | Wrench | Vehicle Technician |
| `ws_garage_data_console` | Garage | `[-8.8, 0.5, -5.5]` | $-2.35$ (NW) | Tablet | Data Engineer |
| `ws_garage_tyre_rack` | Garage | `[-16.8, 0.5, -9.5]` | $+\pi/2$ (East) | Scanner | Assistant / Data Eng |
| `ws_garage_tool_rack` | Garage | `[-7.2, 0.5, -9.5]` | $-\pi/2$ (West) | Toolcase | Garage Assistant |
| `ws_garage_briefing_point` | Garage | `[-12.0, 0.5, -3.4]` | $0$ (South) | Tablet | Race Engineer |
| `ws_garage_safety_curb` | Garage | `[-14.5, 0.5, -7.5]` | $+\pi/2$ (East) | None | Vehicle Technician |
| `ws_telemetry_stream_desk` | Telemetry | `[14.0, 0.5, -18.0]` | $\pi$ (North) | Tablet | Telemetry Analyst |
| `ws_telemetry_server_rack` | Telemetry | `[16.2, 0.5, -19.5]` | $-\pi/2$ (West) | Scanner | Systems Technician |
| `ws_aiml_eval_bench` | AI Lab | `[0.0, 0.5, 24.0]` | $\pi$ (North) | Tablet | AI Researcher |
| `ws_aiml_dataset_board` | AI Lab | `[3.5, 0.5, 23.0]` | $-\pi/2$ (West) | Tablet | Data Scientist |
| `ws_hq_operations_console` | HQ | `[-27.5, 0.5, -17.5]` | $0$ (South) | Tablet | Operations Coordinator |

---

## 2. Obstacle-Free Waypoint Navigation

To guarantee that NPCs never walk through walls or clip through the central racing car, each facility defines safe circulation waypoints:
- **Garage Navigation Loop**:
  - `wp_garage_front`: `[-12.0, 0.5, -4.0]`
  - `wp_garage_left`: `[-14.5, 0.5, -7.5]`
  - `wp_garage_rear`: `[-12.0, 0.5, -12.5]`
  - `wp_garage_right`: `[-9.5, 0.5, -7.5]`
  Paths connecting the rear desk to the front wing navigate around the car via either the left or right aisle, preserving physical plausibility.

