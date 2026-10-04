import { describe, expect, it } from "vitest";
import lock from "./cv-pdf.lock.json";
import { cvFingerprint } from "./cv-sheet.data";

// The PDF is a file in public/, printed by `bun run generate-cv`; it cannot follow the data on
// its own. The script stores what it printed; when the site's content moves, this fails.
describe("the résumé PDF", () => {
  it("was printed from the site's current content", () => {
    expect(
      lock.fingerprint,
      "The résumé PDF is out of date with the site's data: run `bun run generate-cv`.",
    ).toBe(cvFingerprint());
  });
});
