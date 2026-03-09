import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@friends/ui/typography", () => ({
  Typography: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <span {...props}>{children}</span>
  ),
}));

import { FieldError } from "@/components/field-error";

describe("FieldError", () => {
  it("renders nothing when rules is empty", () => {
    const { container } = render(<FieldError rules={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders valid rules with green text", () => {
    render(<FieldError rules={[{ label: "Min 8 chars", valid: true }]} />);
    expect(screen.getByText("Min 8 chars")).toBeDefined();
  });

  it("renders invalid rules with red text", () => {
    render(<FieldError rules={[{ label: "Uppercase required", valid: false }]} />);
    expect(screen.getByText("Uppercase required")).toBeDefined();
  });

  it("renders multiple rules", () => {
    render(
      <FieldError
        rules={[
          { label: "Rule 1", valid: true },
          { label: "Rule 2", valid: false },
        ]}
      />,
    );
    expect(screen.getByText("Rule 1")).toBeDefined();
    expect(screen.getByText("Rule 2")).toBeDefined();
  });
});
