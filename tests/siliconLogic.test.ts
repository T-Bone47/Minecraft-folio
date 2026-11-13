import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CANONICAL_CIRCUITS } from "../lib/silicon/circuitRegistry";

describe("Voxel Redstone-to-Silicon Logic Gate Subsystem", () => {
  it("registers all 4 canonical circuits with complete metadata", () => {
    const circuitIds = ["abs-interlock", "f1-drs-gate", "ring-buffer-eviction", "voxel-4bit-alu"];
    for (const id of circuitIds) {
      const c = CANONICAL_CIRCUITS[id];
      assert.ok(c, `Circuit ${id} must exist`);
      assert.equal(c.id, id);
      assert.ok(c.inputs.length >= 3, `Circuit ${id} must have >= 3 inputs`);
      assert.ok(c.outputs.length >= 2, `Circuit ${id} must have >= 2 outputs`);
      assert.ok(c.redstoneComponents.length >= 4, `Circuit ${id} must specify redstone equivalents`);
      assert.ok(c.truthTable.length >= 4, `Circuit ${id} must have truth table entries`);
      assert.ok(c.ecuFirmwareCpp.includes("bool") || c.ecuFirmwareCpp.includes("void"), "Must include C++ firmware");
    }
  });

  it("ABS Interlock: activates pump modulation only when slip, pressure, and speed are all true", () => {
    const abs = CANONICAL_CIRCUITS["abs-interlock"];

    // Case 1: All true -> Lockup imminent -> ABS Active
    const r1 = abs.evaluate({ wheelSlip: true, brakeDepressed: true, vehicleSpeed: true });
    assert.equal(r1.outputs.absPumpActive, true);
    assert.equal(r1.outputs.cockpitAlertLamp, true);

    // Case 2: Slip only, no brake (wheelspin) -> ABS Inactive
    const r2 = abs.evaluate({ wheelSlip: true, brakeDepressed: false, vehicleSpeed: true });
    assert.equal(r2.outputs.absPumpActive, false);

    // Case 3: Braking with low speed (parking) -> ABS Inactive
    const r3 = abs.evaluate({ wheelSlip: true, brakeDepressed: true, vehicleSpeed: false });
    assert.equal(r3.outputs.absPumpActive, false);
  });

  it("F1 DRS Gate: complies with FIA regulations and wet track safety override", () => {
    const drs = CANONICAL_CIRCUITS["f1-drs-gate"];

    // Case 1: Gap < 1.0s, in zone, button pressed, dry track -> DRS OPEN
    const r1 = drs.evaluate({
      gapSensor: true,
      drsZoneActive: true,
      driverButton: true,
      wetTrackFlag: false,
    });
    assert.equal(r1.outputs.drsActuatorActive, true);
    assert.equal(r1.outputs.audioChime, true);

    // Case 2: Wet track override -> INHIBITED despite button pressed
    const r2 = drs.evaluate({
      gapSensor: true,
      drsZoneActive: true,
      driverButton: true,
      wetTrackFlag: true,
    });
    assert.equal(r2.outputs.drsActuatorActive, false);
    assert.equal(r2.outputs.audioChime, false);

    // Case 3: Outside DRS Zone -> INHIBITED
    const r3 = drs.evaluate({
      gapSensor: true,
      drsZoneActive: false,
      driverButton: true,
      wetTrackFlag: false,
    });
    assert.equal(r3.outputs.drsActuatorActive, false);
  });

  it("Telemetry Ring-Buffer: guarantees non-volatile flash freeze on invariant violation", () => {
    const rb = CANONICAL_CIRCUITS["ring-buffer-eviction"];

    // Case 1: Normal full buffer -> Evict oldest
    const r1 = rb.evaluate({ bufferFull: true, invariantViolation: false, frameArrival: true });
    assert.equal(r1.outputs.evictOldest, true);
    assert.equal(r1.outputs.emergencyFreeze, false);

    // Case 2: Full buffer WITH invariant violation -> Halt eviction, LOCK & ALERT
    const r2 = rb.evaluate({ bufferFull: true, invariantViolation: true, frameArrival: true });
    assert.equal(r2.outputs.evictOldest, false);
    assert.equal(r2.outputs.emergencyFreeze, true);

    // Case 3: Partial buffer with invariant violation -> LOCK immediately
    const r3 = rb.evaluate({ bufferFull: false, invariantViolation: true, frameArrival: true });
    assert.equal(r3.outputs.emergencyFreeze, true);
  });

  it("4-Bit Voxel ALU: executes addition, subtraction, zero flag, and carry flags deterministically", () => {
    const alu = CANONICAL_CIRCUITS["voxel-4bit-alu"];

    // 10 + 3 = 13 (1101_2)
    const add1 = alu.evaluate({
      a3: true, a2: false, a1: true, a0: false, // 10
      b3: false, b2: false, b1: true, b0: true, // 3
      opSub: false,
    });
    assert.equal(add1.outputs.r3, true);  // 8
    assert.equal(add1.outputs.r2, true);  // 4
    assert.equal(add1.outputs.r1, false); // 0
    assert.equal(add1.outputs.r0, true);  // 1 => 13
    assert.equal(add1.outputs.zeroFlag, false);
    assert.equal(add1.outputs.carryFlag, false);

    // 10 - 3 = 7 (0111_2) [Carry/Borrow = true because 10 >= 3]
    const sub1 = alu.evaluate({
      a3: true, a2: false, a1: true, a0: false, // 10
      b3: false, b2: false, b1: true, b0: true, // 3
      opSub: true,
    });
    assert.equal(sub1.outputs.r3, false); // 0
    assert.equal(sub1.outputs.r2, true);  // 4
    assert.equal(sub1.outputs.r1, true);  // 2
    assert.equal(sub1.outputs.r0, true);  // 1 => 7
    assert.equal(sub1.outputs.carryFlag, true);

    // 4 - 4 = 0 (ZERO FLAG SET)
    const subZero = alu.evaluate({
      a3: false, a2: true, a1: false, a0: false, // 4
      b3: false, b2: true, b1: false, b0: false, // 4
      opSub: true,
    });
    assert.equal(subZero.outputs.zeroFlag, true);

    // 15 + 1 = 16 (OVERFLOW CARRY SET, result = 0000)
    const addOverflow = alu.evaluate({
      a3: true, a2: true, a1: true, a0: true, // 15
      b3: false, b2: false, b1: false, b0: true, // 1
      opSub: false,
    });
    assert.equal(addOverflow.outputs.carryFlag, true);
    assert.equal(addOverflow.outputs.zeroFlag, true);
  });

  it("all truth table definitions are consistent with their evaluator functions", () => {
    for (const circuit of Object.values(CANONICAL_CIRCUITS)) {
      for (const row of circuit.truthTable) {
        const evalResult = circuit.evaluate(row.inputs);
        for (const [outKey, expectedVal] of Object.entries(row.outputs)) {
          assert.equal(
            evalResult.outputs[outKey],
            expectedVal,
            `Circuit ${circuit.id} truth table row for ${JSON.stringify(row.inputs)} mismatch on ${outKey}`
          );
        }
      }
    }
  });
});

