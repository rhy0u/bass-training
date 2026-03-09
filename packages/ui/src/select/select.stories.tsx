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

const meta: Meta = {
  title: "Components/Select",
};
export default meta;

type Story = StoryObj;

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
