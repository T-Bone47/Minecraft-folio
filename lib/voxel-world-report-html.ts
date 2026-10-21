export const VOXEL_WORLD_REPORT_HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Voxel World Transformation Report</title>
    <style>
      body { font-family: monospace; background: #0b0c10; color: #f4f4f5; padding: 2rem; }
      h1, h2, h3 { color: #ff8000; }
      table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
      th, td { border: 1px solid #3f3f46; padding: 0.5rem; text-align: left; vertical-align: top; }
      th { background: #18181c; }
      code { background: #111114; padding: 0.1rem 0.3rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>ASISH Engineering World — Voxel Transformation Report</h1>
    <p>
      This report accompanies the voxel world transformation for the
      <code>/world</code> route. It documents the audit, what was replaced,
      what was built, and the verification status.
    </p>

    <h2>1. Audit findings</h2>
    <table>
      <thead>
        <tr>
          <th style="width:35%">Finding</th>
          <th>Location / evidence</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Photographic garage is the dominant world background</td>
          <td>
            <code>components/profile/ProfileSpawn.tsx</code> renders
            <code>/world/spawn-mclaren-garage.jpg</code> as a full-bleed
            <code>object-cover</code> layer behind the spawn UI.
          </td>
        </tr>
        <tr>
          <td>Brand copy references the McLaren livery in the spawn UI</td>
          <td>
            <code>ProfileSpawn</code> header badge and right-column chassis panel
            use <code>MCLAREN</code> / <code>MCL38-04</code> wording.
          </td>
        </tr>
        <tr>
          <td>Textured F1 car uses a McLaren-tinted voxel palette</td>
          <td>
            <code>components/vehicles/VoxelF1Car.tsx</code> and
            <code>lib/voxelTextures.ts</code> include
            <code>mclaren_papaya</code> / <code>mclaren_cyan</code> materials.
          </td>
        </tr>
        <tr>
          <td>The actual 3D world already exists and is already voxel-oriented</td>
          <td>
            <code>app/world/page.tsx</code> → <code>EngineeringWorld</code> →
            dynamic <code>WorldCanvas</code> → <code>WorldScene</code>, with
            terrain, circuit, garage, tower, and facilities implemented in
            R3F/Three.js.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>2. Required transformation</h2>
    <p>The core issue is the photographic background and McLaren-branded copy in the spawn experience, not the 3D world itself. The 3D world was already voxel-native; the photographic artifact sat in the HTML/CSS preload layer and in the spawn branding.</p>

    <h2>3. Replacement plan</h2>
    <ul>
      <li>Remove the photographic <code>Image</code> background from
        <code>ProfileSpawn</code>.</li>
      <li>Freeze or replace McLaren-branded copy in the spawn UI with the
        engineering-park identity.</li>
      <li>Keep the existing voxel car and scenery rendering path, and optionally
        rebrand the papaya barrel if a bespoke campus livery is desired.</li>
      <li>Verify the live experience at <code>http://localhost:60811/world</code>.</li>
    </ul>

    <h2>4. Verification</h2>
    <p>Run <code>npm run typecheck</code>, <code>npm run lint</code>, and <code>npm run build</code>. Then open the live dev server and confirm no McLaren photographic background remains behind the spawn UI.</p>
  </body>
</html>
`;
