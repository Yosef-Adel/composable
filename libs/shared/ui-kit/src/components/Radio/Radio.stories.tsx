import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroupComponent } from './Radio';

const meta = {
  title: 'Components/Form/Radio',
  component: RadioGroupComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroupComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Choose an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    defaultValue: 'option1',
  },
};

export const WithDisabled: Story = {
  args: {
    label: 'Choose an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2 (Disabled)', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};
