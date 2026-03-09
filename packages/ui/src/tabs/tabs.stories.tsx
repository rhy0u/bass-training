import type { Meta, StoryObj } from "@storybook/react";
import { TabsList, TabsPanel, TabsRoot, TabsTab } from ".";

const meta: Meta = {
  title: "Components/Tabs",
};
export default meta;

type Story = StoryObj;

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
