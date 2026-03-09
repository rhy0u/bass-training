import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from ".";

/**
 * Toggle switch with optional label.
 *
 * Built on Base UI Switch. Animates the thumb between states
 * with brand color when active.
 */
const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    label: { description: "Text label displayed next to the switch", control: "text" },
    disabled: { description: "Disables the switch", control: "boolean" },
    defaultChecked: { description: "Initial checked state", control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { label: "Enable notifications" },
};

export const Checked: Story = {
  args: { label: "Enabled", defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: "Disabled", disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: "Disabled on", disabled: true, defaultChecked: true },
};

export const WithoutLabel: Story = {
  args: { defaultChecked: false },
};
