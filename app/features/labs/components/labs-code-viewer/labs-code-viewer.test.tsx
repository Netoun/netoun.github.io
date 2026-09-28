import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderDemo } from "../../__test-utils__/labs-test-helpers";
import type { LabSource } from "../../data/labs.types";
import { LabsCodeViewer } from "../../components/labs-code-viewer/labs-code-viewer.component";

const MOCK_SOURCES: LabSource[] = [
  { label: "foo.tsx", code: "const x = 1;", lang: "tsx", path: "app/foo.tsx", role: "technique" },
  {
    label: "bar.css",
    code: ".a {\n  color: red;\n}\n.b {}",
    lang: "css",
    path: "app/bar.css",
    role: "styles",
  },
];

describe("LabsCodeViewer", () => {
  it("renders file tabs, the first one open", () => {
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

    fireEvent.click(screen.getByRole("button", { name: "Copy foo.tsx" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    });
  });

  it("opens the cited file on the cited lines and links them on GitHub", () => {
    const { container } = renderDemo(
      <LabsCodeViewer
        sources={MOCK_SOURCES}
        highlight={{ sourceIndex: 1, from: 1, to: 3, label: "note 2" }}
      />,
    );

    expect(screen.getByRole("tab", { name: "bar.css" })).toHaveAttribute("aria-selected", "true");
    expect(container.querySelectorAll("[data-lit]")).toHaveLength(3);
    expect(screen.getByText("L1–3 · note 2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /source/i })).toHaveAttribute(
      "href",
      "https://github.com/netoun/netoun.github.io/blob/main/app/bar.css#L1-L3",
    );
  });

  it("returns null when sources array is empty", () => {
    const { container } = renderDemo(<LabsCodeViewer sources={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
