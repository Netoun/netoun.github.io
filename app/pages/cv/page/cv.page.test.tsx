import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { toAddress } from "@/features/projects/data/project-processes";
import { projects } from "@/features/projects/data/projects-data";
import { contactLinks } from "@/features/site/data/contact-links.data";
import CvPage, { meta } from "./cv.page";

function renderPage() {
  const router = createMemoryRouter([{ path: "/cv/", element: <CvPage /> }], {
    initialEntries: ["/cv/"],
  });
  return render(<RouterProvider router={router} />);
}

describe("CvPage", () => {
  it("prints one sheet: the name, then the home's sections, without the Labs", () => {
    renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Nicolas Coulonnier");
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(["Experience", "Projects", "Stack", "Agents & LLM", "Education"]);
  });

  it("reads the work log, the projects and the contacts from the site's data", () => {
    renderPage();
    const experience = screen.getByRole("region", { name: "Experience" });
    expect(within(experience).getByText("Lonestone")).toBeInTheDocument();
    expect(within(experience).getByText(/more client work, not listed/)).toBeInTheDocument();
    expect(
      within(experience).getByText(/corporate websites, e\.g\. Desoutter/),
    ).toBeInTheDocument();
    const [project] = projects;
    if (!project) throw new Error("no project");
    expect(screen.getByRole("link", { name: `${toAddress(project.url)} ↗` })).toHaveAttribute(
      "href",
      project.url,
    );
    const mail = contactLinks.find((link) => link.url.startsWith("mailto:"));
    if (!mail) throw new Error("no mail link");
    expect(screen.getByRole("link", { name: mail.url.slice("mailto:".length) })).toHaveAttribute(
      "href",
      mail.url,
    );
  });

  it("offers the PDF and the way home, and stays out of search", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /download pdf/i })).toHaveAttribute(
      "href",
      "/nicolas-coulonnier-cv.pdf",
    );
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumb).getByRole("link", { name: "netoun.com" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(meta()).toContainEqual({ name: "robots", content: "noindex, follow" });
  });
});
