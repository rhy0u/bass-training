import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from ".";

/**
 * Checkbox with optional label.
 *
 * Built on Base UI Checkbox. Includes a styled check icon indicator
 * with brand color when checked.
 */
const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    label: { description: "Text label displayed next to the checkbox", control: "text" },
    disabled: { description: "Disables the checkbox", control: "boolean" },
    defaultChecked: { description: "Initial checked state", control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: "Accept terms" },
};

export const Checked: Story = {
  args: { label: "Checked", defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: "Disabled", disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: "Disabled checked", disabled: true, defaultChecked: true },
};

export const WithoutLabel: Story = {
  args: { defaultChecked: false },
};
