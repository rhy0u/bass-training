import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../button";
import { ConfirmDialog, ConfirmDialogProps } from "./index";

/**
 * A pre-composed confirmation dialog for destructive or important actions.
 *
 * Built on top of the `Dialog` compound components, it provides a ready-to-use
 * confirm/cancel UI with an optional **danger** variant for destructive actions.
 *
 * | Prop            | Type                          | Default     | Description                          |
 * | --------------- | ----------------------------- | ----------- | ------------------------------------ |
 * | `open`          | `boolean`                     | —           | Controls dialog visibility           |
 * | `onOpenChange`  | `(open: boolean) => void`     | —           | Called when open state changes        |
 * | `title`         | `ReactNode`                   | —           | Dialog heading                       |
 * | `description`   | `ReactNode`                   | —           | Explanatory body text                |
 * | `cancelLabel`   | `string`                      | —           | Cancel button label                  |
 * | `confirmLabel`  | `string`                      | —           | Confirm button label                 |
 * | `onConfirm`     | `() => void`                  | —           | Called when confirm is clicked        |
 * | `variant`       | `"default" \| "danger"`       | `"default"` | Visual style of the confirm button   |
 *
 * ## Usage
 *
 * ```tsx
 * import { ConfirmDialog } from "@boilerplate/ui/confirm-dialog";
 *
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Delete item?"
 *   description="This action cannot be undone."
 *   cancelLabel="Cancel"
 *   confirmLabel="Delete"
 *   onConfirm={handleDelete}
 *   variant="danger"
 * />
 * ```
 */
const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "danger"],
      description: "Visual style of the confirm button.",
    },
    title: { control: "text", description: "Dialog heading." },
    description: { control: "text", description: "Explanatory body text." },
    cancelLabel: { control: "text", description: "Cancel button label." },
    confirmLabel: { control: "text", description: "Confirm button label." },
  },
};
export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

function ConfirmDialogDemo(props: Partial<ConfirmDialogProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Are you sure?"
        description="This action cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        onConfirm={() => setOpen(false)}
        {...props}
      />
    </>
  );
}

/** Default confirmation dialog with neutral styling. */
export const Default: Story = {
  render: () => <ConfirmDialogDemo />,
};

/** Danger variant with a red confirm button, suited for destructive actions. */
export const Danger: Story = {
  render: () => (
    <ConfirmDialogDemo
      variant="danger"
      title="Delete group?"
      description="All members will be removed. This cannot be undone."
      confirmLabel="Delete"
    />
  ),
};
