import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
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
    expect(screen.getByRole("link", { name: "github.com/lonestone/nzoth ↗" })).toHaveAttribute(
      "href",
      "https://github.com/lonestone/nzoth",
    );
    expect(screen.getByRole("link", { name: "netoun@proton.me" })).toHaveAttribute(
      "href",
      "mailto:netoun@proton.me",
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
