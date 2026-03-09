import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

/**
 * Primary interactive element for user actions.
 *
 * Supports three visual variants (`solid`, `outline`, `ghost`) and three sizes
 * (`sm`, `md`, `lg`). Forwards all native button props.
 */
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      description: "Visual style of the button",
      control: "select",
      options: ["solid", "outline", "ghost"],
      table: { defaultValue: { summary: "solid" } },
    },
    size: {
      description: "Size of the button",
      control: "select",
      options: ["sm", "md", "lg"],
      table: { defaultValue: { summary: "md" } },
    },
    disabled: {
      description: "Disables the button and prevents interaction",
      control: "boolean",
    },
    children: { description: "Button label" },
  },
  args: { children: "Button" },
};
export default meta;

type Story = StoryObj<typeof Button>;

/** Default solid button. */
export const Solid: Story = {
  args: { variant: "solid", children: "Solid Button" },
};

/** Bordered button for secondary actions. */
export const Outline: Story = {
  args: { variant: "outline", children: "Outline Button" },
};

/** Minimal button for tertiary / inline actions. */
export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost Button" },
};

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

/** All variants side by side for visual comparison. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

/** All sizes side by side. */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
