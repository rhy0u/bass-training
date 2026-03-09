import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "./index";

const meta: Meta<typeof Toaster> = {
  title: "Toaster",
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
