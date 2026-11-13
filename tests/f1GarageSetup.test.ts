import test from "node:test";
import assert from "node:assert/strict";
import { GARAGE_CIRCUITS, DEFAULT_SETUP_PARAMETERS, SETUP_PRESETS } from "../lib/garage/circuits";
import { simulateVehicleSetup, solveTopSpeed } from "../lib/garage/vehicleSetupEngine";

test("F1 Garage: solveTopSpeed obeys aerodynamic drag laws", () => {
  const speedLowDrag = solveTopSpeed(0.68, 750000); // Low drag (Monza)
  const speedHighDrag = solveTopSpeed(1.22, 750000); // High drag (Monaco)

  assert.ok(speedLowDrag > speedHighDrag, "Lower drag must result in higher terminal velocity");
  assert.ok(speedLowDrag * 3.6 > 340, "Low drag top speed should exceed 340 km/h");
  assert.ok(speedHighDrag * 3.6 < 320, "High drag top speed should be below 320 km/h");
});

test("F1 Garage: Monza trim produces higher top speed and lower drag than Monaco trim", () => {
  const monzaCircuit = GARAGE_CIRCUITS.find(c => c.id === "monza")!;
  const monzaPreset = SETUP_PRESETS.find(p => p.id === "monza_skinny_wing")!;
  const monacoPreset = SETUP_PRESETS.find(p => p.id === "monaco_max_downforce")!;

  const simMonza = simulateVehicleSetup(monzaPreset.setup, monzaCircuit);
  const simMonaco = simulateVehicleSetup(monacoPreset.setup, monzaCircuit);

  assert.ok(simMonza.dragCoefficientCd < simMonaco.dragCoefficientCd, "Monza trim Cd must be lower");
  assert.ok(simMonza.topSpeedKmh > simMonaco.topSpeedKmh, "Monza trim top speed must be faster");
  assert.ok(simMonaco.liftCoefficientCl > simMonza.liftCoefficientCl, "Monaco trim downforce Cl must be higher");
  assert.ok(simMonaco.totalDownforceAt250N > simMonza.totalDownforceAt250N, "Monaco must produce more downforce at 250 km/h");
});

test("F1 Garage: Low front ride height triggers severe porpoising risk", () => {
  const circuit = GARAGE_CIRCUITS[0];
  const lowRideSetup = {
    ...DEFAULT_SETUP_PARAMETERS,
    frontRideHeightMm: 20, // dangerously low underfloor
    frontSpringRateNmm: 120, // soft front springs
  };

  const result = simulateVehicleSetup(lowRideSetup, circuit);
  assert.strictEqual(result.porpoisingRisk, "severe", "Front ride height <= 20mm with soft springs must trigger severe porpoising");
});

test("F1 Garage: Aero balance responds correctly to wing angle adjustments", () => {
  const circuit = GARAGE_CIRCUITS[0]; // Optimal balance is 42.5%

  // Steep front wing (45°), flat rear wing (15°) -> excessive front downforce -> Oversteer
  const oversteerSetup = {
    ...DEFAULT_SETUP_PARAMETERS,
    frontWingAngleDeg: 45,
    rearWingAngleDeg: 15,
  };
  const simOversteer = simulateVehicleSetup(oversteerSetup, circuit);
  assert.ok(simOversteer.aeroBalancePct > 44.0, "Front aero balance must shift forward");
  assert.strictEqual(simOversteer.handlingCharacteristic, "oversteer");

  // Flat front wing (10°), steep rear wing (55°) -> excessive rear downforce -> Understeer
  const understeerSetup = {
    ...DEFAULT_SETUP_PARAMETERS,
    frontWingAngleDeg: 10,
    rearWingAngleDeg: 55,
  };
  const simUndersteer = simulateVehicleSetup(understeerSetup, circuit);
  assert.ok(simUndersteer.aeroBalancePct < 41.5, "Front aero balance must shift rearward");
  assert.strictEqual(simUndersteer.handlingCharacteristic, "understeer");
});

test("F1 Garage: All circuit presets generate valid numerical simulations", () => {
  for (const preset of SETUP_PRESETS) {
    const circuit = GARAGE_CIRCUITS.find(c => c.id === preset.circuitId) || GARAGE_CIRCUITS[0];
    const sim = simulateVehicleSetup(preset.setup, circuit);

    assert.ok(!Number.isNaN(sim.simulatedLapTimeSec), `Lap time for ${preset.name} must not be NaN`);
    assert.ok(sim.simulatedLapTimeSec > 60 && sim.simulatedLapTimeSec < 150, "Lap time must be realistic for F1");
    assert.ok(sim.topSpeedKmh >= 280 && sim.topSpeedKmh <= 375, "Top speed must be within physical F1 envelope");
    assert.ok(sim.telemetrySpeedCurve.length === 10, "Telemetry speed curve must have 10 sample points");
  }
});
