import type { Meta, StoryObj } from '@storybook/react-vite';

import type { Locale } from '../../../../../.storybook/globals';
import { t } from '../../../../../.storybook/i18n';
import { Button } from '../button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'ghost', 'destructive', 'ai', 'inverted'],
      description: 'Visual style — mirrors the Figma Button `Variant` property.',
      table: {
        type: {
          summary:
            "'default' | 'secondary' | 'ghost' | 'destructive' | 'ai' | 'inverted'",
        },
        defaultValue: { summary: 'default' },
        category: 'Appearance',
      },
    },
    children: {
      control: 'text',
      description: 'Button label content.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<button>` (e.g. render as an `<a>`).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    children: 'Button',
    variant: 'default',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ai">Ai</Button>
      <Button variant="inverted">Inverted</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
      <Button variant="ai" disabled>
        Ai
      </Button>
      <Button variant="inverted" disabled>
        Inverted
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  name: 'As link (render prop)',
  render: () => (
    <Button render={<a href="https://www.acronis.com" />} variant="ghost">
      Rendered as an anchor
    </Button>
  ),
};

// Reads the active `locale` toolbar global and renders demo-localized text from
// the shared catalog (.storybook/i18n.ts). Switching the Locale toolbar — incl.
// ar/he, which also flip the canvas to RTL — re-renders the label in-place.
export const Localized: Story = {
  name: 'Localized (locale toolbar)',
  render: (args, { globals }) => (
    <Button {...args}>{t((globals.locale as Locale) ?? 'en', 'submit')}</Button>
  ),
};
