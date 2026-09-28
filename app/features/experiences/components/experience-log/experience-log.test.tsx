import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { logSummary, toBranches, toLogGroups } from "../../data/experience-log";
import { experiences } from "../../data/experiences-data";
import { ExperienceLog } from "./experience-log.component";

const NOW = "2026-09";

function renderLog(litBranch: string | null = null, onLitBranchChange = vi.fn()) {
  const branches = toBranches(experiences, NOW);
  render(
    <ExperienceLog
      groups={toLogGroups(branches)}
      summary={logSummary(branches, NOW)}
      litBranch={litBranch}
      onLitBranchChange={onLitBranchChange}
    />,
  );
  return onLitBranchChange;
}

describe("ExperienceLog", () => {
  it("gives every employer an h3, newest first, and its projects an h4", () => {
    renderLog();
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Lonestone",
      "Easilys",
      "Sogeti",
    ]);
    expect(screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual([
      "Desoutter",
      "Cuevr",
      "Mon Rét@b' d'abord",
    ]);
  });

  it("prints periods and computed tenures", () => {
    renderLog();
    const history = screen.getByRole("list", { name: "Work history, newest first" });
    expect(within(history).getByText(/5Y 2M/)).toBeInTheDocument();
    expect(within(history).getByText(/1Y 10M/)).toBeInTheDocument();
    expect(screen.getByText("SEP 2017").closest("time")).toHaveAttribute("dateTime", "2017-09");
    expect(screen.getByText("SINCE SEP 2017 · 9Y")).toBeInTheDocument();
  });

  it("elides the unlisted client work without a count", () => {
    renderLog();
    const projects = screen.getByRole("list", { name: "Client projects at Lonestone" });
    // Printed right under the listed projects, inside Lonestone's branch.
    const lonestone = projects.closest("li");
    expect(lonestone).not.toBeNull();
    expect(
      within(lonestone as HTMLElement).getByText(/more client work, not listed/),
    ).toBeVisible();
    expect(projects.children).toHaveLength(3);
    expect(screen.queryByText(/and many more/)).not.toBeInTheDocument();
  });

  it("keeps git's own lines out of the accessibility tree", () => {
    renderLog();
    expect(screen.queryByRole("heading", { name: /Merge branch/ })).not.toBeInTheDocument();
    expect(screen.getByText("Initial commit").closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("filters to a branch from its ref pill, under a mouse pointer only", () => {
    const onLitBranchChange = renderLog();
    const [lonestone] = within(
      screen.getByRole("list", { name: "Work history, newest first" }),
    ).getAllByRole("listitem");
    // The group fills the screen: a mouse resting on it while the page scrolls filters nothing.
    fireEvent.pointerMove(lonestone, { pointerType: "mouse" });
    expect(onLitBranchChange).not.toHaveBeenCalled();
    const pills = screen.getByText("lonestone").closest("[aria-hidden='true']");
    expect(pills).not.toBeNull();
    fireEvent.pointerMove(pills as HTMLElement, { pointerType: "touch" });
    expect(onLitBranchChange).not.toHaveBeenCalled();
    fireEvent.pointerMove(pills as HTMLElement, { pointerType: "mouse" });
    expect(onLitBranchChange).toHaveBeenCalledWith("lonestone");
    fireEvent.pointerLeave(pills as HTMLElement, { pointerType: "mouse" });
    expect(onLitBranchChange).toHaveBeenLastCalledWith(null);
  });

  it("ignores the pointer while the page scrolls", () => {
    const onLitBranchChange = renderLog();
    const pills = screen.getByText("lonestone").closest("[aria-hidden='true']");
    fireEvent.scroll(window);
    fireEvent.pointerMove(pills as HTMLElement, { pointerType: "mouse" });
    expect(onLitBranchChange).not.toHaveBeenCalled();
  });

  it("fades the other branches while one is lit", () => {
    renderLog("easilys");
    const groups = within(
      screen.getByRole("list", { name: "Work history, newest first" }),
    ).getAllByRole("listitem");
    const dimmed = groups.filter((group) => group.parentElement?.tagName === "OL");
    expect(dimmed.map((group) => group.hasAttribute("data-dimmed"))).toEqual([true, false, true]);
  });
});
