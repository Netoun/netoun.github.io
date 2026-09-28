/// <reference types="vitest/config" />
import { execSync } from "node:child_process";
import fs from "node:fs";
import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig, type Plugin } from "vite";
import { EXPERIMENT_SLUGS } from "./app/features/labs/data/experiment-slugs.ts";

const SITE_URL = "https://www.netoun.com";

/** Every prerendered path; mirrors the prerender list in `react-router.config.ts`. */
const PRERENDERED_PATHS = ["/", "/labs", ...EXPERIMENT_SLUGS.map((slug) => `/labs/${slug}`)];

/**
 * Loads `*.css.ts?raw` imports as plain strings.
 *
 * The vanilla-extract plugin claims every `.css.ts` file regardless of the
 * `?raw` query (it strips the query before matching), so Vite's built-in raw
 * loader never runs. This pre-plugin resolves such imports to a query-less
 * virtual id that VE's `cssFileFilter` won't match, then returns the file's
 * source. Used by the Labs source viewer to display `.css.ts` styling.
 */
function rawCssTsPlugin(): Plugin {
  const PREFIX = "\0raw-css-ts:";
  const idToFile = new Map<string, string>();
  const fileToId = new Map<string, string>();
  let counter = 0;

  return {
    name: "raw-css-ts",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!source.endsWith(".css.ts?raw")) return null;
      const resolved = await this.resolve(source.slice(0, -"?raw".length), importer, {
        skipSelf: true,
      });
      if (!resolved) return null;

      let id = fileToId.get(resolved.id);
      if (!id) {
        id = `${PREFIX}${counter++}`;
        fileToId.set(resolved.id, id);
        idToFile.set(id, resolved.id);
      }
      return id;
    },
    load(id) {
      const filePath = idToFile.get(id);
      if (!filePath) return null;
      const code = fs.readFileSync(filePath, "utf-8");
      return `export default ${JSON.stringify(code)};`;
    },
  };
}

/** Sitemap priority: the home, then the Labs index, then each Lab. */
function sitemapPriority(path: string): string {
  if (path === "/") return "1.0";
  return path === "/labs" ? "0.8" : "0.6";
}

/**
 * Emits `sitemap.xml` into the client build output (not `public/`), so builds
 * and typechecks never dirty the working tree. Routes mirror the prerender
 * list in `react-router.config.ts`.
 */
function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    apply: "build",
    generateBundle() {
      if (this.environment.name !== "client") return;

      const pages = PRERENDERED_PATHS.map((path) => ({
        url: `${SITE_URL}${path}`,
        priority: sitemapPriority(path),
      }));
      const urls = pages
        .map(
          (page) => `  <url>
    <loc>${page.url}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
        )
        .join("\n");

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
      });
    },
  };
}

/**
 * Each Lab's tags, read from its descriptor. The Skills section cites the Labs as evidence,
 * but importing the descriptors would pull every demo and its `?raw` sources into the home
 * bundle; only these strings ship.
 */
function readLabTags(): Record<string, string[]> {
  return Object.fromEntries(
    EXPERIMENT_SLUGS.map((slug) => {
      const file = `./app/features/labs/experiments/${slug}/${slug}.experiment.ts`;
      const source = fs.readFileSync(new URL(file, import.meta.url), "utf-8");
      const list = source.match(/\btags:\s*\[([^\]]*)\]/)?.[1];
      if (list === undefined) throw new Error(`${file}: no tags array`);
      return [slug, [...list.matchAll(/"([^"]+)"/g)].map((match) => match[1])];
    }),
  );
}

/**
 * The short commit the build ran on: Cloudflare Pages exposes it, a local build asks git.
 * Empty when neither knows (the footer then prints no commit).
 */
function readBuildCommit(): string {
  const fromPages = process.env.CF_PAGES_COMMIT_SHA;
  if (fromPages) return fromPages.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

/** The site's own dependencies and package manager, cited as evidence by the Skills section. */
function readSitePackages(): { dependencies: string[]; packageManager: string } {
  const manifest = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf-8"));
  return {
    dependencies: Object.keys({ ...manifest.dependencies, ...manifest.devDependencies }).toSorted(),
    packageManager: String(manifest.packageManager ?? "").split("@")[0],
  };
}

export default defineConfig({
  // The day this build ran (UTC). Prerendered markup is frozen at that date, so anything
  // that reads the calendar must hydrate from it, then move to the visitor's date.
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    __BUILD_COMMIT__: JSON.stringify(readBuildCommit()),
    __PRERENDERED_ROUTES__: JSON.stringify(PRERENDERED_PATHS.length),
    __LAB_TAGS__: JSON.stringify(readLabTags()),
    __SITE_PACKAGES__: JSON.stringify(readSitePackages()),
  },
  plugins: [
    rawCssTsPlugin(),
    sitemapPlugin(),
    // The React Router plugin replaces the app entry; Vitest must not load it.
    !process.env.VITEST && reactRouter(),
    vanillaExtractPlugin(),
  ],
  resolve: {
    // Aliases come from `tsconfig.json#compilerOptions.paths` (single source of truth).
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks for better caching across deploys.
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
            { name: "vendor-anime", test: /node_modules[\\/]animejs[\\/]/ },
          ],
        },
      },
    },
  },
  // React Router prerenders through a Vite preview server and requests it over
  // IPv4. Where `localhost` resolves to ::1 first (e.g. Debian-based Docker
  // images), an unpinned host listens on IPv6 only and every prerender request
  // is refused.
  preview: { host: "127.0.0.1" },
  test: {
    environment: "happy-dom",
    setupFiles: ["./test-setup.ts"],
    globals: true,
  },
});
