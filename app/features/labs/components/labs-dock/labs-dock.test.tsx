import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { labs } from "../../data/experiments";
import { LabsDock } from "./labs-dock.component";

const experiments = labs.getAll();

function renderDock(currentSlug?: string) {
  const router = createMemoryRouter([
    {
      path: "*",
      element: <LabsDock experiments={experiments} currentSlug={currentSlug} />,
    },
  ]);
  return render(<RouterProvider router={router} />);
}

const toggle = () => screen.getByRole("button", { name: /^Experiments/ });
const list = () => document.getElementById(toggle().getAttribute("aria-controls") ?? "");

describe("LabsDock", () => {
  it("counts the experiments on the index, with no neighbours to step to", () => {
    renderDock();
    expect(toggle()).toHaveAccessibleName(`Experiments: Labs · ${experiments.length} experiments`);
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: /^Previous experiment/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Next experiment/ })).not.toBeInTheDocument();
  });

  it("names the experiment on screen and links its neighbours", () => {
    const current = experiments[4];
    renderDock(current.slug);
    expect(toggle()).toHaveAccessibleName(`Experiments, current: ${current.title}`);
    expect(toggle()).toHaveTextContent(`_05 ${current.title}`);
    expect(
      screen.getByRole("link", { name: `Previous experiment: ${experiments[3].title}` }),
    ).toHaveAttribute("href", `/labs/${experiments[3].slug}/`);
    expect(
      screen.getByRole("link", { name: `Next experiment: ${experiments[5].title}` }),
    ).toHaveAttribute("href", `/labs/${experiments[5].slug}/`);
  });

  it("does not wrap: the first has no previous, the last no next", () => {
    const { unmount } = renderDock(experiments[0].slug);
    expect(screen.queryByRole("link", { name: /^Previous experiment/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Next experiment/ })).toBeInTheDocument();
    unmount();

    renderDock(experiments[experiments.length - 1].slug);
    expect(screen.getByRole("link", { name: /^Previous experiment/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Next experiment/ })).not.toBeInTheDocument();
  });

  it("keeps the list out of reach until it opens, then lists every experiment", () => {
    const current = experiments[8];
    renderDock(current.slug);
    expect(list()).toHaveAttribute("inert");

    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(list()).not.toHaveAttribute("inert");

    const links = within(list() as HTMLElement).getAllByRole("link");
    expect(links).toHaveLength(experiments.length + 1);
    for (const experiment of experiments) {
      expect(
        within(list() as HTMLElement).getByRole("link", { name: experiment.title }),
      ).toHaveAttribute("href", `/labs/${experiment.slug}/`);
    }
    expect(
      within(list() as HTMLElement).getByRole("link", { name: current.title }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(list() as HTMLElement).getByRole("link", { name: experiments[0].title }),
    ).not.toHaveAttribute("aria-current");
    expect(within(list() as HTMLElement).getByRole("link", { name: "Labs index" })).toHaveAttribute(
      "href",
      "/labs/",
    );
  });

  it("marks the index row current on the index", () => {
    renderDock();
    fireEvent.click(toggle());
    expect(within(list() as HTMLElement).getByRole("link", { name: "Labs index" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("folds the list with Escape and gives focus back to the toggle", () => {
    renderDock(experiments[2].slug);
    fireEvent.click(toggle());
    fireEvent.keyDown(toggle(), { key: "Escape" });
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(toggle()).toHaveFocus();
  });
});
