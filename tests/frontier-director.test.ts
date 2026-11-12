import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  experiences,
  getExperienceById,
  getAllExperiences,
} from "../lib/frontierDirector/experienceRegistry";
import {
  evidenceRecords,
  getEvidenceRecord,
} from "../lib/frontierDirector/evidenceRegistry";
import { navigationController } from "../lib/frontierDirector/navigationController";
import { facilities } from "../data/facilities";
import type { EvidenceLayerId, ExperienceId, ProvenanceLevel } from "../lib/frontierDirector/types";

const VALID_PROVENANCE: ProvenanceLevel[] = [
  "REAL_PROJECT_SOURCE",
  "BROWSER_SIMULATION",
  "RECORDED_SIMULATOR_SESSION",
  "BUNDLED_REPRODUCIBLE_FIXTURE",
  "HYPOTHETICAL_ENGINEERING_SCENARIO",
  "VERIFIED_TEST_RESULT",
  "PREVIOUSLY_REPORTED_RESULT",
];

const VALID_LAYERS: EvidenceLayerId[] = [
  "problem",
  "architecture",
  "algorithm",
  "evidence",
  "tradeoffs",
  "source",
];

test("Frontier Director: Experience Registry integrity and coverage", () => {
  const exps = getAllExperiences();
  assert.equal(exps.length, 3, "Exactly 3 canonical engineering experiences must be defined");

  const expectedIds: ExperienceId[] = ["motorsport", "ai-ml", "systems"];
  expectedIds.forEach((id) => {
    const exp = getExperienceById(id);
    assert.ok(exp, `Experience with id '${id}' must exist`);
    assert.equal(exp.id, id);
    assert.equal(exp.slug, id);
    assert.ok(exp.title.length > 5, `Title must be descriptive for ${id}`);
    assert.ok(exp.subtitle.length > 10, `Subtitle must be descriptive for ${id}`);
    assert.ok(exp.targetRoles.length >= 2, `Must define at least 2 target engineering roles for ${id}`);
    assert.ok(exp.estimatedDurationSec <= 90, `Estimated duration must be <= 90s for ${id}`);
    assert.ok(exp.recruiterTakeaway.length > 20, `Recruiter takeaway must be concise and grounded for ${id}`);

    // Verify facility link
    const fac = facilities.find((f) => f.id === exp.primaryFacilityId);
    assert.ok(fac, `Primary facility '${exp.primaryFacilityId}' must exist in facilities registry`);

    // Verify presentation steps (4 steps per experience)
    assert.equal(exp.presentationSteps.length, 4, `Must have exactly 4 presentation steps for ${id}`);
    exp.presentationSteps.forEach((step, idx) => {
      assert.equal(step.index, idx, `Step index must match array index for ${step.id}`);
      assert.ok(["hook", "simulation", "breakdown", "proof"].includes(step.phase), `Invalid phase in ${step.id}`);
      assert.ok(step.cameraShot.position.length === 3, "Camera position must be [x, y, z]");
      assert.ok(step.cameraShot.target.length === 3, "Camera target must be [x, y, z]");
      assert.ok(VALID_LAYERS.includes(step.associatedEvidenceLayer), `Invalid layer in ${step.id}`);
    });

    // Verify key metrics
    assert.ok(exp.keyMetrics.length >= 3, `Must provide at least 3 key metrics for ${id}`);
    exp.keyMetrics.forEach((metric) => {
      assert.ok(VALID_PROVENANCE.includes(metric.provenance), `Invalid provenance on metric ${metric.label}`);
      assert.ok(metric.value.length > 0, `Metric value cannot be empty`);
    });
  });
});

test("Frontier Director: Evidence Registry 6-layer completeness and strict provenance", () => {
  const recordIds = Object.keys(evidenceRecords);
  assert.equal(recordIds.length, 3, "Exactly 3 evidence records must be defined");

  recordIds.forEach((id) => {
    const record = evidenceRecords[id];
    assert.ok(record, `Record ${id} must exist`);

    VALID_LAYERS.forEach((layerKey) => {
      const layer = record.layers[layerKey];
      assert.ok(layer, `Layer '${layerKey}' must exist on record ${id}`);
      assert.ok(layer.title.length > 3, `Layer title must be set on ${id}.${layerKey}`);
      assert.ok(VALID_PROVENANCE.includes(layer.provenance), `Layer provenance must be valid on ${id}.${layerKey}`);
    });

    // Verify Layer 1 (Problem)
    assert.ok(record.layers.problem.engineeringConstraints.length >= 2, "Constraints must be specified");
    assert.ok(record.layers.problem.invariants.length >= 2, "Invariants must be specified");
    assert.ok(record.layers.problem.failureModes.length >= 2, "Failure modes must be specified");

    // Verify Layer 2 (Architecture)
    assert.ok(record.layers.architecture.asciiDiagram.length > 50, "ASCII diagram must be populated");
    assert.ok(record.layers.architecture.components.length >= 3, "At least 3 components must be defined");

    // Verify Layer 3 (Algorithm)
    assert.ok(record.layers.algorithm.mathematicalFormulas.length >= 2, "At least 2 formulas required");
    assert.ok(record.layers.algorithm.codeExcerpts.length >= 1, "At least 1 code excerpt required");

    // Verify Layer 4 (Evidence)
    assert.ok(record.layers.evidence.benchmarks.length >= 3, "At least 3 benchmarks required");
    assert.ok(record.layers.evidence.passingTests.length >= 3, "At least 3 passing unit tests required");
    assert.ok(record.layers.evidence.reproducibleTestCommand.includes("npm test"), "Must provide runnable npm test command");

    // Verify Layer 5 (Tradeoffs)
    assert.ok(record.layers.tradeoffs.chosenApproach.name.length > 0, "Chosen approach must be named");
    assert.ok(record.layers.tradeoffs.alternativesEvaluated.length >= 1, "At least 1 alternative required");

    // Verify Layer 6 (Source Files)
    assert.ok(record.layers.source.repository.includes("github.com"), "Must link to GitHub repo");
    assert.ok(record.layers.source.verifiedFiles.length >= 2, "At least 2 source files required");
  });
});

