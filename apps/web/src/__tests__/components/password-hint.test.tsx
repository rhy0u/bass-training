import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@bass-training/ui/typography", () => ({
  Typography: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <span {...props}>{children}</span>
  ),
}));

import { PasswordRulesDisplay, usePasswordRules } from "@/components/password-hint";

const translations = {
  hintMinLength: "Min 8 chars",
  hintUppercase: "Uppercase",
  hintLowercase: "Lowercase",
  hintNumber: "Number",
  hintSpecial: "Special char",
  confirmPasswordRequired: "Confirm password required",
  passwordsMismatch: "Passwords must match",
};

describe("usePasswordRules", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => usePasswordRules(translations));
    expect(result.current.password).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.submitted).toBe(false);
  });

  it("returns empty rules when not submitted and no password", () => {
    const { result } = renderHook(() => usePasswordRules(translations));
    expect(result.current.passwordRules()).toEqual([]);
    expect(result.current.confirmPasswordRules()).toEqual([]);
  });

  it("returns rules when submitted", () => {
    const { result } = renderHook(() => usePasswordRules(translations));
    act(() => result.current.setSubmitted(true));
    const rules = result.current.passwordRules();
    expect(rules).toHaveLength(5);
    expect(rules[0]).toEqual({ label: "Min 8 chars", valid: false });
  });

  it("returns rules when password is set", () => {
    const { result } = renderHook(() => usePasswordRules(translations));
    act(() => result.current.setPassword("Test123!"));
    const rules = result.current.passwordRules();
    expect(rules).toHaveLength(5);
    // "Test123!" is 8 chars, has upper, lower, number, special → all valid
    expect(rules.every((r) => r.valid)).toBe(true);
  });

  it("validates strong password", () => {
    const { result } = renderHook(() => usePasswordRules(translations));
    act(() => result.current.setPassword("StrongP1!"));
    const rules = result.current.passwordRules();
    expect(rules.every((r) => r.valid)).toBe(true);
  });

  it("validates confirm password", () => {
    const { result } = renderHook(() => usePasswordRules(translations));
    act(() => {
      result.current.setPassword("StrongP1!");
      result.current.setConfirmPassword("StrongP1!");
    });
    const rules = result.current.confirmPasswordRules();
    expect(rules).toHaveLength(2);
    expect(rules.every((r) => r.valid)).toBe(true);
  });

  it("shows mismatch when passwords differ", () => {
    const { result } = renderHook(() => usePasswordRules(translations));
    act(() => {
      result.current.setPassword("StrongP1!");
      result.current.setConfirmPassword("Different1!");
    });
    const rules = result.current.confirmPasswordRules();
    expect(rules.find((r) => r.label === "Passwords must match")?.valid).toBe(false);
  });

  it("returns empty confirm rules when submitted but no confirmPassword", () => {
    const { result } = renderHook(() => usePasswordRules(translations));
    act(() => result.current.setSubmitted(true));
    const rules = result.current.confirmPasswordRules();
    expect(rules).toHaveLength(1);
    expect(rules[0].valid).toBe(false);
  });
});

describe("PasswordRulesDisplay", () => {
  it("renders nothing when not submitted and no password", () => {
    const { container } = render(
      <PasswordRulesDisplay password="" submitted={false} translations={translations} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders rules when submitted", () => {
    render(<PasswordRulesDisplay password="" submitted={true} translations={translations} />);
    expect(screen.getByText("Min 8 chars")).toBeDefined();
  });

  it("renders all valid rules for strong password", () => {
    render(
      <PasswordRulesDisplay password="StrongP1!" submitted={true} translations={translations} />,
    );
    expect(screen.getByText("Min 8 chars")).toBeDefined();
  });
});
