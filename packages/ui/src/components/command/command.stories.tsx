import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './command';
import { useState } from 'react';
import { SunIcon, MoonIcon, LaptopIcon } from 'lucide-react';

const meta: Meta<typeof CommandDialog> = {
  title: 'UI/Command',
  component: CommandDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof CommandDialog>;

const Template = () => {
  const [open, setOpen] = useState(true);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for theme..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <SunIcon />
            Light
            <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <MoonIcon />
            Dark
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <LaptopIcon />
            System
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>Toggle sidebar</CommandItem>
          <CommandItem>Open settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export const Default: Story = {
  render: () => <Template />,
};