test("Frontier Director: Source files and code excerpts exist on disk with zero fabrication", () => {
  const rootDir = process.cwd();

  Object.values(evidenceRecords).forEach((record) => {
    // 1. Check all verified files in Layer 6 exist on disk
    record.layers.source.verifiedFiles.forEach((ref) => {
      const fullPath = path.join(rootDir, ref.relativePath);
      assert.ok(
        fs.existsSync(fullPath),
        `Source file '${ref.relativePath}' referenced in ${record.id} must exist on disk!`
      );
    });

    // 2. Check all code excerpts in Layer 3 point to real files
    record.layers.algorithm.codeExcerpts.forEach((excerpt) => {
      const fullPath = path.join(rootDir, excerpt.filePath);
      assert.ok(
        fs.existsSync(fullPath),
        `Code excerpt file '${excerpt.filePath}' in ${record.id} must exist on disk!`
      );

      const fileContent = fs.readFileSync(fullPath, "utf8");
      // Check that a meaningful snippet from the excerpt is in the file
      const snippet = excerpt.code.trim().split("\n")[0].trim();
      assert.ok(
        fileContent.includes(snippet),
        `Excerpt snippet "${snippet}" must be present in ${excerpt.filePath}`
      );
    });
  });
});

test("Frontier Director: Unified Navigation Controller state transitions and safety", async () => {
  // Test transition to EXPLORATION
  const ok1 = await navigationController.executeTransition({ action: "ENTER_EXPLORATION" });
  assert.equal(ok1, true);
  assert.equal(navigationController.getState().currentMode, "explore");
  assert.equal(navigationController.getState().isInspectorOpen, false);
  assert.equal(navigationController.getState().isExperienceModalOpen, false);

  // Test transition to START_SHOWCASE
  const ok2 = await navigationController.executeTransition({
    action: "START_SHOWCASE",
    experienceId: "motorsport",
    stepIndex: 1,
    recruiterMode: true,
  });
  assert.equal(ok2, true);
  assert.equal(navigationController.getState().currentMode, "showcase");
  assert.equal(navigationController.getState().activeExperienceId, "motorsport");
  assert.equal(navigationController.getState().activeStepIndex, 1);
  assert.equal(navigationController.getState().isRecruiterMode, true);

  // Test transition to SKIP_SHOWCASE (jumps to proof)
  const ok3 = await navigationController.executeTransition({
    action: "SKIP_SHOWCASE",
    evidenceLayer: "algorithm",
  });
  assert.equal(ok3, true);
  assert.equal(navigationController.getState().currentMode, "proof");
  assert.equal(navigationController.getState().isInspectorOpen, true);
  assert.equal(navigationController.getState().activeEvidenceLayer, "algorithm");

  // Test switching evidence layer
  const ok4 = await navigationController.executeTransition({
    action: "SWITCH_EVIDENCE_LAYER",
    evidenceLayer: "evidence",
  });
  assert.equal(ok4, true);
  assert.equal(navigationController.getState().activeEvidenceLayer, "evidence");

  // Test close evidence
  const ok5 = await navigationController.executeTransition({ action: "CLOSE_EVIDENCE" });
  assert.equal(ok5, true);
  assert.equal(navigationController.getState().currentMode, "explore");
  assert.equal(navigationController.getState().isInspectorOpen, false);

  // Test safe coordinates grounding and depenetration
  const safeCoords = navigationController.sanitizePlayerCoordinates(22, 16.5);
  assert.ok(Number.isFinite(safeCoords[0]), "X must be finite");
  assert.ok(Number.isFinite(safeCoords[1]), "Y must be finite");
  assert.ok(Number.isFinite(safeCoords[2]), "Z must be finite");
  assert.ok(safeCoords[1] >= 1.65, "Y must be at or above eye height (1.65)");
});

