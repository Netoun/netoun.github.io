import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { labs } from "@/features/labs/data/experiments";
import { LabsIndexLoupe } from "./labs-index-loupe.component";

// A CSS-only demo: it runs in happy-dom without a canvas.
const found = labs.getBySlug("scroll-morph");
if (!found) throw new Error("scroll-morph is missing from the registry");
const experiment = found;

function renderLoupe(live: boolean) {
  const router = createMemoryRouter([
    { path: "*", element: <LabsIndexLoupe experiment={experiment} live={live} /> },
  ]);
  return render(<RouterProvider router={router} />);
}

describe("LabsIndexLoupe", () => {
  it("prints the experiment and its own files as tree -h does", () => {
    renderLoupe(false);
    const stats = labs.getStats(experiment);
    expect(screen.getByText(experiment.title)).toBeInTheDocument();
    expect(screen.getByText(`tree -h ~/labs/${stats.dir}/${experiment.slug}`)).toBeInTheDocument();
    for (const source of stats.sources) {
      expect(screen.getByText(source.label)).toBeInTheDocument();
      expect(screen.getByText(`[${source.size.padStart(4, " ")}]`)).toBeInTheDocument();
    }
    expect(screen.getByText(`0 directories, ${stats.files} files`)).toBeInTheDocument();
  });

  it("is an echo of the row: hidden from assistive tech, its link out of the tab order", () => {
    const { container } = renderLoupe(false);
    expect(container.querySelector("aside")).toHaveAttribute("aria-hidden", "true");
    const open = container.querySelector(`a[href="/labs/${experiment.slug}/"]`);
    expect(open).toHaveAttribute("tabindex", "-1");
  });

  it("shows the capture alone until it may run the demo", () => {
    const { container } = renderLoupe(false);
    expect(container.querySelector("img")).toBeInTheDocument();
    expect(container.querySelector("[data-labs-live]")).not.toBeInTheDocument();
  });

  it("runs the demo's stage over the capture, without its controls", () => {
    const { container } = renderLoupe(true);
    expect(container.querySelector("[data-labs-live]")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeInTheDocument();
    expect(container.querySelector('[role="slider"]')).not.toBeInTheDocument();
  });
});
