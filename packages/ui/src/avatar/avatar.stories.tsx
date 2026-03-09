import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from ".";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    fallback: { control: "text" },
    src: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=3",
    alt: "User avatar",
    size: "lg",
  },
};

export const WithFallback: Story = {
  args: { fallback: "John Doe", size: "lg" },
};

export const Small: Story = {
  args: { fallback: "AB", size: "sm" },
};

export const ExtraLarge: Story = {
  args: { fallback: "Jane Smith", size: "xl" },
};

export const NoData: Story = {
  args: { size: "md" },
};
