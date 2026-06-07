import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderDemo } from "../../__test-utils__/labs-test-helpers";
import type { LabSource } from "../../data/labs.types";
import { LabsCodeViewer } from "../../components/labs-code-viewer/labs-code-viewer.component";

const MOCK_SOURCES: LabSource[] = [
  { label: "foo.tsx", code: "const x = 1;", lang: "tsx" },
  { label: "bar.css", code: ".a { color: red; }", lang: "css" },
];

describe("LabsCodeViewer", () => {
  it("renders file tabs", () => {
    renderDemo(<LabsCodeViewer sources={MOCK_SOURCES} />);

    expect(screen.getByRole("tab", { name: "foo.tsx" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "bar.css" })).toHaveAttribute("aria-selected", "false");
  });

  it("switches tabs on click", () => {
    renderDemo(<LabsCodeViewer sources={MOCK_SOURCES} />);

    fireEvent.click(screen.getByRole("tab", { name: "bar.css" }));
    expect(screen.getByRole("tab", { name: "bar.css" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "foo.tsx" })).toHaveAttribute("aria-selected", "false");
  });

  it("shows copied state after clicking copy", async () => {
    renderDemo(<LabsCodeViewer sources={MOCK_SOURCES} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "✓ Copied" })).toBeInTheDocument();
    });
  });

  it("returns null when sources array is empty", () => {
    const { container } = renderDemo(<LabsCodeViewer sources={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
