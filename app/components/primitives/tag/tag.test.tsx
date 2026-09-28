import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag } from "./tag.component";

describe("Tag", () => {
  it("prints its mark before the label, hidden from assistive tech", () => {
    render(<Tag mark="+">React</Tag>);
    const tag = screen.getByText("React");
    expect(tag).toHaveTextContent("+React");
    expect(screen.getByText("+")).toHaveAttribute("aria-hidden", "true");
  });

  it("prints the label alone without a mark", () => {
    render(<Tag>React</Tag>);
    expect(screen.getByText("React").children).toHaveLength(0);
  });
});
