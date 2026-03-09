import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from ".";

/**
 * Semantic typography component with preset variant styles.
 *
 * Maps to appropriate HTML elements by default (`h1`–`h3`, `p`, `span`).
 * Use the `as` prop to override the rendered element.
 *
 * | Variant    | Element | Size     |
 * |------------|---------|----------|
 * | `h1`       | `h1`    | 1.75rem  |
 * | `h2`       | `h2`    | 1.5rem   |
 * | `h3`       | `h3`    | 1.25rem  |
 * | `body`     | `p`     | 1rem     |
 * | `body-sm`  | `p`     | 0.875rem |
 * | `caption`  | `span`  | 0.75rem  |
 */
const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  argTypes: {
    variant: {
      description: "Typography variant",
      control: "select",
      options: ["h1", "h2", "h3", "body", "body-sm", "caption"],
      table: { defaultValue: { summary: "body" } },
    },
    children: { description: "Text content" },
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

/** Full typographic scale in one view. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="body">Body text</Typography>
      <Typography variant="body-sm">Small body text</Typography>
      <Typography variant="caption">Caption text</Typography>
    </div>
  ),
};
