import type { Meta, StoryObj } from '@storybook/react-vite';

import type { Locale } from '../../../../../.storybook/globals';
import { t } from '../../../../../.storybook/i18n';
import { Loading } from '../loading';

const meta = {
  title: 'UI/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['inline', 'onSurfacePrimary', 'onSurfaceSecondary', 'onScreen'],
      description:
        'Placement context — mirrors the Figma Loading `variant` property. `inline` sits flush in text flow; `onSurfacePrimary`/`onSurfaceSecondary` are card-like chips over an app surface; `onScreen` is the higher-contrast dark chip for busy/photo/video surfaces.',
      table: {
        type: {
          summary:
            "'inline' | 'onSurfacePrimary' | 'onSurfaceSecondary' | 'onScreen'",
        },
        defaultValue: { summary: 'inline' },
        category: 'Appearance',
      },
    },
    hasLabel: {
      control: 'boolean',
      description:
        'Whether the label renders visibly. When false, `label` is still exposed via `aria-label`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Content',
      },
    },
    label: {
      control: 'text',
      description: 'The loading message.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Data is loading…'" },
        category: 'Content',
      },
    },
  },
  args: {
    variant: 'inline',
    hasLabel: true,
    label: 'Data is loading…',
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Loading variant="inline" />
      <Loading variant="onSurfacePrimary" />
      <Loading variant="onSurfaceSecondary" />
      <div className="bg-[#191b23] p-6">
        <Loading variant="onScreen" />
      </div>
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Loading variant="inline" hasLabel={false} />
      <Loading variant="onSurfacePrimary" hasLabel={false} />
    </div>
  ),
};

export const Localized: Story = {
  render: (args, { globals }) => (
    <Loading
      {...args}
      label={t((globals.locale as Locale) ?? 'en', 'loading')}
    />
  ),
};
