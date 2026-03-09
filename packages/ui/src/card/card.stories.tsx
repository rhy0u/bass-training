import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from ".";

/**
 * Composable card container with header, content, and footer slots.
 *
 * Sub-components: `CardHeader`, `CardTitle`, `CardDescription`,
 * `CardContent`, `CardFooter`.
 */
const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

/** Standard card with all sections. */
export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: "400px" }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A short description of this card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card body content goes here.</p>
      </CardContent>
      <CardFooter>
        <button>Action</button>
      </CardFooter>
    </Card>
  ),
};

/** Card with only header and content. */
export const WithoutFooter: Story = {
  render: () => (
    <Card style={{ maxWidth: "400px" }}>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Content without a footer section.</p>
      </CardContent>
    </Card>
  ),
};

/** Minimal card with just content. */
export const ContentOnly: Story = {
  render: () => (
    <Card style={{ maxWidth: "400px" }}>
      <CardContent>
        <p>A minimal card with only content.</p>
      </CardContent>
    </Card>
  ),
};
