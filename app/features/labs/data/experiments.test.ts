import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EXPERIMENT_SLUGS } from "./experiment-slugs";
import { labs } from "./experiments";
import { resolveSourceRef } from "./labs-manual";
import { SITE_URL } from "@/features/site/data/site";

// `EXPERIMENT_SLUGS` drives prerender (react-router.config.ts) and the sitemap
// (vite.config.ts); the registry drives the UI. They must describe the same set.
describe("labs registry", () => {
  it("registers exactly one experiment per prerendered slug", () => {
    const registered = labs.getAll().map((experiment) => experiment.slug);

    expect(new Set(registered).size).toBe(registered.length);
    expect(registered.toSorted()).toEqual([...EXPERIMENT_SLUGS].toSorted());
  });

  it("resolves every slug and rejects unknown ones", () => {
    for (const slug of EXPERIMENT_SLUGS) {
      expect(labs.getBySlug(slug)?.slug).toBe(slug);
    }
    expect(labs.getBySlug("does-not-exist")).toBeUndefined();
    expect(labs.getBySlug(undefined)).toBeUndefined();
  });

  it("places every experiment in exactly one sidebar group", () => {
    const grouped = labs.getGrouped().flatMap((section) => section.experiments);

    expect(grouped).toHaveLength(labs.getAll().length);
    expect(labs.getGrouped().every((section) => section.experiments.length > 0)).toBe(true);
  });

  it("points every source at the repo file it was imported from", () => {
    for (const experiment of labs.getAll()) {
      for (const source of experiment.sources) {
        expect({
          path: source.path,
          matches: readFileSync(source.path, "utf8") === source.code,
        }).toEqual({
          path: source.path,
          matches: true,
        });
      }
    }
  });

  it("opens the code viewer on the technique, never on the Lab's wiring", () => {
    for (const experiment of labs.getAll()) {
      expect({ slug: experiment.slug, role: experiment.sources[0].role }).toEqual({
        slug: experiment.slug,
        role: "technique",
      });
    }
  });

  it("anchors every man page reference to lines that exist", () => {
    for (const experiment of labs.getAll()) {
      const notes = [...(experiment.manual?.how ?? []), ...(experiment.manual?.cost ?? [])];
      for (const ref of notes.flatMap((note) => note.refs ?? [])) {
        const resolved = resolveSourceRef(experiment.sources, ref) !== undefined;
        expect({ slug: experiment.slug, from: ref.from, resolved }).toEqual({
          slug: experiment.slug,
          from: ref.from,
          resolved: true,
        });
      }
      for (const link of experiment.manual?.seeAlso ?? []) {
        expect(labs.getBySlug(link.slug)).toBeDefined();
      }
    }
  });

  it("ships at least one source tab per experiment", () => {
    for (const experiment of labs.getAll()) {
      expect(experiment.sources.length).toBeGreaterThan(0);
      for (const source of experiment.sources) {
        expect(source.code.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("labs SEO meta", () => {
  it("builds a canonical, topic-first meta set per experiment", () => {
    for (const experiment of labs.getAll()) {
      const meta = labs.buildMeta(experiment);
      const url = `${SITE_URL}/labs/${experiment.slug}/`;

      expect(meta).toContainEqual({
        title: `${experiment.title} · ${experiment.group} — Netoun Labs`,
      });
      expect(meta).toContainEqual({ name: "description", content: experiment.description });
      expect(meta).toContainEqual({ property: "og:url", content: url });
      expect(meta).toContainEqual({ tagName: "link", rel: "canonical", href: url });
    }
  });

  it("builds the labs index meta", () => {
    const meta = labs.buildIndexMeta();

    expect(meta).toContainEqual({ title: "Netoun - Labs" });
    expect(meta).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: `${SITE_URL}/labs/`,
    });
  });
});
