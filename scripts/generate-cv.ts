import { spawnSync } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright-core";
import { RESUME_FILE } from "../app/features/site/data/resume.data";

// Prints the résumé. Builds the site, serves `build/client`, opens /cv/ in Chrome and saves the
// A4 sheet as `public/<RESUME_FILE>`, then stores the fingerprint of what it printed in
// `cv-pdf.lock.json`: a test compares it with the data, so the PDF cannot drift from the site.
//
// Runs on a machine with Google Chrome (or Playwright's own Chromium installed); the Pages build
// never runs it, the PDF ships as a file.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CLIENT = join(ROOT, "build/client");
const PDF = join(ROOT, "public", RESUME_FILE);
const LOCK = join(ROOT, "app/pages/cv/data/cv-pdf.lock.json");
const A4 = { width: 794, height: 1123 };

const build = spawnSync("bun", ["run", "build"], { cwd: ROOT, stdio: "inherit" });
if (build.status !== 0) throw new Error("bun run build failed");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

// Pages serves `<path>/index.html` at `<path>/`; so does this.
const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://local").pathname);
  const file = join(CLIENT, normalize(pathname.endsWith("/") ? `${pathname}index.html` : pathname));
  readFile(file).then(
    (body) => {
      response.writeHead(200, {
        "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
      });
      response.end(body);
    },
    () => {
      response.writeHead(404);
      response.end();
    },
  );
});
await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
const address = server.address();
if (address === null || typeof address === "string") throw new Error("the server has no port");
const { port } = address;

async function launch(): Promise<Browser> {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return chromium.launch();
  }
}

const browser = await launch();
try {
  const page = await browser.newPage({ viewport: A4 });
  await page.emulateMedia({ media: "print" });
  await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    // The logo paints on the frame after Doto loads.
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  });

  const sheet = await page.evaluate(() => {
    const content = document.querySelector<HTMLElement>("[data-cv-page]");
    const article = content?.closest<HTMLElement>("[data-cv-fingerprint]");
    return {
      fingerprint: article?.dataset.cvFingerprint,
      overflow: content ? content.scrollHeight - content.clientHeight : Number.NaN,
    };
  });
  if (!sheet.fingerprint || Number.isNaN(sheet.overflow)) {
    throw new Error("/cv/ has no sheet to print");
  }
  if (sheet.overflow > 0) {
    throw new Error(`The sheet runs ${sheet.overflow}px past its A4 page: trim the copy`);
  }

  // One page: the sheet's height rounds a fraction of a pixel past A4's 297 mm.
  await page.pdf({
    path: PDF,
    format: "A4",
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    printBackground: true,
    pageRanges: "1",
  });
  await writeFile(LOCK, `${JSON.stringify({ fingerprint: sheet.fingerprint }, null, 2)}\n`);
  const { size: bytes } = await stat(PDF);
  console.log(`${PDF} · ${(bytes / 1024).toFixed(1)} KB · fingerprint ${sheet.fingerprint}`);
} finally {
  await browser.close();
  server.close();
}
