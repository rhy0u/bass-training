import type { Meta, StoryObj } from "@storybook/react";
import {
  SelectItem,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from ".";

/**
 * Dropdown select built on Base UI Select.
 *
 * Compound component: `SelectRoot`, `SelectTrigger`, `SelectValue`,
 * `SelectPortal`, `SelectPositioner`, `SelectPopup`, `SelectItem`,
 * `SelectGroup`, `SelectGroupLabel`.
 */
const meta: Meta = {
  title: "Components/Select",
};
export default meta;

type Story = StoryObj;

/** Basic select with three options. */
export const Default: Story = {
  render: () => (
    <SelectRoot>
      <SelectTrigger style={{ width: "200px" }}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner>
          <SelectPopup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    </SelectRoot>
  ),
};

/** Select with a pre-selected value. */
export const WithDefaultValue: Story = {
  render: () => (
    <SelectRoot defaultValue="banana">
      <SelectTrigger style={{ width: "200px" }}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner>
          <SelectPopup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    </SelectRoot>
  ),
};
