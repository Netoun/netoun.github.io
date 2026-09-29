import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { ExperimentSlug } from "@/features/labs/data/experiment-slugs";
import { labs } from "@/features/labs/data/experiments";
import { LabsIndexTree } from "./labs-index-tree.component";

const experiments = labs.getAll();
// The tree prints the experiments directory by directory, not in registry order.
const inTreeOrder = labs.getGrouped().flatMap((section) => section.experiments);

function renderTree(previewSlug: ExperimentSlug = experiments[0].slug) {
  const onPreview = vi.fn();
  const router = createMemoryRouter([
    { path: "*", element: <LabsIndexTree previewSlug={previewSlug} onPreview={onPreview} /> },
  ]);
  render(<RouterProvider router={router} />);
  return { onPreview };
}

const rows = () => document.querySelectorAll<HTMLAnchorElement>("[data-lab-row]");

describe("LabsIndexTree", () => {
  it("prints one row per experiment, each linking to its page with the trailing slash", () => {
    renderTree();
    expect(rows()).toHaveLength(experiments.length);
    for (const experiment of experiments) {
      expect(screen.getByRole("link", { name: experiment.title })).toHaveAttribute(
        "href",
        `/labs/${experiment.slug}/`,
      );
    }
  });

  it("describes each row with its sentence", () => {
    renderTree();
    const [first] = experiments;
    expect(screen.getByRole("link", { name: first.title })).toHaveAccessibleDescription(
      first.description,
    );
  });

  it("heads each group directory and closes on the directory count", () => {
    renderTree();
    const groups = labs.getGrouped();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(groups.length);
    for (const section of groups) {
      // Anchored: `CSS` is also the end of `3D CSS`.
      expect(
        screen.getByRole("heading", { name: new RegExp(`^${section.group} `) }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText(`${labs.getTotals().directories} directories`)).toBeInTheDocument();
  });

  it("marks the previewed row", () => {
    renderTree(experiments[3].slug);
    const marked = [...rows()].filter((row) => row.dataset.previewed === "true");
    expect(marked.map((row) => row.getAttribute("href"))).toEqual([
      `/labs/${experiments[3].slug}/`,
    ]);
  });

  it("previews a row when it is pointed at or focused", () => {
    const { onPreview } = renderTree();
    fireEvent.pointerEnter(rows()[2]);
    expect(onPreview).toHaveBeenLastCalledWith(inTreeOrder[2].slug);
    fireEvent.focus(rows()[5]);
    expect(onPreview).toHaveBeenLastCalledWith(inTreeOrder[5].slug);
  });

  it("walks the rows with the arrow keys", () => {
    renderTree();
    const [first, second] = rows();
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: "ArrowUp" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: "ArrowUp" });
    expect(first).toHaveFocus();
  });
});
