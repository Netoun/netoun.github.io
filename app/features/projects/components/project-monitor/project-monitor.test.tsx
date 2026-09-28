import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { projects } from "../../data/projects-data";
import { ProjectMonitor } from "./project-monitor.component";

function renderMonitor() {
  const router = createMemoryRouter([
    { path: "/", element: <ProjectMonitor projects={projects} isOnScreen={false} /> },
  ]);
  return render(<RouterProvider router={router} />);
}

const rowTitles = () =>
  within(screen.getByRole("grid", { name: "Projects" }))
    .getAllByRole("row")
    .map((row) => within(row).getByRole("link").textContent);

describe("ProjectMonitor", () => {
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
});
