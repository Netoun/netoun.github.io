import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { GRAIN_CONFIG } from "../app/components/misc/shaders/grain/grain.shader";

// Bakes the page grain into a tiled background, so the paper keeps its film grain without a
// full-viewport WebGL canvas (and without JS). Same noise as `grain.shader.ts`: one signed cell
// per physical pixel (half lighten, half darken), `pow(|n|·2, gamma) · strength` alpha.
//
// The tile repeats every TILE CSS pixels; the @2x file keeps one cell per device pixel on
// retina screens, like the shader's buffer did. Alpha is quantised to a few steps: at a 0.05
// ceiling 8-bit alpha only holds 13 values anyway, and fewer steps compress the tile by a third.

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "../public/images");

const TILE = 128;
const ALPHA_STEPS = 5;

const fract = (x: number) => x - Math.floor(x);

// The shader's hash12, operation for operation.
function hash12(x: number, y: number) {
  let a = fract(x * 0.1031);
  let b = fract(y * 0.1031);
  let c = fract(x * 0.1031);
  const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33);
  a += d;
  b += d;
  c += d;
  return fract((a + b) * c);
}

async function writeTile(scale: number) {
  const size = TILE * scale;
  const pixels = Buffer.alloc(size * size * 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = hash12(x, y) - 0.5;
      const weight = Math.pow(Math.abs(n) * 2, GRAIN_CONFIG.filmGrainGamma);
      const alpha =
        (Math.round(weight * ALPHA_STEPS) / ALPHA_STEPS) * GRAIN_CONFIG.filmGrainStrength;
      const i = (y * size + x) * 2;
      pixels[i] = n > 0 ? 255 : 0;
      pixels[i + 1] = Math.round(alpha * 255);
    }
  }
  const file = resolve(OUTPUT, `grain-tile@${scale}x.webp`);
  const { size: bytes } = await sharp(pixels, { raw: { width: size, height: size, channels: 2 } })
    .webp({ lossless: true, effort: 6 })
    .toFile(file);
  console.log(`${file} · ${size}×${size} · ${(bytes / 1024).toFixed(1)} KB`);
}

await writeTile(1);
await writeTile(2);
