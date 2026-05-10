import sharp from "sharp";
import { mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");
const FAVICON_SVG = resolve(PUBLIC, "logo.svg");
const OG_SOURCE = resolve(PUBLIC, "images/projects/website.webp");

mkdirSync(PUBLIC, { recursive: true });

// Clean old favicons (keep .ico for now, regenerate)
const oldFavs = ["browserconfig.xml", "site.webmanifest", "safari-pinned-tab.svg"];
for (const f of oldFavs) {
  try {
    rmSync(resolve(PUBLIC, f));
  } catch {}
}

// --- Favicon sizes ---
async function generateFavicons() {
  console.log("🎨 Generating favicon variants...");

  // PNG sizes (named per convention)
  const sizes = [
    { name: "favicon-16x16.png", w: 16, h: 16 },
    { name: "favicon-32x32.png", w: 32, h: 32 },
    { name: "favicon-96x96.png", w: 96, h: 96 },
    { name: "apple-touch-icon.png", w: 180, h: 180 },
    { name: "android-chrome-192x192.png", w: 192, h: 192 },
    { name: "android-chrome-512x512.png", w: 512, h: 512 },
    { name: "mstile-150x150.png", w: 150, h: 150 },
  ];

  for (const s of sizes) {
    await sharp(FAVICON_SVG)
      .resize(s.w, s.h, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(resolve(PUBLIC, s.name));
    console.log(`  ✅ ${s.name} (${s.w}x${s.h})`);
  }

  // Multi-resolution ICO (bundled 16, 24, 32, 48, 64, 128, 256)
  const icoRes = [16, 24, 32, 48, 64, 128, 256];
  const icoImages = await Promise.all(
    icoRes.map(async (r) => {
      const buf = await sharp(FAVICON_SVG)
        .resize(r, r, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
      return { data: buf, width: r, height: r };
    }),
  );

  // Build ICO manually (little-endian)
  const icoData = Buffer.concat([
    // ICONDIR header
    Buffer.from([0x00, 0x00]), // reserved
    Buffer.from([0x01, 0x00]), // type = 1 (icon)
    Buffer.from([icoRes.length & 0xff, (icoRes.length >> 8) & 0xff]), // count
    // ICONDIRENTRY for each
    ...icoImages.map((img) => {
      const bpp = 32;
      const size = img.data.length + 40; // image data + BITMAPINFOHEADER
      return Buffer.from([
        img.width & 0xff, // width (0 means 256)
        img.height & 0xff, // height
        0x00, // color count (0 = no palette)
        0x00, // reserved
        0x01,
        0x00, // color planes
        bpp & 0xff,
        (bpp >> 8) & 0xff, // bits per pixel
        size & 0xff,
        (size >> 8) & 0xff,
        (size >> 16) & 0xff,
        (size >> 24) & 0xff, // image size
        0x00,
        0x00,
        0x00,
        0x00, // offset (placeholder)
      ]);
    }),
  ]);

  // Write ICO with BMP headers prepended to each image
  const writeStream = [];
  writeStream.push(icoData);

  // Write each image data with its BITMAPINFOHEADER
  let currentOffset = 6 + 16 * icoRes.length;
  for (let i = 0; i < icoImages.length; i++) {
    // Fix offset in ICONDIRENTRY
    const offPos = 6 + 16 * i + 12;
    icoData.writeUInt32LE(currentOffset, offPos);

    const img = icoImages[i];
    const size = img.data.length;
    const width = img.width;
    const height = img.height * 2; // BMP stores doubled height

    // BITMAPINFOHEADER (40 bytes)
    const bmpHeader = Buffer.alloc(40);
    bmpHeader.writeUInt32LE(40, 0); // header size
    bmpHeader.writeInt32LE(width, 4); // width
    bmpHeader.writeInt32LE(height, 8); // height (doubled)
    bmpHeader.writeUInt16LE(1, 12); // planes
    bmpHeader.writeUInt16LE(32, 14); // bit count (BGRA)
    bmpHeader.writeUInt32LE(0, 16); // compression (none)
    bmpHeader.writeUInt32LE(size, 20); // image size
    bmpHeader.writeInt32LE(0, 24); // x pixels per meter
    bmpHeader.writeInt32LE(0, 28); // y pixels per meter
    bmpHeader.writeUInt32LE(0, 32); // colors used
    bmpHeader.writeUInt32LE(0, 36); // important colors

    writeStream.push(bmpHeader);
    writeStream.push(img.data);

    // Pad to 4-byte boundary if needed
    const rowSize = Math.ceil((width * 4) / 4) * 4;
    const expectedSize = (rowSize * height) / 2;
    if (size < expectedSize) {
      writeStream.push(Buffer.alloc(expectedSize - size));
    }

    currentOffset += 40 + size;
  }

  // Rewrite favicon.ico
  try {
    rmSync(resolve(PUBLIC, "favicon.ico"));
  } catch {}
  const { writeFileSync } = await import("fs");
  writeFileSync(resolve(PUBLIC, "favicon.ico"), Buffer.concat(writeStream));
  console.log(`  ✅ favicon.ico (multi: ${icoRes.join(", ")})`);

  // Safari pinned tab SVG (uses mask-icon)
  const safariSvg = `<svg xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M21.66 0a21.66 21.66 0 1 0 21.66 21.66A21.66 21.66 0 0 0 21.66 0m15.2 22.2a12 12 0 0 1-1.1 1.25c-.6.64-1.25 1.3-1.95 2s-1.38 1.37-2.05 2a7 7 0 0 1-1.4 1.15 4.16 4.16 0 0 1-3.25.55 4.16 4.16 0 0 1-2.2-1.8 11.1 11.1 0 0 1-1.3-3.25q-.45-1.89-.75-3.75c-.2-1.23-.35-2.36-.45-3.4s-.18-1.75-.25-2.15a2.4 2.4 0 0 0-.1-.45s-.1.15-.3.35a8 8 0 0 0-1.7 2.5c-.53 1.14-1 2.37-1.55 3.7s-1 2.69-1.5 4.05a38 38 0 0 1-1.55 3.7 12.2 12.2 0 0 1-1.65 2.65 1.79 1.79 0 0 1-2 .7 2.93 2.93 0 0 1-1.55-.9 6.3 6.3 0 0 1-1.1-1.65 10.6 10.6 0 0 1-.7-1.95c-.16-.66-.28-1.23-.35-1.7A9 9 0 0 1 8 24.6v-3.3c0-.54.05-1 .05-1.3a6.8 6.8 0 0 1 1-3.15 1.78 1.78 0 0 1 1.8-1 1.53 1.53 0 0 1 1.25 1.55c.1.9.25 2 .45 3.35a36 36 0 0 1 .4 4.75 16 16 0 0 0 .1 2.3c.07.3.25.12.55-.55s.85-1.9 1.65-3.7a31 31 0 0 0 1.55-4.1A31.3 31.3 0 0 1 19.26 14q1.71-2.89 3.85-2.75c1.44.1 2.52 1.19 3.25 3.25a15.3 15.3 0 0 1 .7 5.2 21.6 21.6 0 0 0 .41 5.1 3 3 0 0 0 .84 1.95c.37.24.89.14 1.55-.3a15 15 0 0 0 2.5-2.2q1.5-1.55 3.8-3.75c.94.2 1.32.49 1.15.85a5 5 0 0 1-.45.85"/></svg>`;
  writeFileSync(resolve(PUBLIC, "safari-pinned-tab.svg"), safariSvg);
  console.log(`  ✅ safari-pinned-tab.svg (mask-icon)`);
}

// --- OG Images ---
async function generateOG() {
  console.log("\n📸 Generating OG images...");

  const formats = [
    { name: "og-image-1200x630.webp", w: 1200, h: 630 }, // Facebook, LinkedIn, Slack
    { name: "og-image-1200x675.webp", w: 1200, h: 675 }, // Twitter (landscape)
    { name: "og-image-1080x1080.webp", w: 1080, h: 1080 }, // Instagram, Pinterest
    { name: "og-image-1200x1200.webp", w: 1200, h: 1200 }, // Facebook square
    { name: "og-image-600x315.webp", w: 600, h: 315 }, // Twitter summary
  ];

  for (const f of formats) {
    await sharp(OG_SOURCE)
      .resize(f.w, f.h, { fit: "cover" })
      .webp({ quality: 90 })
      .toFile(resolve(PUBLIC, f.name));
    console.log(`  ✅ ${f.name} (${f.w}x${f.h})`);
  }

  // Also generate PNG fallback
  const pngFormat = { name: "og-image-1200x630.png", w: 1200, h: 630 };
  await sharp(OG_SOURCE)
    .resize(pngFormat.w, pngFormat.h, { fit: "cover" })
    .png()
    .toFile(resolve(PUBLIC, pngFormat.name));
  console.log(`  ✅ ${pngFormat.name} (${pngFormat.w}x${pngFormat.h})`);
}

// --- browserconfig.xml & manifest ---
async function generateConfig() {
  console.log("\n📄 Generating browser & PWA configs...");

  const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>#0a0a0a</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

  const manifest = `{
  "name": "Netoun",
  "short_name": "Netoun",
  "description": "Netoun — Création de sites web",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#ffffff",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/favicon-16x16.png", "sizes": "16x16", "type": "image/png" },
    { "src": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png" },
    { "src": "/favicon-96x96.png", "sizes": "96x96", "type": "image/png" }
  ]
}`;

  const { writeFileSync } = await import("fs");
  writeFileSync(resolve(PUBLIC, "browserconfig.xml"), browserconfig);
  writeFileSync(resolve(PUBLIC, "site.webmanifest"), manifest);
  console.log(`  ✅ browserconfig.xml`);
  console.log(`  ✅ site.webmanifest`);
}

(async () => {
  await generateFavicons();
  await generateOG();
  await generateConfig();
  console.log("\n✅ All assets generated successfully!");
})();
