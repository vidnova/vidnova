import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    children: 'Email',
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const WithDisabledPeer: Story = {
  render: (args) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input type="checkbox" className="peer" disabled />
        <Label {...args} htmlFor="email" />
      </label>
    </div>
  ),
};
