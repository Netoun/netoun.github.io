import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { GRAIN_TILE, grainCell } from "../app/components/misc/shaders/grain/grain.shader";

// Bakes the page grain into a tiled background, so the paper keeps its film grain without a
// full-viewport WebGL canvas (and without JS). Same noise as `grain.shader.ts`: one signed cell
// per physical pixel (half lighten, half darken), `pow(|n|·2, gamma) · strength` alpha.
//
// The tile repeats every GRAIN_TILE.size CSS pixels; the @2x file keeps one cell per device
// pixel on retina screens, like the shader's buffer did. `grainCell` quantises the alpha.

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "../public/images");

async function writeTile(scale: number) {
  const size = GRAIN_TILE.size * scale;
  const pixels = Buffer.alloc(size * size * 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const { lighten, alpha } = grainCell(x, y);
      const i = (y * size + x) * 2;
      pixels[i] = lighten ? 255 : 0;
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
