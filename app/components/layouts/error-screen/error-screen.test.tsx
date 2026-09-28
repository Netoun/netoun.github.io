import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { ErrorScreen } from "./error-screen.component";

function renderScreen() {
  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <ErrorScreen
          code="404"
          title="Page not found"
          command="cd /old"
          output="cd: no such file or directory: /old"
          links={[
            { label: "Back home", to: "/" },
            { label: "Labs", to: "/labs/" },
          ]}
        >
          <p>Nothing lives at /old.</p>
        </ErrorScreen>
      ),
    },
  ]);
  return render(<RouterProvider router={router} />);
}

describe("ErrorScreen", () => {
  it("titles the page and says what failed in words", () => {
    renderScreen();
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByText("Nothing lives at /old.")).toBeInTheDocument();
  });

  it("keeps the terminal for the eye only", () => {
    renderScreen();
    expect(screen.getByText("cd /old").closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("names the ways back without their terminal marks", () => {
    renderScreen();
    const nav = screen.getByRole("navigation", { name: "Ways back" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Labs" })).toHaveAttribute("href", "/labs/");
  });
});
