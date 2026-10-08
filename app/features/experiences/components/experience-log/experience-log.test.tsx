import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { logSummary, toBranches, toLogGroups } from "../../data/experience-log";
import { experiences } from "../../data/experiences-data";
import { ExperienceLog } from "./experience-log.component";

const NOW = "2026-09";
const NEWEST_FIRST = experiences.toSorted((a, b) => b.start.localeCompare(a.start));

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

function lonestonePills(): HTMLElement {
  const pills = screen.getByText("lonestone").closest("[aria-hidden='true']");
  if (!(pills instanceof HTMLElement)) throw new Error("Lonestone ref pills not found");
  return pills;
}

describe("ExperienceLog", () => {
  it("gives every employer an h3, newest first, and its projects an h4", () => {
    renderLog();
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(
      NEWEST_FIRST.map((e) => e.company),
    );
    expect(screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual(
      NEWEST_FIRST.flatMap((e) => e.projects.map((p) => p.title)),
    );
  });

  it("prints periods and computed tenures", () => {
    renderLog();
    const branches = toBranches(experiences, NOW);
    const summary = logSummary(branches, NOW);
    const history = screen.getByRole("list", { name: "Work history, newest first" });
    for (const branch of branches) {
      expect(within(history).getAllByText(new RegExp(branch.duration)).length).toBeGreaterThan(0);
    }
    const oldest = branches[branches.length - 1];
    if (!oldest) throw new Error("No work history branches");
    expect(screen.getByText(oldest.startLabel).closest("time")).toHaveAttribute(
      "dateTime",
      oldest.start,
    );
    expect(screen.getByText(`SINCE ${summary.since} · ${summary.total}`)).toBeInTheDocument();
  });

  it("elides the unlisted client work without a count", () => {
    renderLog();
    const branches = toBranches(experiences, NOW);
    const lonestoneBranch = branches.find((b) => b.slug === "lonestone");
    if (!lonestoneBranch) throw new Error("Lonestone branch not found in work history");
    const projects = screen.getByRole("list", { name: "Client projects at Lonestone" });
    // Printed right under the listed projects, inside Lonestone's branch.
    const lonestone = projects.closest("li");
    if (!lonestone) throw new Error("Lonestone branch not found");
    expect(within(lonestone).getByText(/more client work, not listed/)).toBeVisible();
    expect(projects.children).toHaveLength(lonestoneBranch.commits.length);
    expect(screen.queryByText(/and many more/)).not.toBeInTheDocument();
  });

  it("keeps git's own lines out of the accessibility tree", () => {
    renderLog();
    screen
      .getAllByText(/Merge branch/)
      .forEach((el) => expect(el.closest("[aria-hidden='true']")).not.toBeNull());
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
    const pills = lonestonePills();
    fireEvent.pointerMove(pills, { pointerType: "touch" });
    expect(onLitBranchChange).not.toHaveBeenCalled();
    fireEvent.pointerMove(pills, { pointerType: "mouse" });
    expect(onLitBranchChange).toHaveBeenCalledWith("lonestone");
    fireEvent.pointerLeave(pills, { pointerType: "mouse" });
    expect(onLitBranchChange).toHaveBeenLastCalledWith(null);
  });

  it("ignores the pointer while the page scrolls", () => {
    const onLitBranchChange = renderLog();
    const pills = lonestonePills();
    fireEvent.scroll(window);
    fireEvent.pointerMove(pills, { pointerType: "mouse" });
    expect(onLitBranchChange).not.toHaveBeenCalled();
  });

  it("fades the other branches while one is lit", () => {
    renderLog("easilys");
    const groups = within(
      screen.getByRole("list", { name: "Work history, newest first" }),
    ).getAllByRole("listitem");
    const employerGroups = groups.filter((group) => group.parentElement?.tagName === "OL");
    expect(employerGroups.map((group) => group.hasAttribute("data-dimmed"))).toEqual([
      true,
      false,
      true,
    ]);
  });
});
