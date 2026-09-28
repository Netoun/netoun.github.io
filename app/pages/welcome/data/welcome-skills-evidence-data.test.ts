import { describe, expect, it } from "vitest";
import { EXPERIMENT_SLUGS } from "@/features/labs/data/experiment-slugs";
import { findReceipt, hasReceipt } from "@/features/skills/data/skill-fetch";
import { STACK_TOOLS } from "@/features/skills/data/skills-data";
import { sitePackages, skillEvidence } from "./welcome-skills-evidence-data";

describe("Skills evidence", () => {
  // The rule Nicolas set on 2026-09-28: a tool is listed only if it ships somewhere.
  it.each(STACK_TOOLS)("finds where %s ships", (tool) => {
    expect(hasReceipt(findReceipt(tool, skillEvidence, sitePackages))).toBe(true);
  });

  it("reads the tags of every Lab at build time", () => {
    const labs = skillEvidence.filter((source) => source.kind === "lab");
    expect(labs.map((lab) => lab.label).toSorted()).toEqual([...EXPERIMENT_SLUGS].toSorted());
    expect(labs.every((lab) => lab.tags.length > 0)).toBe(true);
  });

  it("reads the site's own package.json at build time", () => {
    expect(sitePackages.dependencies).toContain("react-aria-components");
    expect(sitePackages.packageManager).toBe("bun");
  });
});
