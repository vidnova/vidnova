import { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar";
import { addDays, subDays } from "date-fns";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    selected: new Date(),
  },
};

export const WithRangeSelection: Story = {
  args: {
    mode: "range",
    selected: {
      from: subDays(new Date(), 3),
      to: addDays(new Date(), 3),
    },
  },
};

export const WithMultipleSelection: Story = {
  args: {
    mode: "multiple",
    selected: [new Date(), addDays(new Date(), 1), addDays(new Date(), 2)],
  },
};

export const WithDisabledDays: Story = {
  args: {
    selected: new Date(),
    disabled: [{ dayOfWeek: [0, 6] }], // Disable weekends
  },
};

export const WithWeekNumbers: Story = {
  args: {
    selected: new Date(),
    showWeekNumber: true,
  },
};

export const CustomCaptionLayoutDropdown: Story = {
  args: {
    selected: new Date(),
    captionLayout: "dropdown",
  },
};

export const CustomButtonVariant: Story = {
  args: {
    selected: new Date(),
    buttonVariant: "outline",
  },
};
