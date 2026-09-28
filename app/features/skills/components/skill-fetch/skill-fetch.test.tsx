import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toStackGroups } from "../../data/skill-fetch";
import { PRACTICES } from "../../data/skills-data";
import type { EvidenceSource } from "../../data/skills-data.types";
import { SkillFetch } from "./skill-fetch.component";

const SOURCES: EvidenceSource[] = [
  { kind: "project", label: "Treashunt", tags: ["React", "Bun"] },
  { kind: "job", label: "Lonestone", tags: ["React", "NestJS"] },
];

function renderFetch() {
  const groups = toStackGroups(["React", "NestJS", "Vite"], SOURCES, {
    dependencies: ["react", "vite"],
    packageManager: "bun",
  });
  return render(
    <SkillFetch
      user="netoun"
      host="lonestone"
      lines={[
        { key: "Role", parts: [{ text: "Full-stack engineer", tone: "role" }] },
        {
          key: "Host",
          parts: [
            { text: "Lonestone", tone: "strong" },
            { text: " · Nantes, FR", tone: "muted" },
          ],
        },
      ]}
      practices={PRACTICES}
      groups={groups}
    />,
  );
}

describe("SkillFetch", () => {
  it("prints user@host over as many dashes as it has characters", () => {
    renderFetch();
    expect(screen.getByText("netoun")).toBeInTheDocument();
    expect(screen.getByText("----------------")).toBeInTheDocument();
    expect(screen.getByText("Full-stack engineer")).toBeInTheDocument();
    expect(screen.getByText("Lonestone").closest("dd")).toHaveTextContent("Lonestone · Nantes, FR");
  });

  it("lists every practice as a check in the practice card", () => {
    renderFetch();
    const card = screen.getByRole("region", { name: /practice/i });
    expect(within(card).getAllByRole("heading", { level: 4 })).toHaveLength(PRACTICES.length);
    expect(within(card).getByRole("link", { name: /AGENTS\.md/ })).toHaveAttribute(
      "href",
      "https://github.com/netoun/netoun.github.io/blob/main/AGENTS.md",
    );
  });

  it("gives every tool its receipt, spoken with its name", () => {
    renderFetch();
    const frontend = screen.getByRole("grid", { name: "Frontend tools" });
    expect(
      within(frontend).getByRole("row", {
        name: "React: 1 project: Treashunt · 1 job: Lonestone · this site's package.json (react)",
      }),
    ).toBeInTheDocument();
  });

  it("prints the picked tool's receipt under the stack", () => {
    renderFetch();
    expect(screen.getByText(/where it ships prints here/)).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("grid", { name: "Backend tools" })).getByRole("row"));
    expect(screen.getByText("NESTJS")).toBeInTheDocument();
    expect(screen.getAllByText("1 job: Lonestone")).not.toHaveLength(0);
  });
});
