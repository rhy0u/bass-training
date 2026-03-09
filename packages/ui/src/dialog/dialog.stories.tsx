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

const meta: Meta = {
  title: "Components/Dialog",
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DialogRoot>
      <DialogTrigger render={<Button>Open Dialog</Button>} />
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
            <DialogClose render={<Button variant="ghost">Cancel</Button>} />
            <DialogClose render={<Button>Confirm</Button>} />
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  ),
};
