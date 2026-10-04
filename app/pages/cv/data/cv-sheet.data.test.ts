import { describe, expect, it } from "vitest";
import { experiences } from "@/features/experiences/data/experiences-data";
import { projects } from "@/features/projects/data/projects-data";
import { STACK_TOOLS } from "@/features/skills/data/skills-data";
import { CV_CLIENTS, CV_JOBS, CV_PROJECTS } from "./cv-copy.data";
import { cvFingerprint, toCvSheet } from "./cv-sheet.data";

const sorted = (keys: string[]) => keys.toSorted();

describe("cv copy", () => {
  // A job or a project added to the site must get its résumé line, and a line must not outlive
  // the entry it condenses.
  it("has one line per job, client project and project, and no other", () => {
    expect(sorted(Object.keys(CV_JOBS))).toEqual(sorted(experiences.map((job) => job.slug)));
    expect(sorted(Object.keys(CV_CLIENTS))).toEqual(
      sorted(experiences.flatMap((job) => job.projects.map((project) => project.title))),
    );
    expect(sorted(Object.keys(CV_PROJECTS))).toEqual(sorted(projects.map((p) => p.slug)));
  });
});

describe("toCvSheet", () => {
  const sheet = toCvSheet("2026-10");

  it("counts periods and the uptime to the given month, as the work log does", () => {
    const [current, ...past] = sheet.jobs;
    expect(current).toMatchObject({ company: "Lonestone", period: "JUL 2021 – NOW", isOpen: true });
    expect(current.duration).toBe("5Y 3M");
    expect(past.map((job) => job.period)).toEqual(["JUL 2019 – JUL 2021", "SEP 2017 – JUL 2019"]);
    expect(sheet.contacts.find((contact) => contact.key === "Uptime")?.value).toBe(
      "9Y 1M · since SEP 2017",
    );
  });

  it("prints the mail address, not the mailto link", () => {
    expect(sheet.contacts.find((contact) => contact.key === "Mail")).toEqual({
      key: "Mail",
      value: "netoun@proton.me",
      href: "mailto:netoun@proton.me",
    });
  });

  it("lists the projects newest first and the whole stack once", () => {
    const dates = sheet.projects.map((project) => project.yearMonth);
    expect(dates).toEqual(dates.toSorted().toReversed());
    expect(sheet.stack.flatMap((group) => group.tools).toSorted()).toEqual(STACK_TOOLS.toSorted());
    expect(Math.max(...sheet.stack.map((group) => group.share))).toBe(1);
  });
});

describe("cvFingerprint", () => {
  it("reads the content, not the calendar", () => {
    expect(cvFingerprint()).toMatch(/^[0-9a-f]{8}$/);
    expect(cvFingerprint()).toBe(cvFingerprint());
  });
});
