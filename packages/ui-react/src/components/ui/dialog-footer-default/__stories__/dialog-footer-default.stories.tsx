import type { Meta, StoryObj } from '@storybook/react-vite';

import type { Locale } from '../../../../../.storybook/globals';
import { t } from '../../../../../.storybook/i18n';
import { Button } from '../../button';
import { Link } from '../../link';
import { DialogFooterDefault } from '../dialog-footer-default';

const meta = {
  title: 'UI/DialogFooterDefault',
  component: DialogFooterDefault,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    description: {
      control: 'text',
      description:
        'Truncated description text next to the actions. Mutually exclusive with `link`.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    link: {
      control: false,
      description:
        'A `Link` element next to the actions. Mutually exclusive with `description`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    children: {
      control: false,
      description:
        'End-aligned actions — typically a secondary and a primary `Button`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DialogFooterDefault>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DialogFooterDefault>
      <Button variant="secondary">Cancel</Button>
      <Button>Save</Button>
    </DialogFooterDefault>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <DialogFooterDefault description="Changes are saved automatically as you type.">
      <Button variant="secondary">Cancel</Button>
      <Button>Save</Button>
    </DialogFooterDefault>
  ),
};

export const WithLink: Story = {
  render: () => (
    <DialogFooterDefault link={<Link href="#">Learn more</Link>}>
      <Button variant="secondary">Cancel</Button>
      <Button>Save</Button>
    </DialogFooterDefault>
  ),
};

export const Localized: Story = {
  render: (_args, { globals }) => {
    const locale = (globals.locale as Locale) ?? 'en';
    return (
      <DialogFooterDefault>
        <Button variant="secondary">{t(locale, 'cancel')}</Button>
        <Button>{t(locale, 'submit')}</Button>
      </DialogFooterDefault>
    );
  },
};
