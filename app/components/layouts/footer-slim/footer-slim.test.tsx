import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FooterStatus } from "../footer/footer.component";
import { FooterSlim } from "./footer-slim.component";

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

const pluggedPort = () =>
  screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("data-plugged") === "true")
    .map((link) => link.getAttribute("href"));

describe("FooterSlim", () => {
  it("heads the contact line with an h2 and links every address", () => {
    render(<FooterSlim links={LINKS} status={STATUS} />);
    expect(screen.getByRole("heading", { level: 2, name: "Establish link" })).toBeInTheDocument();
    const contact = within(screen.getByRole("list", { name: "Contact" }));
    expect(contact.getByRole("link", { name: /GitHub github\.com\/netoun/ })).toHaveAttribute(
      "href",
      "https://github.com/netoun",
    );
    expect(
      contact.getByRole("link", { name: /LinkedIn linkedin\.com\/in\/nicolas-coulonnier/ }),
    ).toHaveAttribute("href", "https://www.linkedin.com/in/nicolas-coulonnier-66416813b/");
    expect(contact.getByRole("link", { name: /Email netoun@proton\.me/ })).toHaveAttribute(
      "href",
      "mailto:netoun@proton.me",
    );
  });

  it("opens external links in a new tab, never the mailto", () => {
    render(<FooterSlim links={LINKS} status={STATUS} />);
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: /Email/ })).not.toHaveAttribute("target");
  });

  it("rests the plug in the email port and moves it to the port being pointed at", () => {
    render(<FooterSlim links={LINKS} status={STATUS} />);
    expect(pluggedPort()).toEqual(["mailto:netoun@proton.me"]);

    const github = screen.getByRole("link", { name: /GitHub/ });
    fireEvent.pointerEnter(github);
    expect(pluggedPort()).toEqual(["https://github.com/netoun"]);

    fireEvent.pointerLeave(github);
    expect(pluggedPort()).toEqual(["mailto:netoun@proton.me"]);
  });

  it("follows keyboard focus too", () => {
    render(<FooterSlim links={LINKS} status={STATUS} />);
    const linkedin = screen.getByRole("link", { name: /LinkedIn/ });
    fireEvent.focus(linkedin);
    expect(linkedin).toHaveAttribute("data-plugged", "true");
    fireEvent.blur(linkedin);
    expect(pluggedPort()).toEqual(["mailto:netoun@proton.me"]);
  });

  it("closes on the status strip with the build facts", () => {
    render(<FooterSlim links={LINKS} status={STATUS} />);
    expect(
      screen.getByText("NETOUN.COM · 12 ROUTES PRERENDERED · BUILD 2026-09-28 · 025F62C"),
    ).toBeInTheDocument();
    expect(screen.getByText("© 2026 Netoun. All rights reserved.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Source/ })).toHaveAttribute(
      "href",
      "https://github.com/netoun/netoun.github.io",
    );
  });
});
