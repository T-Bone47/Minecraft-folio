import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
export type EmailAddress = string | string[] | { name?: string; address: string };

export async function emailVoxelWorldReportHTML(args: {
  to: string | string[] | { name?: string; address: string };
  subject?: string;
  text?: string;
}) {
  // Avoid importing a real email driver until one is actually added to this repo.
  // This stub persists artifacts; it does not send mail by itself.
  void args.to;
  const destDir = process.env.REPORT_ARTIFACT_DIR ?? "/tmp";
  const htmlPath = `${destDir}/voxels-report.html`;
  const textPath = `${destDir}/voxels-report.txt`;

  // Use the HTML snippet from the report module.
  const { VOXEL_WORLD_REPORT_HTML } = await import("./voxel-world-report-html");
  const source = typeof VOXEL_WORLD_REPORT_HTML === "string"
    ? VOXEL_WORLD_REPORT_HTML
    : String(VOXEL_WORLD_REPORT_HTML);

  mkdirSync(destDir, { recursive: true });
  writeFileSync(htmlPath, source, "utf8");

  const text = args.text ?? "Voxel world transformation report attached.";
  writeFileSync(textPath, text, "utf8");

  // Email delivery is intentionally left as a shell around the report artifact
  // so this module stays framework-independent until the repo decides on a real
  // email provider. For now it persists the HTML report and optional plain-text
  // note, and returns their paths for downstream use.
  return { htmlPath, textPath };
}
