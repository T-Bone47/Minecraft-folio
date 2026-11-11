# LIVING NPC WORKFORCE — BEHAVIOR STATE MACHINE & TASK SCHEDULER
## ASISH: THE ENGINEERING FRONTIER

---

## 1. Priority Resolution Engine

To prevent conflicting animations (e.g. attempting to walk, type, and inspect a wheel simultaneously), `lib/npc/behaviorScheduler.ts` executes a 5-tier strict priority hierarchy:

```
+------------------------------------------------------------------+
| Priority 1: Safety & Track Clear Override                        |
| (If player enters or drives F1 car, mechanics clear work zone)   |
+--------------------------------+---------------------------------+
                                 | No safety conflict
                                 v
+------------------------------------------------------------------+
| Priority 2: Active Player Interaction                            |
| (Worker halts locomotion, turns to player, opens dialogue)       |
+--------------------------------+---------------------------------+
                                 | No active conversation
                                 v
+------------------------------------------------------------------+
| Priority 3: Event-Driven Incident Reactions                      |
| (Lap completed -> Marcus inspects telemetry; Incident -> Viktor) |
+--------------------------------+---------------------------------+
                                 | Normal operations
                                 v
+------------------------------------------------------------------+
| Priority 4: Scheduled Multi-Station Engineering Tasks            |
| (Timer progression -> Path waypoint walking -> Work execution)   |
+--------------------------------+---------------------------------+
                                 |
                                 v
+------------------------------------------------------------------+
| Priority 5: Ambient Workstation Idle Breathing                   |
+------------------------------------------------------------------+
```

---

## 2. Pacing & Task Choreography

Each engineer maintains an autonomous schedule:

### Marcus Vance (Race Performance Lead)
1. `task_marcus_telemetry_monitor`: 16s at Pit Wall Telemetry Terminal (`ws_garage_telemetry`, `TYPING`).
2. `task_marcus_pit_briefing`: 12s at Pit Lane Operations Point (`ws_garage_briefing_point`, `DISCUSSING`).
3. `task_marcus_strategy_core`: 14s at AI Strategy Console (`ws_garage_data_console`, `TYPING`).

### Elena Cruz (Lead Vehicle Technician)
1. `task_elena_front_left_wheel`: 18s at Front-Left Hub (`ws_garage_car_front_left`, `INSPECTING`).
2. `task_elena_front_wing_aero`: 14s at Front Wing (`ws_garage_car_front_wing`, `INSPECTING`).
3. `task_elena_rear_right_diffuser`: 16s at Rear-Right Wing (`ws_garage_car_rear_right`, `INSPECTING`).
4. `task_elena_air_tools`: 10s at Tool Trolley (`ws_garage_tool_rack`, `CARRYING_EQUIPMENT`).

### Leo Patel (Data Systems Engineer)
1. `task_leo_strategy_console`: 20s at Strategy Console (`ws_garage_data_console`, `TYPING`).
2. `task_leo_tyre_blanket_scan`: 14s at Tyre Heating Blankets (`ws_garage_tyre_rack`, `INSPECTING`).
3. `task_leo_telemetry_compare`: 12s at Pit Wall Monitor (`ws_garage_telemetry`, `DISCUSSING`).

### Toby Vance (Garage Operations Assistant)
1. `task_toby_carry_tools`: 16s carrying toolcase to Tyre Blankets (`ws_garage_tyre_rack`, `CARRYING_EQUIPMENT`).
2. `task_toby_inspect_nose`: 12s checking Nose Pitot Tube (`ws_garage_car_front_wing`, `INSPECTING`).
3. `task_toby_return_tools`: 14s returning to Tool Trolley (`ws_garage_tool_rack`, `CARRYING_EQUIPMENT`).

Pacing is intentionally staggered so that at any given moment, one engineer is typing, another is inspecting the car, one is reviewing data, and another is moving between stations.

