import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from ".";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
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
