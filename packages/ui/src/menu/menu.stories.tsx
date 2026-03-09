import type { Meta, StoryObj } from "@storybook/react";
import {
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from ".";
import { Button } from "../button";

/**
 * Contextual menu that appears on trigger click, built on **Base UI Menu** primitives.
 *
 * ## Compound components
 *
 * | Component         | Description                                      |
 * | ----------------- | ------------------------------------------------ |
 * | `MenuRoot`        | State provider – wraps the entire menu            |
 * | `MenuTrigger`     | Element that opens the menu (render-prop pattern) |
 * | `MenuPortal`      | Renders popup into a portal                       |
 * | `MenuPositioner`  | Anchors & positions the popup (`align`, `sideOffset`) |
 * | `MenuPopup`       | The floating panel with styled background         |
 * | `MenuItem`        | Action item (button)                              |
 * | `MenuLinkItem`    | Navigation item (anchor)                          |
 * | `MenuSeparator`   | Horizontal divider between groups of items        |
 *
 * ## Usage
 *
 * ```tsx
 * import {
 *   MenuRoot, MenuTrigger, MenuPortal,
 *   MenuPositioner, MenuPopup, MenuItem,
 * } from "@friends/ui/menu";
 *
 * <MenuRoot>
 *   <MenuTrigger render={<Button>Open</Button>} />
 *   <MenuPortal>
 *     <MenuPositioner sideOffset={8}>
 *       <MenuPopup>
 *         <MenuItem>Edit</MenuItem>
 *         <MenuItem>Delete</MenuItem>
 *       </MenuPopup>
 *     </MenuPositioner>
 *   </MenuPortal>
 * </MenuRoot>
 * ```
 */
const meta: Meta = {
  title: "Components/Menu",
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <MenuRoot>
      <MenuTrigger render={<Button>Open Menu</Button>} />
      <MenuPortal>
        <MenuPositioner sideOffset={8}>
          <MenuPopup>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuSeparator />
            <MenuItem>Logout</MenuItem>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  ),
};

export const WithLinks: Story = {
  render: () => (
    <MenuRoot>
      <MenuTrigger render={<Button>Navigation</Button>} />
      <MenuPortal>
        <MenuPositioner sideOffset={8}>
          <MenuPopup>
            <MenuLinkItem href="#">Home</MenuLinkItem>
            <MenuLinkItem href="#">Groups</MenuLinkItem>
            <MenuLinkItem href="#">Profile</MenuLinkItem>
            <MenuSeparator />
            <MenuLinkItem href="#" className="text-red-500">
              Logout
            </MenuLinkItem>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <MenuRoot>
        <MenuTrigger render={<Button variant="outline">⋮</Button>} />
        <MenuPortal>
          <MenuPositioner align="end" sideOffset={8}>
            <MenuPopup>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Duplicate</MenuItem>
              <MenuSeparator />
              <MenuItem className="text-red-500">Delete</MenuItem>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
    </div>
  ),
};
