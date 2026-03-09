import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSearchUsers = vi.fn();
vi.mock("@/app/actions/groups", () => ({
  searchUsers: (...args: unknown[]) => mockSearchUsers(...args),
}));

vi.mock("@friends/ui/avatar", () => ({
  Avatar: ({ fallback: _fallback }: { fallback: string }) => <div data-testid="avatar" />,
}));

vi.mock("@friends/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input data-testid="autocomplete-input" {...props} />
  ),
}));

vi.mock("@friends/ui/typography", () => ({
  Typography: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
}));

import { UserAutocomplete } from "@/components/user-autocomplete";

describe("UserAutocomplete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input", () => {
    const onSelect = vi.fn();
    render(<UserAutocomplete onSelect={onSelect} placeholder="Search users" />);
    expect(screen.getByTestId("autocomplete-input")).toBeDefined();
  });

  it("does not search when query is too short", async () => {
    const onSelect = vi.fn();
    render(<UserAutocomplete onSelect={onSelect} />);
    const input = screen.getByTestId("autocomplete-input");

    await act(async () => {
      fireEvent.change(input, { target: { value: "a" } });
    });

    // Wait longer than debounce (300ms)
    await new Promise((r) => setTimeout(r, 400));

    expect(mockSearchUsers).not.toHaveBeenCalled();
  });

  it("searches users after debounce", async () => {
    mockSearchUsers.mockResolvedValue([
      { id: "u1", name: "Alice", email: "alice@test.com", avatar: null },
    ]);
    const onSelect = vi.fn();
    render(<UserAutocomplete onSelect={onSelect} />);
    const input = screen.getByTestId("autocomplete-input");

    await act(async () => {
      fireEvent.change(input, { target: { value: "alice" } });
    });

    await waitFor(() => {
      expect(mockSearchUsers).toHaveBeenCalledWith("alice", undefined);
    });
  });

  it("calls onSelect when a result is clicked", async () => {
    mockSearchUsers.mockResolvedValue([
      { id: "u1", name: "Alice", email: "alice@test.com", avatar: null },
    ]);
    const onSelect = vi.fn();
    render(<UserAutocomplete onSelect={onSelect} />);
    const input = screen.getByTestId("autocomplete-input");

    await act(async () => {
      fireEvent.change(input, { target: { value: "alice" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeDefined();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Alice"));
    });

    expect(onSelect).toHaveBeenCalledWith("u1");
  });

  it("closes dropdown on clicking outside", async () => {
    mockSearchUsers.mockResolvedValue([
      { id: "u1", name: "Bob", email: "bob@test.com", avatar: null },
    ]);
    const onSelect = vi.fn();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <UserAutocomplete onSelect={onSelect} />
      </div>,
    );
    const input = screen.getByTestId("autocomplete-input");

    await act(async () => {
      fireEvent.change(input, { target: { value: "bob" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeDefined();
    });

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId("outside"));
    });

    expect(screen.queryByText("Bob")).toBeNull();
  });

  it("re-opens dropdown on focus when results exist", async () => {
    mockSearchUsers.mockResolvedValue([
      { id: "u1", name: "Charlie", email: "charlie@test.com", avatar: null },
    ]);
    const onSelect = vi.fn();
    render(<UserAutocomplete onSelect={onSelect} />);
    const input = screen.getByTestId("autocomplete-input");

    await act(async () => {
      fireEvent.change(input, { target: { value: "charlie" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Charlie")).toBeDefined();
    });

    // Close by clicking outside
    await act(async () => {
      fireEvent.mouseDown(document.body);
    });

    // Re-open on focus
    await act(async () => {
      fireEvent.focus(input);
    });

    expect(screen.getByText("Charlie")).toBeDefined();
  });

  it("shows user with null name using email as fallback", async () => {
    mockSearchUsers.mockResolvedValue([
      { id: "u1", name: null, email: "no-name@test.com", avatar: null },
    ]);
    const onSelect = vi.fn();
    render(<UserAutocomplete onSelect={onSelect} />);
    const input = screen.getByTestId("autocomplete-input");

    await act(async () => {
      fireEvent.change(input, { target: { value: "no-name" } });
    });

    await waitFor(() => {
      expect(screen.getAllByText("no-name@test.com").length).toBeGreaterThan(0);
    });
  });

  it("passes excludeGroupId to searchUsers", async () => {
    mockSearchUsers.mockResolvedValue([]);
    const onSelect = vi.fn();
    render(<UserAutocomplete onSelect={onSelect} excludeGroupId="g1" />);
    const input = screen.getByTestId("autocomplete-input");

    await act(async () => {
      fireEvent.change(input, { target: { value: "test" } });
    });

    await waitFor(() => {
      expect(mockSearchUsers).toHaveBeenCalledWith("test", "g1");
    });
  });
});
