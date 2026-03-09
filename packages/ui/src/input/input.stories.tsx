import type { Meta, StoryObj } from "@storybook/react";
import { Input } from ".";

/**
 * Text input field built on Base UI.
 *
 * Supports all native `<input>` props. Styled with consistent border,
 * focus ring, and placeholder treatment.
 */
const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    placeholder: { description: "Placeholder text", control: "text" },
    disabled: { description: "Disables the input", control: "boolean" },
    type: {
      description: "Input type (text, email, password, etc.)",
      control: "select",
      options: ["text", "email", "password", "number"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text…" },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: "Hello world" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Enter password…" },
};

export const Email: Story = {
  args: { type: "email", placeholder: "you@example.com" },
};
