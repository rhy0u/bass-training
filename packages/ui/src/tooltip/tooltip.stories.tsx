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

/**
 * Tooltip that appears on hover/focus.
 *
 * Wrap your app in `TooltipProvider` for shared delay behavior.
 * Compound component: `TooltipRoot`, `TooltipTrigger`, `TooltipPortal`,
 * `TooltipPositioner`, `TooltipPopup`, `TooltipArrow`.
 */
const meta: Meta = {
  title: "Components/Tooltip",
};
export default meta;

type Story = StoryObj;

/** Basic tooltip with arrow. */
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

/** Tooltip without arrow. */
export const WithoutArrow: Story = {
  render: () => (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger render={<Button variant="outline">No arrow</Button>} />
        <TooltipPortal>
          <TooltipPositioner sideOffset={8}>
            <TooltipPopup>Tooltip without arrow</TooltipPopup>
          </TooltipPositioner>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  ),
};
