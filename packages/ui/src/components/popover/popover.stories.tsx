import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from './popover';
import { Button } from '../button/button';

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-sm text-muted-foreground">
          This is a popover content block. You can place any React node here.
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithAnchor: Story = {
  render: () => (
    <div className="flex justify-center items-center h-64 relative">
      <Popover>
        <PopoverAnchor className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-sm font-medium">I'm an anchor</span>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <Button className="mt-8">Open Popover Near Anchor</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="text-sm">Popover positioned relative to anchor.</div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const CustomSideAndOffset: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open Popover (Left, offset 10)</Button>
      </PopoverTrigger>
      <PopoverContent side="left" sideOffset={10}>
        <div className="text-sm">Left-aligned content with 10px offset.</div>
      </PopoverContent>
    </Popover>
  ),
};
