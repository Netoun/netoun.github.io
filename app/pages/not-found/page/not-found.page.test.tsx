import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NotFoundPage from "./not-found.page";

// Every draw is the example (42 10 32 8 19), whose solutions are known.
vi.mock("../data/not-found-puzzle", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../data/not-found-puzzle")>();
  const solutions = actual.fullSolutions(actual.FALLBACK_NUMBERS);
  return {
    ...actual,
    createPuzzle: () => ({ numbers: [...actual.FALLBACK_NUMBERS], solutions }),
  };
});

function renderPage(path = "/old/post") {
  const router = createMemoryRouter([{ path: "*", element: <NotFoundPage /> }], {
    initialEntries: [path],
  });
  return render(<RouterProvider router={router} />);
}

const press = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

describe("NotFoundPage", () => {
  beforeEach(() => {
    // Reduced motion: the console prints the whole run at once.
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener() {},
          removeEventListener() {},
        }) as unknown as MediaQueryList,
    );
  });
  afterEach(() => vi.restoreAllMocks());

  it("stays a 404 first: the title, the address, the ways back", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByText("/old/post", { selector: "code" })).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Ways back" });
    expect(within(nav).getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
  });

  it("plugs a spare into the first free bay of its kind, and ejects it", () => {
    renderPage();
    const spares = screen.getByRole("toolbar", { name: "Spares" });
    expect(within(spares).getAllByRole("button")).toHaveLength(9);
    press("Plug 32");
    expect(screen.queryByRole("button", { name: "Plug 32" })).toBeNull();
    press("Eject 32 from U1");
    expect(screen.getByRole("button", { name: "Plug 32" })).toBeInTheDocument();
  });

  it("announces the run's result in words", () => {
    renderPage();
    for (const name of [
      "Plug 32",
      "Plug subtraction",
      "Plug 8",
      "Plug multiplication",
      "Plug 19",
      "Plug subtraction",
      "Plug 42",
      "Plug subtraction",
      "Plug 10",
    ]) {
      press(name);
    }
    press("Power on");
    expect(screen.getByText("404 reached in 1 try: the count is right.")).toBeInTheDocument();
  });

  it("says how far a miss landed", () => {
    renderPage();
    press("Plug 42");
    press("Plug multiplication");
    press("Plug 10");
    press("Power on");
    expect(
      screen.getByText(
        "Try 1: 0 in the right bay, 3 elsewhere, 0 not in the solution. The server reached 420, 16 over 404.",
      ),
    ).toBeInTheDocument();
  });

  it("names a fault and where it happened", () => {
    renderPage();
    press("Plug 42");
    press("Plug division");
    press("Plug 8");
    press("Power on");
    expect(
      screen.getByText(
        "Try 1: 1 in the right bay, 1 elsewhere, 1 not in the solution. Stopped at U3: EDIV 42 ÷ 8 is not whole.",
      ),
    ).toBeInTheDocument();
    // The spare the solution does not use says so.
    expect(
      screen.getByRole("button", { name: "Plug division, not in the solution" }),
    ).toBeInTheDocument();
  });
});
