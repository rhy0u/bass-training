import type { Meta, StoryObj } from "@storybook/react";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from ".";
import { Button } from "../button";

/**
 * Modal dialog with backdrop overlay.
 *
 * Compound component: `DialogRoot`, `DialogTrigger`, `DialogPortal`,
 * `DialogBackdrop`, `DialogPopup`, `DialogTitle`, `DialogDescription`,
 * `DialogClose`.
 *
 * `DialogTrigger` and `DialogClose` have built-in `variant` and `size` props.
 */
const meta: Meta = {
  title: "Components/Dialog",
};
export default meta;

type Story = StoryObj;

/** Standard confirmation dialog. */
export const Default: Story = {
  render: () => (
    <DialogRoot>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a dialog description. It provides more context about the action.
          </DialogDescription>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
            }}
          >
            <DialogClose>Cancel</DialogClose>
            <DialogClose variant="solid">Confirm</DialogClose>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  ),
};

/** Dialog using the render prop for custom trigger. */
export const CustomTrigger: Story = {
  render: () => (
    <DialogRoot>
      <DialogTrigger render={<Button variant="outline">Custom Trigger</Button>} />
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Custom Trigger Dialog</DialogTitle>
          <DialogDescription>Opened with a custom-rendered trigger button.</DialogDescription>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <DialogClose>Close</DialogClose>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  ),
};
