import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://www.netoun.com";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../public");
const EXPERIMENTS_DIR = path.resolve(__dirname, "../app/features/labs/experiments");

const slugs = fs
  .readdirSync(EXPERIMENTS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort() as readonly string[];

const pages: { url: string; priority: string; changefreq: string }[] = [
  { url: `${SITE_URL}/`, priority: "1.0", changefreq: "monthly" },
  { url: `${SITE_URL}/labs`, priority: "0.8", changefreq: "monthly" },
  ...slugs.map((slug) => ({
    url: `${SITE_URL}/labs/${slug}`,
    priority: "0.6",
    changefreq: "monthly",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap);
console.log(`sitemap.xml generated with ${pages.length} URLs`);
