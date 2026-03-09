import type { Meta, StoryObj } from "@storybook/react";
import {
  TooltipArrow,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from ".";
import { Button } from "../button";

const meta: Meta = {
  title: "Components/Tooltip",
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger render={<Button>Hover me</Button>} />
        <TooltipPortal>
          <TooltipPositioner sideOffset={8}>
            <TooltipPopup>
              <TooltipArrow />
              This is a tooltip
            </TooltipPopup>
          </TooltipPositioner>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  ),
};
