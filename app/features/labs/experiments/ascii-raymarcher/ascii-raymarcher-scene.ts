// A signed-distance scene raymarched once per character cell, printed as text: the brightness
// of each cell picks a glyph from a ramp. What a fragment shader does per pixel, run per cell.

/** Doto advances 0.6em per glyph: at line-height 1, a cell is 0.6 wide for 1 tall. */
export const CELL_ASPECT = 0.6;

export type AsciiShape = "box" | "torus";
export type AsciiRamp = "classic" | "netoun";

export interface RampBucket {
  /** What the bucket prints (`netoun`: its letters, in turn). */
  glyph: string;
  /** Lowest luminance of the bucket. */
  from: number;
}

export const RAMPS: Record<AsciiRamp, RampBucket[]> = {
  classic: [..." .:-=+*#%@"].map((glyph, index) => ({ glyph, from: index / 10 })),
  // The thresholds scripts/generate-logo-ascii.ts bakes the fastfetch logo with.
  netoun: [
    { glyph: " ", from: 0 },
    { glyph: ".", from: 0.1 },
    { glyph: ":", from: 0.3 },
    { glyph: "netoun", from: 0.62 },
  ],
};

export function bucketOf(ramp: AsciiRamp, luminance: number): number {
  if (ramp === "classic") return Math.min(9, Math.floor(luminance * 10));
  if (luminance > 0.62) return 3;
  if (luminance > 0.3) return 2;
  return luminance > 0.1 ? 1 : 0;
}

/** A rounded box: half-size 0.6, corner radius 0.22. */
function sdBox(x: number, y: number, z: number): number {
  const qx = Math.abs(x) - 0.6;
  const qy = Math.abs(y) - 0.6;
  const qz = Math.abs(z) - 0.6;
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0));
  return outside + Math.min(Math.max(qx, qy, qz), 0) - 0.22;
}

function sdTorus(x: number, y: number, z: number): number {
  const ring = Math.hypot(x, z) - 0.82;
  return Math.hypot(ring, y) - 0.34;
}

export interface AsciiFrameInput {
  cols: number;
  rows: number;
  shape: AsciiShape;
  ramp: AsciiRamp;
  /** Angle of the key light around the scene, in degrees. */
  light: number;
  /** Seconds: the object turns with it. */
  time: number;
}

export interface AsciiFrame {
  /** One string per row, the glyphs. */
  lines: string[];
  /** One string per row, each lit cell's bucket index (the xray view). */
  buckets: string[];
  /** Cells per bucket. */
  counts: number[];
  /** Luminance per cell, row-major; -1 where the ray missed. */
  luminance: Float32Array;
}

const MAX_STEPS = 48;
const HIT = 0.0015;
const NORMAL_STEP = 0.002;
const CAMERA_Z = -3.4;

export function renderAsciiFrame({
  cols,
  rows,
  shape,
  ramp,
  light,
  time,
}: AsciiFrameInput): AsciiFrame {
  const sdf = shape === "torus" ? sdTorus : sdBox;
  const bound = shape === "torus" ? 1.24 : 1.4;
  const ax = shape === "torus" ? 1.05 + Math.sin(time * 0.5) * 0.35 : time * 0.53 + 0.4;
  const ay = time * 0.8 + 0.6;
  const [cx, sx, cy, sy] = [Math.cos(ax), Math.sin(ax), Math.cos(ay), Math.sin(ay)];
  // The scene turned by the object's rotation.
  const map = (x: number, y: number, z: number) => {
    const x1 = cy * x - sy * z;
    const z1 = sy * x + cy * z;
    return sdf(x1, cx * y + sx * z1, -sx * y + cx * z1);
  };

  // A point light orbiting at `light`: flat faces still get a gradient.
  const angle = (light * Math.PI) / 180;
  const lightX = -Math.sin(angle) * 2.6;
  const lightY = 2.1;
  const lightZ = -Math.cos(angle) * 2.6;

  const half = rows / 2;
  const buckets = RAMPS[ramp];
  const counts = buckets.map(() => 0);
  const luminance = new Float32Array(cols * rows).fill(-1);
  const lines: string[] = [];
  const indices: string[] = [];
  let letter = 0;

  for (let row = 0; row < rows; row += 1) {
    let line = "";
    let index = "";
    const v = (half - (row + 0.5)) / half;
    for (let col = 0; col < cols; col += 1) {
      const u = ((col + 0.5 - cols / 2) * CELL_ASPECT) / half;
      const length = Math.hypot(u, v, 1.9);
      const [dx, dy, dz] = [u / length, v / length, 1.9 / length];
      // March only inside the scene's bounding sphere.
      const b = CAMERA_Z * dz;
      const disc = b * b - (CAMERA_Z * CAMERA_Z - bound * bound);
      let lum = -1;
      if (disc > 0) {
        const root = Math.sqrt(disc);
        let t = Math.max(0, -b - root);
        const far = -b + root;
        for (let step = 0; step < MAX_STEPS && t <= far; step += 1) {
          const px = dx * t;
          const py = dy * t;
          const pz = CAMERA_Z + dz * t;
          const distance = map(px, py, pz);
          if (distance < HIT) {
            const e = NORMAL_STEP;
            let nx = map(px + e, py, pz) - map(px - e, py, pz);
            let ny = map(px, py + e, pz) - map(px, py - e, pz);
            let nz = map(px, py, pz + e) - map(px, py, pz - e);
            const nl = Math.hypot(nx, ny, nz) || 1;
            [nx, ny, nz] = [nx / nl, ny / nl, nz / nl];
            let [lx, ly, lz] = [lightX - px, lightY - py, lightZ - pz];
            const ld = Math.hypot(lx, ly, lz);
            [lx, ly, lz] = [lx / ld, ly / ld, lz / ld];
            const falloff = Math.max(0.55, 1.35 - 0.2 * ld);
            const ndl = nx * lx + ny * ly + nz * lz;
            const diffuse = Math.max(0, ndl);
            const [rx, ry, rz] = [2 * ndl * nx - lx, 2 * ndl * ny - ly, 2 * ndl * nz - lz];
            const specular = Math.max(0, -(rx * dx + ry * dy + rz * dz)) ** 18;
            const facing = Math.max(0, -(nx * dx + ny * dy + nz * dz));
            const rim = (1 - facing) ** 3 * 0.16;
            // Key light, a faint headlight so the faces turned away still read, a rim.
            lum = Math.min(
              1,
              0.05 + 0.66 * diffuse * falloff + 0.2 * facing + 0.5 * specular + rim,
            );
            break;
          }
          t += distance;
        }
      }
      luminance[row * cols + col] = lum;
      if (lum < 0) {
        line += " ";
        index += " ";
        continue;
      }
      const bucket = bucketOf(ramp, lum);
      counts[bucket] += 1;
      index += String(bucket);
      const glyph = buckets[bucket].glyph;
      line += glyph.length > 1 ? glyph[letter++ % glyph.length] : glyph;
    }
    lines.push(line);
    indices.push(index);
  }
  return { lines, buckets: indices, counts, luminance };
}

/** Cells that fit a box, at a font size (a cell is `CELL_ASPECT` em wide, 1em tall). */
export function gridFor(width: number, height: number, cellPx: number) {
  return {
    cols: Math.max(8, Math.floor(width / (cellPx * CELL_ASPECT))),
    rows: Math.max(4, Math.floor(height / cellPx)),
  };
}
