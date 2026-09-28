import sharp from "sharp";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Regenerates the icons and the share image that the site actually serves: the SVG favicon
// (`logo.svg`) is linked in root.tsx; `favicon.ico` and `apple-touch-icon.png` are the two files
// browsers request at the root on their own; `og-image-1200x630.png` is the Open Graph image.

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "../public");
const LOGO = resolve(PUBLIC, "logo.svg");
const OG_SOURCE = resolve(PUBLIC, "images/projects/website-card.webp");

const ICO_SIZES = [16, 32, 48];
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

function logoPng(size: number) {
  return sharp(LOGO).resize(size, size, { fit: "contain", background: TRANSPARENT }).png();
}

// ICO container with PNG-compressed entries (supported by every browser that still reads .ico).
function toIco(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

async function writeFavicon() {
  const images = await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, data: await logoPng(size).toBuffer() })),
  );
  const ico = toIco(images);
  writeFileSync(resolve(PUBLIC, "favicon.ico"), ico);
  console.log(`favicon.ico · ${ICO_SIZES.join(", ")} · ${(ico.length / 1024).toFixed(1)} KB`);
}

async function writeAppleTouchIcon() {
  const { size } = await logoPng(180).toFile(resolve(PUBLIC, "apple-touch-icon.png"));
  console.log(`apple-touch-icon.png · 180×180 · ${(size / 1024).toFixed(1)} KB`);
}

async function writeOgImage() {
  const { size } = await sharp(OG_SOURCE)
    .resize(1200, 630, { fit: "cover" })
    .png()
    .toFile(resolve(PUBLIC, "og-image-1200x630.png"));
  console.log(`og-image-1200x630.png · 1200×630 · ${(size / 1024).toFixed(1)} KB`);
}

await Promise.all([writeFavicon(), writeAppleTouchIcon(), writeOgImage()]);
