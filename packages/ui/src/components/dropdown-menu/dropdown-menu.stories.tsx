import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => alert('New Tab clicked')}>New Tab</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => alert('New Window clicked')}>New Window</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => alert('Close clicked')}>Close</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = React.useState({
      showBookmarks: true,
      showHistory: false,
    });

    const toggleItem = (key: keyof typeof checkedItems) => {
      setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="btn">Settings</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={checkedItems.showBookmarks}
            onCheckedChange={() => toggleItem('showBookmarks')}
          >
            Show Bookmarks
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={checkedItems.showHistory}
            onCheckedChange={() => toggleItem('showHistory')}
          >
            Show History
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithRadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('light');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="btn">Theme</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">More Options</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => alert('Profile clicked')}>Profile</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Settings</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => alert('General clicked')}>General</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => alert('Security clicked')}>Security</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => alert('Logout clicked')}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
