import { SiliconCircuit } from "./types";

export const CANONICAL_CIRCUITS: Record<string, SiliconCircuit> = {
  "abs-interlock": {
    id: "abs-interlock",
    name: "ABS Dynamic Slip Modulation Interlock",
    subtitle: "Automotive Active Safety • Rapid Solenoid Pulse Modulation",
    domain: "SAFETY_CRITICAL",
    description:
      "Prevents physical wheel lockup during violent threshold braking. The logic monitors wheel slip ratio relative to vehicle ground speed and triggers rapid hydraulic dump valves (20Hz) only when slip and vehicle velocity exceed critical kinematic thresholds.",
    inputs: [
      {
        id: "wheelSlip",
        name: "Wheel Slip Threshold Exceeded",
        label: "SLIP (> 0.15)",
        description: "True when wheel angular velocity lags ground speed by > 15% (traction limit).",
        defaultValue: true,
      },
      {
        id: "brakeDepressed",
        name: "Brake Hydraulic Pressure Active",
        label: "BRAKE (> 5 bar)",
        description: "True when driver is applying mechanical force to the brake pedal.",
        defaultValue: true,
      },
      {
        id: "vehicleSpeed",
        name: "Vehicle Ground Velocity Permissive",
        label: "SPEED (> 5 km/h)",
        description: "Inhibits ABS activation below 5 km/h to allow complete parking stop.",
        defaultValue: true,
      },
    ],
    outputs: [
      {
        id: "absPumpActive",
        name: "ABS Solenoid Pump Modulation",
        label: "PUMP PWM",
        description: "Enables 20Hz pulse-width-modulated hydraulic pressure relief.",
        defaultValue: true,
      },
      {
        id: "cockpitAlertLamp",
        name: "Cockpit ABS Active Indicator",
        label: "ABS LAMP",
        description: "Illuminates amber dashboard status LED to notify driver.",
        defaultValue: true,
      },
    ],
    evaluate: (inputs) => {
      const { wheelSlip = false, brakeDepressed = false, vehicleSpeed = false } = inputs;
      const condition = wheelSlip && brakeDepressed && vehicleSpeed;
      return {
        outputs: {
          absPumpActive: condition,
          cockpitAlertLamp: condition,
        },
        internalSignals: {
          slipBrakeAnd: wheelSlip && brakeDepressed,
          speedPermissive: vehicleSpeed,
          pulseModulator: condition,
        },
      };
    },
    truthTable: [
      { inputs: { wheelSlip: false, brakeDepressed: false, vehicleSpeed: false }, outputs: { absPumpActive: false, cockpitAlertLamp: false }, conditionLabel: "Coasting (Idle)" },
      { inputs: { wheelSlip: false, brakeDepressed: true, vehicleSpeed: true }, outputs: { absPumpActive: false, cockpitAlertLamp: false }, conditionLabel: "Linear Threshold Braking (Grip Intact)" },
      { inputs: { wheelSlip: true, brakeDepressed: false, vehicleSpeed: true }, outputs: { absPumpActive: false, cockpitAlertLamp: false }, conditionLabel: "Wheel Spin on Throttle (ABS Inhibited)" },
      { inputs: { wheelSlip: true, brakeDepressed: true, vehicleSpeed: false }, outputs: { absPumpActive: false, cockpitAlertLamp: false }, conditionLabel: "Low Speed Parking Stop (ABS Inhibited)" },
      { inputs: { wheelSlip: true, brakeDepressed: true, vehicleSpeed: true }, outputs: { absPumpActive: true, cockpitAlertLamp: true }, conditionLabel: "WHEEL LOCKUP IMMINENT — ABS MODULATING" },
    ],
    redstoneComponents: [
      { id: "lever-slip", name: "Wheel Slip Lever", type: "lever", label: "SLIP DETECTOR", redstoneEquivalent: "Observer + Daylight Sensor (Threshold)", siliconGate: "INPUT", signalStrength: 15, isPowered: true, role: "Sensor Input" },
      { id: "lever-brake", name: "Brake Lever", type: "lever", label: "PEDAL SWITCH", redstoneEquivalent: "Tripwire Hook / Pressure Plate", siliconGate: "INPUT", signalStrength: 15, isPowered: true, role: "Driver Control" },
      { id: "lever-speed", name: "Speed Permissive", type: "lever", label: "SPEED INTERLOCK", redstoneEquivalent: "Redstone Comparator in Compare Mode", siliconGate: "INPUT", signalStrength: 15, isPowered: true, role: "Safety Invariant" },
      { id: "gate-and-1", name: "3-Input Redstone AND", type: "torch", label: "LOGIC AND GATE", redstoneEquivalent: "Dual Redstone Torches on Inverted Wire", siliconGate: "AND", signalStrength: 15, isPowered: true, role: "Permissive Solver" },
      { id: "clock-mod", name: "20Hz Redstone Clock", type: "repeater", label: "PWM OSCILLATOR", redstoneEquivalent: "2-Tick Repeater Pulse Clock (20Hz)", siliconGate: "LATCH", signalStrength: 15, isPowered: true, role: "Hydraulic Pulsing" },
      { id: "lamp-abs", name: "Solenoid Lamp", type: "lamp", label: "SOLENOID RELIEF", redstoneEquivalent: "Redstone Lamp (PWM Driven)", siliconGate: "OUTPUT", signalStrength: 15, isPowered: true, role: "Actuator Output" },
    ],
    booleanFormula: "Y_{\\text{ABS}} = (\\text{Slip} \\land \\text{Brake} \\land \\text{Speed}) \\cdot \\text{Clk}_{20\\text{Hz}}",
    ecuFirmwareCpp: `// AutoSAR / ECU Microcontroller C++ ABS Fast-Loop (1 kHz)
inline void evaluate_abs_actuation(const WheelSpeed& ws, const BrakeSensor& bs, ActuatorState& act) {
    const bool slip_exceeded  = (ws.slip_ratio > 0.15f);
    const bool brake_applied  = (bs.line_pressure_bar > 5.0f);
    const bool speed_adequate = (ws.vehicle_velocity_kmh > 5.0f);

    // Silicon Bitwise Evaluation: (A & B & C)
    const uint8_t abs_permissive = (slip_exceeded & brake_applied & speed_adequate);

    if (abs_permissive) {
        act.solenoid_duty_cycle = 0.50f; // 20Hz 50% modulation
        act.dashboard_lamp      = true;
    } else {
        act.solenoid_duty_cycle = 0.00f; // Closed (Direct hydraulic line)
        act.dashboard_lamp      = false;
    }
}`,
    physicalEquation: "\\sigma = \\frac{R\\,\\omega - v_x}{\\max(v_x, \\epsilon)}, \\quad F_x(\\sigma) = \\mu(\\sigma) \\cdot F_z",
    latencyBudgetMicroseconds: 50,
  },

  "f1-drs-gate": {
    id: "f1-drs-gate",
    name: "Formula 1 DRS Hydraulic Permissive Gate",
    subtitle: "FIA Technical Regulations Art 3.10 • Aerodynamic Flap Actuation",
    domain: "MOTORSPORT",
    description:
      "Regulates the Drag Reduction System (DRS) rear wing hydraulic actuator. The flap reduces aerodynamic drag by ~20% on straights, but can ONLY be opened if the optical gap sensor measures < 1.0s to the preceding car, the car is inside an authorized detection zone, and race control has not flagged wet track conditions.",
    inputs: [
      {
        id: "gapSensor",
        name: "Detection Point Time Gap < 1.000s",
        label: "GAP (< 1.0s)",
        description: "True when timing transponder measures gap to car ahead < 1.000s at detection point.",
        defaultValue: true,
      },
      {
        id: "drsZoneActive",
        name: "In Designated DRS Zone",
        label: "DRS ZONE",
        description: "Optical trackside beacon confirms car is past activation line and before braking zone.",
        defaultValue: true,
      },
      {
        id: "driverButton",
        name: "Steering Wheel DRS Paddle",
        label: "DRS PADDLE",
        description: "Driver thumb button on steering wheel requesting wing flap actuation.",
        defaultValue: true,
      },
      {
        id: "wetTrackFlag",
        name: "Wet Track / Safety Car Invalidation",
        label: "WET / SC FLAG",
        description: "True when track is wet or Safety Car / Virtual Safety Car is deployed by Race Control.",
        defaultValue: false,
      },
    ],
    outputs: [
      {
        id: "drsActuatorActive",
        name: "Rear Wing Hydraulic Flap Open",
        label: "FLAP OPEN",
        description: "Energizes hydraulic actuator to rotate upper wing element 85mm open.",
        defaultValue: true,
      },
      {
        id: "audioChime",
        name: "Cockpit Audible Beep",
        label: "BEEP TONE",
        description: "Beep sent to driver earpiece signalling DRS is active.",
        defaultValue: true,
      },
    ],
    evaluate: (inputs) => {
      const {
        gapSensor = false,
        drsZoneActive = false,
        driverButton = false,
        wetTrackFlag = false,
      } = inputs;
      const permissive = gapSensor && drsZoneActive && !wetTrackFlag;
      const actuator = permissive && driverButton;
      return {
        outputs: {
          drsActuatorActive: actuator,
          audioChime: permissive,
        },
        internalSignals: {
          detectionAndZone: gapSensor && drsZoneActive,
          dryTrackPermissive: !wetTrackFlag,
          hydraulicSolenoid: actuator,
        },
      };
    },
    truthTable: [
      { inputs: { gapSensor: false, drsZoneActive: true, driverButton: true, wetTrackFlag: false }, outputs: { drsActuatorActive: false, audioChime: false }, conditionLabel: "Gap > 1.0s (DRS Disallowed)" },
      { inputs: { gapSensor: true, drsZoneActive: false, driverButton: true, wetTrackFlag: false }, outputs: { drsActuatorActive: false, audioChime: false }, conditionLabel: "Outside DRS Straight (In Corner)" },
      { inputs: { gapSensor: true, drsZoneActive: true, driverButton: false, wetTrackFlag: false }, outputs: { drsActuatorActive: false, audioChime: true }, conditionLabel: "Permissive Beep (Driver Has Not Pressed Button)" },
      { inputs: { gapSensor: true, drsZoneActive: true, driverButton: true, wetTrackFlag: true }, outputs: { drsActuatorActive: false, audioChime: false }, conditionLabel: "Wet Track Invalidation (Safety Override)" },
      { inputs: { gapSensor: true, drsZoneActive: true, driverButton: true, wetTrackFlag: false }, outputs: { drsActuatorActive: true, audioChime: true }, conditionLabel: "DRS DEPLOYED — WING FLAP ROTATED 85mm" },
    ],
    redstoneComponents: [
      { id: "lever-gap", name: "Gap Transponder", type: "lever", label: "GAP < 1.0s", redstoneEquivalent: "Calibrated Redstone Comparator (Signal >= 14)", siliconGate: "INPUT", signalStrength: 15, isPowered: true, role: "Transponder Input" },
      { id: "lever-zone", name: "Trackside Beacon", type: "lever", label: "ZONE BEACON", redstoneEquivalent: "Redstone Repeater Track Gate", siliconGate: "INPUT", signalStrength: 15, isPowered: true, role: "Track Geometry" },
      { id: "lever-btn", name: "Driver Paddle", type: "lever", label: "STEERING BTN", redstoneEquivalent: "Stone Button Pulse Latch", siliconGate: "INPUT", signalStrength: 15, isPowered: true, role: "Driver Intent" },
      { id: "lever-wet", name: "Wet Track Flag", type: "lever", label: "WET / SC OVERRIDE", redstoneEquivalent: "Redstone Torch Inverter (Active Low)", siliconGate: "NOT", signalStrength: 0, isPowered: false, role: "Safety Invalidation" },
      { id: "gate-and-3", name: "FIA Permissive AND", type: "torch", label: "TRIPLE AND GATE", redstoneEquivalent: "3-Wire Redstone Torch Array", siliconGate: "AND", signalStrength: 15, isPowered: true, role: "Permissive Core" },
      { id: "lamp-drs", name: "Wing Hydraulic Solenoid", type: "lamp", label: "FLAP HYDRAULIC", redstoneEquivalent: "Piston Extender (85mm Wing Opening)", siliconGate: "OUTPUT", signalStrength: 15, isPowered: true, role: "Mechanical Actuator" },
    ],
    booleanFormula: "Y_{\\text{DRS}} = (\\text{Gap} \\land \\text{Zone} \\land \\neg \\text{Wet}) \\land \\text{Button}",
    ecuFirmwareCpp: `// Formula 1 SECU (Standard Electronic Control Unit) DRS Gate
bool f1_evaluate_drs_permissive(const TelemetryFrame& frame, const DriverControls& ctrl) {
    const bool gap_valid   = (frame.detection_gap_ms <= 1000);
    const bool in_drs_zone = (frame.track_sector_flags & DRS_ZONE_MASK);
    const bool wet_override= (frame.race_control_flags & (FLAG_WET | FLAG_SAFETY_CAR));

    // Silicon Hardware Safety Interlock
    const bool fia_permissive = gap_valid && in_drs_zone && !wet_override;

    if (!fia_permissive) {
        secu_lock_drs_hydraulic();
        return false;
    }

    // Actuate hydraulic valve on steering button depress
    if (ctrl.drs_paddle_pressed) {
        secu_energize_drs_solenoid(85 /* mm opening */);
        return true;
    }
    return false;
}`,
    physicalEquation: "F_{\\text{drag}} = \\frac{1}{2} \\rho \\, C_d(\\text{DRS}) \\, A \\, v^2, \\quad C_d(\\text{open}) \\approx 0.80 \\cdot C_d(\\text{closed})",
    latencyBudgetMicroseconds: 25,
  },

  "ring-buffer-eviction": {
    id: "ring-buffer-eviction",
    name: "Telemetry Ring-Buffer Invariant Eviction Gate",
    subtitle: "High-Throughput Telemetry • Bounded GC Memory • Invariant Preservation",
    domain: "TELEMETRY",
    description:
      "Solves the high-consequence dilemma in real-time UDP telemetry streaming (10,000 events/sec): When memory ceiling is reached, stale frames must be discarded, but ANY frame containing an invariant failure or safety alarm must be locked into non-volatile storage.",
    inputs: [
      {
        id: "bufferFull",
        name: "Buffer Capacity Limit Reached",
        label: "BUF FULL (N >= B_max)",
        description: "True when allocated circular buffer reaches maximum capacity ceiling.",
        defaultValue: true,
      },
      {
        id: "invariantViolation",
        name: "Integrity Violation Flag Detected",
        label: "VIOLATION FLAG",
        description: "True when frame fails checksum, monotonic time, or range bounds.",
        defaultValue: false,
      },
      {
        id: "frameArrival",
        name: "New UDP Frame Arrived",
        label: "FRAME RX",
        description: "Hardware network interrupt pulse indicating wire packet receipt.",
        defaultValue: true,
      },
    ],
    outputs: [
      {
        id: "evictOldest",
        name: "Evict Oldest Normal Frame",
        label: "EVICT TAIL",
        description: "Advances head pointer, discarding stale non-critical frame.",
        defaultValue: true,
      },
      {
        id: "emergencyFreeze",
        name: "Lock Frame to Non-Volatile Flash",
        label: "LOCK & ALERT",
        description: "Freezes circular buffer and streams alert to Defense Arena.",
        defaultValue: false,
      },
    ],
    evaluate: (inputs) => {
      const { bufferFull = false, invariantViolation = false, frameArrival = false } = inputs;
      const evict = bufferFull && frameArrival && !invariantViolation;
      const freeze = frameArrival && invariantViolation;
      return {
        outputs: {
          evictOldest: evict,
          emergencyFreeze: freeze,
        },
        internalSignals: {
          bufferWritePermitted: frameArrival,
          safeEvictionLine: !invariantViolation,
          alarmTripWire: freeze,
        },
      };
    },
    truthTable: [
      { inputs: { bufferFull: false, invariantViolation: false, frameArrival: true }, outputs: { evictOldest: false, emergencyFreeze: false }, conditionLabel: "Normal Ingestion (Capacity Available)" },
      { inputs: { bufferFull: true, invariantViolation: false, frameArrival: true }, outputs: { evictOldest: true, emergencyFreeze: false }, conditionLabel: "Steady Ring Buffer Eviction (Constant Memory)" },
      { inputs: { bufferFull: false, invariantViolation: true, frameArrival: true }, outputs: { evictOldest: false, emergencyFreeze: true }, conditionLabel: "INTEGRITY ANOMALY DETECTED — BUFFER LOCKED" },
      { inputs: { bufferFull: true, invariantViolation: true, frameArrival: true }, outputs: { evictOldest: false, emergencyFreeze: true }, conditionLabel: "FULL BUFFER ANOMALY — EVICTION HALTED & LOGGED" },
    ],
    redstoneComponents: [
      { id: "lever-full", name: "Buffer Capacity Lever", type: "lever", label: "CAPACITY FULL", redstoneEquivalent: "Chest Comparator Fullness Sensor (Level 15)", siliconGate: "INPUT", signalStrength: 15, isPowered: true, role: "Memory Monitor" },
      { id: "lever-err", name: "Violation Tripwire", type: "lever", label: "ALARM BIT", redstoneEquivalent: "Redstone Torch Inverter Alarm", siliconGate: "INPUT", signalStrength: 0, isPowered: false, role: "Integrity Monitor" },
      { id: "lever-rx", name: "Frame Clock", type: "lever", label: "RX PULSE", redstoneEquivalent: "Observer Network Wire Pulse", siliconGate: "INPUT", signalStrength: 15, isPowered: true, role: "Clock Trigger" },
      { id: "gate-nor", name: "Priority Lockout NOR", type: "torch", label: "PRIORITY LATCH", redstoneEquivalent: "RS-NOR Latch with Override", siliconGate: "NOR", signalStrength: 15, isPowered: true, role: "Eviction Gate" },
      { id: "lamp-evict", name: "Evict Tail Lamp", type: "lamp", label: "TAIL DROP", redstoneEquivalent: "Dispenser Eviction Dropper", siliconGate: "OUTPUT", signalStrength: 15, isPowered: true, role: "Pointer Advance" },
      { id: "lamp-flash", name: "Flash Lock Lamp", type: "lamp", label: "NV-FLASH LOCK", redstoneEquivalent: "Redstone Lamp + Noteblock Siren", siliconGate: "OUTPUT", signalStrength: 0, isPowered: false, role: "Incident Lock" },
    ],
    booleanFormula: "\\text{Evict} = B_{\\text{full}} \\land T_{\\text{rx}} \\land \\neg V, \\quad \\text{Lock} = T_{\\text{rx}} \\land V",
    ecuFirmwareCpp: `// High-Frequency Ring Buffer Ingestion Kernel (RingBuffer.cpp)
bool RingBuffer::ingest_frame(const TelemetryWirePacket& packet) {
    const bool is_full       = (count_ >= CAPACITY);
    const bool has_violation = (packet.flags & FLAG_INVARIANT_VIOLATION);

    // Silicon Invariant: Never evict when an audit anomaly is detected
    if (has_violation) {
        lock_to_non_volatile_storage(packet);
        trigger_defense_incident(packet);
        return false; // Halted eviction
    }

    if (is_full) {
        // Discard oldest normal frame; advance read pointer
        tail_ = (tail_ + 1) % CAPACITY;
        count_--;
    }

    buffer_[head_] = packet;
    head_ = (head_ + 1) % CAPACITY;
    count_++;
    return true;
}`,
    physicalEquation: "\\lim_{t \\to \\infty} \\text{HeapAllocated}(t) \\le B_{\\max} \\cdot \\text{sizeof}(\\text{TelemetryFrame}) = \\mathcal{O}(1)",
    latencyBudgetMicroseconds: 15,
  },

  "voxel-4bit-alu": {
    id: "voxel-4bit-alu",
    name: "4-Bit Voxel Arithmetic Logic Unit (ALU)",
    subtitle: "Computer Architecture • Delta Calculations & Bitwise Masking",
    domain: "COMP_ARCH",
    description:
      "A complete 4-bit Arithmetic Logic Unit engineered with voxel redstone full-adders and logic gates. Powers spatial delta time calculations (SUB), cumulative distance integration (ADD), telemetry channel masking (AND), and speed threshold clamps (CMP).",
    inputs: [
      { id: "a3", name: "Operand A Bit 3 (MSB)", label: "A[3]", description: "Value 8 bit", defaultValue: true },
      { id: "a2", name: "Operand A Bit 2", label: "A[2]", description: "Value 4 bit", defaultValue: false },
      { id: "a1", name: "Operand A Bit 1", label: "A[1]", description: "Value 2 bit", defaultValue: true },
      { id: "a0", name: "Operand A Bit 0 (LSB)", label: "A[0]", description: "Value 1 bit", defaultValue: false },
      { id: "b3", name: "Operand B Bit 3 (MSB)", label: "B[3]", description: "Value 8 bit", defaultValue: false },
      { id: "b2", name: "Operand B Bit 2", label: "B[2]", description: "Value 4 bit", defaultValue: false },
      { id: "b1", name: "Operand B Bit 1", label: "B[1]", description: "Value 2 bit", defaultValue: true },
      { id: "b0", name: "Operand B Bit 0 (LSB)", label: "B[0]", description: "Value 1 bit", defaultValue: true },
      { id: "opSub", name: "Operation Selector (0=ADD, 1=SUB)", label: "SUBTRACT", description: "Inverts B and adds carry-in for 2's complement subtraction", defaultValue: false },
    ],
    outputs: [
      { id: "r3", name: "Result Bit 3 (MSB)", label: "R[3]", description: "Output bit 3", defaultValue: true },
      { id: "r2", name: "Result Bit 2", label: "R[2]", description: "Output bit 2", defaultValue: true },
      { id: "r1", name: "Result Bit 1", label: "R[1]", description: "Output bit 1", defaultValue: false },
      { id: "r0", name: "Result Bit 0 (LSB)", label: "R[0]", description: "Output bit 0", defaultValue: true },
      { id: "zeroFlag", name: "Zero Flag (Z)", label: "ZERO (Z)", description: "True when result equals 0000", defaultValue: false },
      { id: "carryFlag", name: "Carry / Borrow Flag (C)", label: "CARRY (C)", description: "Carry out from MSB", defaultValue: false },
    ],
    evaluate: (inputs) => {
      const a =
        (inputs.a3 ? 8 : 0) +
        (inputs.a2 ? 4 : 0) +
        (inputs.a1 ? 2 : 0) +
        (inputs.a0 ? 1 : 0);
      const b =
        (inputs.b3 ? 8 : 0) +
        (inputs.b2 ? 4 : 0) +
        (inputs.b1 ? 2 : 0) +
        (inputs.b0 ? 1 : 0);
      const isSub = !!inputs.opSub;

      let res = 0;
      let carry = false;
      if (isSub) {
        res = a - b;
        carry = a >= b;
        if (res < 0) res += 16;
      } else {
        res = a + b;
        carry = res > 15;
        res = res % 16;
      }

      const r3 = (res & 8) !== 0;
      const r2 = (res & 4) !== 0;
      const r1 = (res & 2) !== 0;
      const r0 = (res & 1) !== 0;
      const isZero = res === 0;

      return {
        outputs: {
          r3,
          r2,
          r1,
          r0,
          zeroFlag: isZero,
          carryFlag: carry,
        },
        internalSignals: {
          valA: a > 0,
          valB: b > 0,
          rawSum: res > 0,
        },
      };
    },
    truthTable: [
      { inputs: { a3: true, a2: false, a1: true, a0: false, b3: false, b2: false, b1: true, b0: true, opSub: false }, outputs: { r3: true, r2: true, r1: false, r0: true, zeroFlag: false, carryFlag: false }, conditionLabel: "ADD: 10 + 3 = 13 (1101_2)" },
      { inputs: { a3: true, a2: false, a1: true, a0: false, b3: false, b2: false, b1: true, b0: true, opSub: true }, outputs: { r3: false, r2: true, r1: true, r0: true, zeroFlag: false, carryFlag: true }, conditionLabel: "SUB: 10 - 3 = 7 (0111_2) [Carry=1]" },
      { inputs: { a3: false, a2: true, a1: false, a0: false, b3: false, b2: true, b1: false, b0: false, opSub: true }, outputs: { r3: false, r2: false, r1: false, r0: false, zeroFlag: true, carryFlag: true }, conditionLabel: "SUB: 4 - 4 = 0 (ZERO FLAG SET)" },
      { inputs: { a3: true, a2: true, a1: true, a0: true, b3: false, b2: false, b1: false, b0: true, opSub: false }, outputs: { r3: false, r2: false, r1: false, r0: false, zeroFlag: true, carryFlag: true }, conditionLabel: "ADD: 15 + 1 = 16 (OVERFLOW CARRY OUT)" },
    ],
    redstoneComponents: [
      { id: "fa-0", name: "Bit 0 Full Adder", type: "repeater", label: "FA[0]", redstoneEquivalent: "Dual XOR Redstone Array + AND Carry Conduit", siliconGate: "FULL_ADDER", signalStrength: 15, isPowered: true, role: "LSB Adder" },
      { id: "fa-1", name: "Bit 1 Full Adder", type: "repeater", label: "FA[1]", redstoneEquivalent: "Dual XOR Redstone Array + AND Carry Conduit", siliconGate: "FULL_ADDER", signalStrength: 15, isPowered: true, role: "Bit 1 Adder" },
      { id: "fa-2", name: "Bit 2 Full Adder", type: "repeater", label: "FA[2]", redstoneEquivalent: "Dual XOR Redstone Array + AND Carry Conduit", siliconGate: "FULL_ADDER", signalStrength: 15, isPowered: true, role: "Bit 2 Adder" },
      { id: "fa-3", name: "Bit 3 Full Adder", type: "repeater", label: "FA[3]", redstoneEquivalent: "Dual XOR Redstone Array + AND Carry Conduit", siliconGate: "FULL_ADDER", signalStrength: 15, isPowered: true, role: "MSB Adder" },
      { id: "nor-zero", name: "Zero Detector NOR", type: "torch", label: "4-INPUT NOR", redstoneEquivalent: "4-Wire Inverted Torch Bus", siliconGate: "NOR", signalStrength: 0, isPowered: false, role: "Zero Flag Detector" },
      { id: "lamp-res", name: "Result Display Lamps", type: "lamp", label: "4-BIT BUS", redstoneEquivalent: "Bank of 4 Redstone Lamps with Signs", siliconGate: "OUTPUT", signalStrength: 15, isPowered: true, role: "ALU Output" },
    ],
    booleanFormula: "S_i = A_i \\oplus B_i \\oplus C_i, \\quad C_{i+1} = (A_i \\land B_i) \\lor (C_i \\land (A_i \\oplus B_i))",
    ecuFirmwareCpp: `// Automotive Microcontroller ALU Assembly / Fast Bitwise C++
inline uint8_t alu_compute_delta(uint8_t a, uint8_t b, bool is_sub, bool& zero, bool& carry) {
    uint8_t result;
    if (is_sub) {
        carry  = (a >= b);
        result = (a - b) & 0x0F; // 4-bit mask
    } else {
        uint16_t full_sum = (uint16_t)a + (uint16_t)b;
        carry  = (full_sum > 15);
        result = full_sum & 0x0F;
    }
    zero = (result == 0);
    return result;
}`,
    physicalEquation: "\\Delta t_i = \\sum_{k=0}^{i} \\left(\\frac{\\Delta s_k}{v_{1,k}} - \\frac{\\Delta s_k}{v_{2,k}}\\right)",
    latencyBudgetMicroseconds: 5,
  },
};

export const SILICON_CIRCUITS: SiliconCircuit[] = Object.values(CANONICAL_CIRCUITS);

