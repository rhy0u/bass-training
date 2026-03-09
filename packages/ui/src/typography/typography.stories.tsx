import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from ".";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  argTypes: {
    variant: { control: "select", options: ["h1", "h2", "h3", "body", "body-sm", "caption"] },
  },
};
export default meta;

type Story = StoryObj<typeof Typography>;

export const Heading1: Story = {
  args: { variant: "h1", children: "Heading 1" },
};

export const Heading2: Story = {
  args: { variant: "h2", children: "Heading 2" },
};

export const Heading3: Story = {
  args: { variant: "h3", children: "Heading 3" },
};

export const Body: Story = {
  args: { variant: "body", children: "Body text goes here." },
};

export const BodySmall: Story = {
  args: { variant: "body-sm", children: "Smaller body text." },
};

export const Caption: Story = {
  args: { variant: "caption", children: "Caption text" },
};
