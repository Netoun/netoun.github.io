import { describe, expect, it } from "vitest";
import { formatLineRange, resolveSourceRef, splitCode } from "./labs-manual";
import type { LabSource } from "./labs.types";

const source = (label: string, code: string): LabSource => ({
  label,
  code,
  lang: "ts",
  path: `app/${label}`,
  role: "technique",
});

const SOURCES = [
  source("a.ts", "const a = 1;\n\nfunction run() {\n  step();\n}\n"),
  source("b.ts", "b"),
];

describe("labs manual references", () => {
  it("resolves a single anchored line", () => {
    expect(resolveSourceRef(SOURCES, { source: "a.ts", from: "const a" })).toEqual({
      sourceIndex: 0,
      from: 1,
      to: 1,
    });
  });

  it("resolves a span from its first line to the next line matching its end", () => {
    expect(resolveSourceRef(SOURCES, { source: "a.ts", from: "function run", to: "}" })).toEqual({
      sourceIndex: 0,
      from: 3,
      to: 5,
    });
  });

  it("misses when the file, the start or the end is absent", () => {
    expect(resolveSourceRef(SOURCES, { source: "c.ts", from: "a" })).toBeUndefined();
    expect(resolveSourceRef(SOURCES, { source: "a.ts", from: "nope" })).toBeUndefined();
    expect(
      resolveSourceRef(SOURCES, { source: "a.ts", from: "step", to: "const a" }),
    ).toBeUndefined();
  });

  it("prints ranges the way the man page cites them", () => {
    expect(formatLineRange({ sourceIndex: 0, from: 70, to: 70 })).toBe("L70");
    expect(formatLineRange({ sourceIndex: 0, from: 293, to: 309 })).toBe("L293–309");
  });

  it("splits a note body on backticks", () => {
    expect(splitCode("from `lcg()`, started at `0x5e2d91af`.")).toEqual([
      { text: "from ", code: false },
      { text: "lcg()", code: true },
      { text: ", started at ", code: false },
      { text: "0x5e2d91af", code: true },
      { text: ".", code: false },
    ]);
  });
});
