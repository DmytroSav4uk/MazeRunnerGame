import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Settings } from './settings';
import { PublicFunctions } from '../../../services/publicFunctions/public-functions';
import { MusicService } from '../../../services/music/music';

const meta: Meta<Settings> = {
  title: 'Components/Complex/Settings',
  component: Settings,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: PublicFunctions,
          useValue: {
            getLocalStorage: () => ({ difficulty: 'medium', volume: 0.5, controls: {} }),
            setLocalStorage: (k: string, v: any) => console.log('Saved:', v),
            redirectTo: (u: string) => alert('Navigating to ' + u)
          }
        },
        { provide: MusicService, useValue: { updateVolume: () => console.log('Volume Upd') } }
      ],
    }),
  ],
  argTypes: {
    accentColor: { control: 'color' },
    navActiveColor: { control: 'color' },
    width: { control: 'text' },
    height: { control: 'text' },
    activeSection: {
      control: 'radio',
      options: ['audio', 'controls', 'difficulty']
    }
  }
};

export default meta;
type Story = StoryObj<Settings>;

export const ClassicPalette: Story = {
  args: {
    activeSection: 'audio',
    accentColor: '#bc3a3a',
    navActiveColor: '#a9ba41',
    width: '80%',
    height: '550px'
  },
};

export const OceanPalette: Story = {
  args: {
    activeSection: 'controls',
    accentColor: '#3a6abc',
    navActiveColor: '#3abc8a',
    width: '80%',
    height: '550px'
  },
};

export const SunsetPalette: Story = {
  args: {
    activeSection: 'difficulty',
    accentColor: '#e67e22',
    navActiveColor: '#f1c40f',
    width: '80%',
    height: '550px'
  },
};



export const DesktopLarge: Story = {
  name: 'Desktop Large',
  args: {
    ...ClassicPalette.args,
    width: '1000px',
    height: '600px',
  },
};

export const MobileNarrow: Story = {
  name: 'Narrow',
  args: {
    ...ClassicPalette.args,
    activeSection: 'controls',
    width: '380px',
    height: '800px',
  },
};

export const CompactSquare: Story = {
  name: 'Compact Square',
  args: {
    ...OceanPalette.args,
    width: '500px',
    height: '500px',
  },
};
