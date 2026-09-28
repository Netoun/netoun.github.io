import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { WelcomeSectionsNav } from "./welcome-sections-nav.component";

function renderNav() {
  const router = createMemoryRouter([{ path: "/", element: <WelcomeSectionsNav /> }]);
  return render(<RouterProvider router={router} />);
}

const toggle = () => screen.getByRole("button", { name: /^Sections, current:/ });

describe("WelcomeSectionsNav", () => {
  // happy-dom lays nothing out: the page cannot scroll, so it reads as scrolled to the end.
  it("names the current section on the toggle, collapsed at rest", () => {
    renderNav();
    expect(toggle()).toHaveAccessibleName("Sections, current: Contact");
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the section links out of reach until the list opens", () => {
    renderNav();
    const list = document.getElementById(toggle().getAttribute("aria-controls") ?? "");
    expect(list).toHaveAttribute("inert");

    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(list).not.toHaveAttribute("inert");
    const links = within(list as HTMLElement).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "_00 / Intro",
      "_01 / Projects",
      "_02 / Experience",
      "_03 / Skills",
      "_04 / Contact",
    ]);
    expect(links[1]).toHaveAccessibleName("Projects");
    expect(links[1]).toHaveAttribute("href", "#projects");
    expect(links[4]).toHaveAttribute("aria-current", "true");
    expect(links[0]).not.toHaveAttribute("aria-current");
  });

  it("folds the list with Escape and gives focus back to the toggle", () => {
    renderNav();
    fireEvent.click(toggle());
    fireEvent.keyDown(toggle(), { key: "Escape" });
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(toggle()).toHaveFocus();
  });

  it("routes to the Labs outside the section anchors", () => {
    renderNav();
    expect(screen.getByRole("link", { name: "Labs" })).toHaveAttribute("href", "/labs");
  });
});
