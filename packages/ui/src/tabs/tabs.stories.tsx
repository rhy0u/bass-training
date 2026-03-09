import type { Meta, StoryObj } from "@storybook/react";
import { TabsList, TabsPanel, TabsRoot, TabsTab } from ".";

/**
 * Tabbed interface for switching between content panels.
 *
 * Compound component: `TabsRoot`, `TabsList`, `TabsTab`, `TabsPanel`.
 * The active tab shows a brand-colored bottom border.
 */
const meta: Meta = {
  title: "Components/Tabs",
};
export default meta;

type Story = StoryObj;

/** Three-tab layout with text content. */
export const Default: Story = {
  render: () => (
    <TabsRoot defaultValue="tab1">
      <TabsList>
        <TabsTab value="tab1">Account</TabsTab>
        <TabsTab value="tab2">Settings</TabsTab>
        <TabsTab value="tab3">Notifications</TabsTab>
      </TabsList>
      <TabsPanel value="tab1">Account settings content.</TabsPanel>
      <TabsPanel value="tab2">General settings content.</TabsPanel>
      <TabsPanel value="tab3">Notification preferences content.</TabsPanel>
    </TabsRoot>
  ),
};

/** Two tabs, second selected by default. */
export const SecondSelected: Story = {
  render: () => (
    <TabsRoot defaultValue="b">
      <TabsList>
        <TabsTab value="a">Tab A</TabsTab>
        <TabsTab value="b">Tab B</TabsTab>
      </TabsList>
      <TabsPanel value="a">Content A</TabsPanel>
      <TabsPanel value="b">Content B (selected by default)</TabsPanel>
    </TabsRoot>
  ),
};
