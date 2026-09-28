import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { projects } from "../../data/projects-data";
import { ProjectMonitor } from "./project-monitor.component";

function renderMonitor() {
  const router = createMemoryRouter([
    { path: "/", element: <ProjectMonitor projects={projects} isOnScreen={false} /> },
  ]);
  return render(<RouterProvider router={router} />);
}

const press = (element: Element, pointerType: "mouse" | "touch") => {
  const init = { pointerType, pointerId: 1, isPrimary: true, button: 0, width: 1, height: 1 };
  fireEvent.pointerDown(element, init);
  fireEvent.pointerUp(element, init);
  fireEvent.click(element, { detail: 1 });
};

const rowTitles = () =>
  within(screen.getByRole("grid", { name: "Projects" }))
    .getAllByRole("row")
    .map((row) => within(row).getByRole("link").textContent);

describe("ProjectMonitor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lists every project newest first, with the newest selected", () => {
    renderMonitor();
    expect(rowTitles()).toEqual([
      "My website",
      "Treashunt",
      "Commun'île",
      "Procedural Maps",
      "Nzoth",
      "Lonestone Boilerplate",
    ]);
    const [first] = screen.getAllByRole("row");
    expect(first).toHaveAttribute("aria-selected", "true");
  });

  it("prints the uptime placeholder until the client ticks", () => {
    renderMonitor();
    expect(screen.getByText("UP --:--:--")).toBeInTheDocument();
  });

  it("sorts by a column and flips it on a second press", () => {
    renderMonitor();
    fireEvent.click(screen.getByRole("button", { name: "Sort by name" }));
    expect(rowTitles()[0]).toBe("Commun'île");
    fireEvent.click(screen.getByRole("button", { name: "Sort by name, ascending" }));
    expect(rowTitles()[0]).toBe("Treashunt");
  });

  it("moves the selection with the key bar", () => {
    renderMonitor();
    fireEvent.click(screen.getByRole("button", { name: "Next project" }));
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("link", { name: "Open Treashunt" })).toHaveAttribute(
      "href",
      "https://treashunt.com",
    );
  });

  it("selects nothing on hover", () => {
    renderMonitor();
    const rows = screen.getAllByRole("row");
    fireEvent.pointerOver(rows[2], { pointerType: "mouse" });
    fireEvent.pointerEnter(rows[2], { pointerType: "mouse" });
    expect(rows[0]).toHaveAttribute("aria-selected", "true");
    expect(rows[2]).toHaveAttribute("aria-selected", "false");
  });

  it("selects a row on a click and on a tap, without opening it", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderMonitor();
    press(screen.getAllByRole("row")[2], "mouse");
    expect(screen.getAllByRole("row")[2]).toHaveAttribute("aria-selected", "true");
    press(screen.getAllByRole("row")[3], "touch");
    expect(screen.getAllByRole("row")[3]).toHaveAttribute("aria-selected", "true");
    expect(open).not.toHaveBeenCalled();
  });
});
