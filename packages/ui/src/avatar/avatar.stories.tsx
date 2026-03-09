import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from ".";

/**
 * Circular avatar displaying an image or initials fallback.
 *
 * Four sizes: `sm` (32px), `md` (40px), `lg` (48px), `xl` (64px).
 * Automatically computes up to 2-letter initials from the `fallback` name.
 */
const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      description: "Size of the avatar",
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      table: { defaultValue: { summary: "md" } },
    },
    fallback: { description: "Name used to generate initials", control: "text" },
    src: { description: "Image URL", control: "text" },
    alt: { description: "Alt text for the image", control: "text" },
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

/** All sizes side by side for comparison. */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Avatar fallback="AB" size="sm" />
      <Avatar fallback="AB" size="md" />
      <Avatar fallback="AB" size="lg" />
      <Avatar fallback="AB" size="xl" />
    </div>
  ),
};
