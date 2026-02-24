import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Router } from '@angular/router';
import { Credits } from './credits';

const meta: Meta<Credits> = {
  title: 'Components/Credits',
  component: Credits,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: Router, useValue: { navigateByUrl: (url: string) => console.log('Navigated to:', url) } }
      ],
    }),
  ],
  argTypes: {
    themeColor: { control: 'color' },
    closeButtonColor: { control: 'color' },
    containerWidth: { control: { type: 'text' } },
    verticalAlign: {
      control: 'select',
      options: ['center', 'flex-start', 'flex-end'],
    },
  },
};

export default meta;
type Story = StoryObj<Credits>;

export const Default: Story = {
  args: {
    themeColor: '#6abc3a',
    closeButtonColor: '#bc3a3a',
    containerWidth: '80%',
    verticalAlign: 'center',
  },
};

export const PinkTheme: Story = {
  args: {
    themeColor: '#ff00cf',
    closeButtonColor: '#ff00cc',
    containerWidth: '80%',
    verticalAlign: 'center',
  },
};

export const Compact: Story = {
  args: {
    themeColor: '#e7cf23',
    closeButtonColor: '#000000',
    containerWidth: '40%',
    verticalAlign: 'center',
  },
};
