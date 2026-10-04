import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { Footer, type FooterStatus } from "./footer.component";

const LINKS = [
  { label: "GitHub", url: "https://github.com/netoun" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/nicolas-coulonnier-66416813b/" },
  { label: "Email", url: "mailto:netoun@proton.me" },
];

const STATUS: FooterStatus = {
  host: "netoun.com",
  routes: 12,
  buildDate: "2026-09-28",
  commit: "025f62c",
  sourceUrl: "https://github.com/netoun/netoun.github.io",
};

const RESUME = {
  href: "/nicolas-coulonnier-cv.pdf",
  label: "CV · résumé",
  format: "A4",
  detail: "One page, printed from this site's data",
};

function renderFooter(file?: typeof RESUME) {
  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <Footer
          id="contact"
          links={LINKS}
          labs={{ href: "/labs/", count: 10 }}
          rackLabHref="/labs/server-unit-3d/"
          status={STATUS}
          file={file}
        />
      ),
    },
  ]);
  return render(<RouterProvider router={router} />);
}

const pluggedJack = (container: HTMLElement) =>
  container
    .querySelector('[data-server-jack][data-plugged="true"]')
    ?.getAttribute("data-server-jack");

describe("Footer", () => {
  it("heads the contact block with an h2 and prints every address as text", () => {
    renderFooter();
    expect(screen.getByRole("heading", { level: 2, name: "Establish link" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub github\.com\/netoun/ })).toHaveAttribute(
      "href",
      "https://github.com/netoun",
    );
    expect(screen.getByText("linkedin.com/in/nicolas-coulonnier-66416813b")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Email netoun@proton\.me/ })).toHaveAttribute(
      "href",
      "mailto:netoun@proton.me",
    );
  });

  it("opens external links in a new tab, never the mailto", () => {
    renderFooter();
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /Email/ })).not.toHaveAttribute("target");
  });

  it("rests the plug in the email jack and moves it to the port being pointed at", () => {
    const { container } = renderFooter();
    expect(pluggedJack(container)).toBe("port-3");

    const github = screen.getByRole("link", { name: /GitHub/ });
    fireEvent.pointerEnter(github);
    expect(pluggedJack(container)).toBe("port-1");
    expect(github).toHaveAttribute("data-plugged", "true");

    fireEvent.pointerLeave(github);
    expect(pluggedJack(container)).toBe("port-3");
  });

  it("follows keyboard focus too", () => {
    const { container } = renderFooter();
    fireEvent.focus(screen.getByRole("link", { name: /LinkedIn/ }));
    expect(pluggedJack(container)).toBe("port-2");
  });

  it("links the Labs uplink with the registry count and captions the rack's Lab", () => {
    renderFooter();
    expect(
      screen.getByRole("link", { name: /10 experiments, live with their source/ }),
    ).toHaveAttribute("href", "/labs/");
    expect(
      screen.getByRole("link", {
        name: "/labs/server-unit-3d — the server rack, live with its source",
      }),
    ).toHaveAttribute("href", "/labs/server-unit-3d/");
  });

  it("prints the build facts and takes the copyright year from the build", () => {
    const { container } = renderFooter();
    const footer = within(container);
    expect(
      footer.getByText("NETOUN.COM · 12 ROUTES PRERENDERED · BUILD 2026-09-28 · 025F62C"),
    ).toBeInTheDocument();
    expect(footer.getByText("© 2026 Netoun. All rights reserved.")).toBeInTheDocument();
    expect(footer.getByRole("link", { name: /Source/ })).toHaveAttribute(
      "href",
      "https://github.com/netoun/netoun.github.io",
    );
  });

  it("drops the commit when the build does not know it", () => {
    const router = createMemoryRouter([
      {
        path: "/",
        element: (
          <Footer
            links={LINKS}
            labs={{ href: "/labs/", count: 10 }}
            rackLabHref="/labs/server-unit-3d/"
            status={{ ...STATUS, commit: "" }}
          />
        ),
      },
    ]);
    render(<RouterProvider router={router} />);
    expect(
      screen.getByText("NETOUN.COM · 12 ROUTES PRERENDERED · BUILD 2026-09-28"),
    ).toBeInTheDocument();
  });

  it("hands over the résumé under the uplink only when the page has it", () => {
    renderFooter();
    expect(screen.queryByRole("link", { name: /CV · résumé/ })).not.toBeInTheDocument();
    renderFooter(RESUME);
    const file = screen.getByRole("link", { name: /CV · résumé One page/ });
    expect(file).toHaveAttribute("href", "/nicolas-coulonnier-cv.pdf");
    expect(file).toHaveAttribute("download");
  });
});
