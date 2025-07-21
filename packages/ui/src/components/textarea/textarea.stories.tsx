import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
    value: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Write your text here...',
    rows: 5,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Textarea is disabled',
    disabled: true,
    rows: 5,
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is some predefined text inside the textarea.',
    rows: 5,
  },
};
