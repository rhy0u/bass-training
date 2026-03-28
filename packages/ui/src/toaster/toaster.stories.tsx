import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "./index";

/**
 * Toast notifications provide brief, non-intrusive feedback about an action.
 *
 * Built on **Base UI Toast** primitives, wired through a shared `toastManager`.
 *
 * | Type      | Style                                |
 * | --------- | ------------------------------------ |
 * | `default` | Neutral (border-border, bg-surface)  |
 * | `success` | Green accent                         |
 * | `error`   | Red accent                           |
 *
 * ## Usage
 *
 * ```tsx
 * import { Toaster, toast } from "@bass-training/ui/toaster";
 *
 * // Mount once at root
 * <Toaster />
 *
 * // Trigger from anywhere
 * toast("Saved!", { description: "Your changes are saved.", type: "success" });
 * ```
 */
const meta: Meta<typeof Toaster> = {
  title: "Components/Toaster",
  component: Toaster,
  decorators: [
    (Story) => (
      <div className="flex min-h-75 items-center justify-center gap-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <button
        className="rounded bg-foreground px-4 py-2 text-sm text-surface"
        onClick={() => toast("Hello!", { description: "This is a default toast." })}
      >
        Show toast
      </button>
    </>
  ),
};

export const Success: Story = {
  render: () => (
    <>
      <Toaster />
      <button
        className="rounded bg-green-600 px-4 py-2 text-sm text-white"
        onClick={() =>
          toast("Saved!", { description: "Your changes have been saved.", type: "success" })
        }
      >
        Show success toast
      </button>
    </>
  ),
};

export const Error: Story = {
  render: () => (
    <>
      <Toaster />
      <button
        className="rounded bg-red-600 px-4 py-2 text-sm text-white"
        onClick={() => toast("Error", { description: "Something went wrong.", type: "error" })}
      >
        Show error toast
      </button>
    </>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex gap-2">
        <button
          className="rounded bg-foreground px-4 py-2 text-sm text-surface"
          onClick={() => toast("Info", { description: "Default toast" })}
        >
          Default
        </button>
        <button
          className="rounded bg-green-600 px-4 py-2 text-sm text-white"
          onClick={() => toast("Done!", { description: "Success toast", type: "success" })}
        >
          Success
        </button>
        <button
          className="rounded bg-red-600 px-4 py-2 text-sm text-white"
          onClick={() => toast("Oops", { description: "Error toast", type: "error" })}
        >
          Error
        </button>
      </div>
    </>
  ),
};
