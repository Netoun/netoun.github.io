import { describe, expect, it } from "vitest";
import { findReceipt, formatReceipt, hasReceipt, toDomain, toStackGroups } from "./skill-fetch";
import type { EvidenceSource, SitePackages } from "./skills-data.types";

const SOURCES: EvidenceSource[] = [
  { kind: "project", label: "My website", tags: ["React", "CSS + Vanilla Extract"] },
  { kind: "project", label: "Treashunt", tags: ["React", "Bun", "Queue"] },
  { kind: "job", label: "Lonestone", tags: ["React", "NestJS"] },
  { kind: "lab", label: "grain-shader", tags: ["WebGL", "GLSL"] },
];

const SITE: SitePackages = { dependencies: ["react", "vite"], packageManager: "bun" };

describe("toDomain", () => {
  it("reads the tag primitive's map and calls its neutral bucket tooling", () => {
    expect(toDomain("React")).toBe("frontend");
    expect(toDomain("NestJS")).toBe("backend");
    expect(toDomain("WebGL")).toBe("creative");
    expect(toDomain("Vite")).toBe("tooling");
  });
});

describe("findReceipt", () => {
  it("collects every project, job and Lab that lists the tool", () => {
    expect(findReceipt("React", SOURCES, SITE)).toEqual({
      projects: ["My website", "Treashunt"],
      jobs: ["Lonestone"],
      labs: [],
      site: "react",
    });
    expect(findReceipt("WebGL", SOURCES, SITE).labs).toEqual(["grain-shader"]);
  });

  it("matches the other spellings the data uses", () => {
    expect(findReceipt("Vanilla Extract", SOURCES, SITE).projects).toEqual(["My website"]);
    expect(findReceipt("Queues", SOURCES, SITE).projects).toEqual(["Treashunt"]);
  });

  it("proves the package manager from package.json, not from a dependency", () => {
    expect(findReceipt("Bun", SOURCES, SITE).site).toBe("packageManager");
    expect(findReceipt("Vitest", SOURCES, SITE).site).toBeNull();
  });
});

describe("hasReceipt", () => {
  it("is false only when the tool ships nowhere", () => {
    expect(hasReceipt(findReceipt("Vite", SOURCES, SITE))).toBe(true);
    expect(hasReceipt(findReceipt("Remix", SOURCES, SITE))).toBe(false);
  });
});

describe("toStackGroups", () => {
  it("groups in reading order, keeps the input order inside a group, drops empty domains", () => {
    const groups = toStackGroups(["Vite", "NestJS", "TypeScript", "React"], SOURCES, SITE);
    expect(groups.map((group) => [group.domain, group.tools.map((tool) => tool.name)])).toEqual([
      ["frontend", ["TypeScript", "React"]],
      ["backend", ["NestJS"]],
      ["tooling", ["Vite"]],
    ]);
  });
});

describe("formatReceipt", () => {
  it("prints counts, names and the package.json entry", () => {
    expect(formatReceipt(findReceipt("React", SOURCES, SITE))).toBe(
      "2 projects: My website, Treashunt · 1 job: Lonestone · this site's package.json (react)",
    );
    expect(formatReceipt(findReceipt("WebGL", SOURCES, SITE))).toBe("1 lab: grain-shader");
  });
});
