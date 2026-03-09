import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from ".";

/**
 * Visual divider between sections of content.
 *
 * Renders as a thin line, either horizontal (default) or vertical.
 */
const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  argTypes: {
    orientation: {
      description: "Direction of the separator",
      control: "select",
      options: ["horizontal", "vertical"],
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <p>Above</p>
        <Story />
        <p>Below</p>
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", alignItems: "center", height: "40px", gap: "8px" }}>
        <span>Left</span>
        <Story />
        <span>Right</span>
      </div>
    ),
  ],
};
