import type { Meta, StoryObj } from '@storybook/react-vite';
import { PencilIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Button } from '../../button';
import { ButtonIcon } from '../../button-icon';
import { ButtonMenu } from '../../button-menu';
import { Tag } from '../../tag';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderDescriptionRow,
  PageHeaderRow,
  PageHeaderTags,
  PageHeaderTitle,
} from '../page-header';

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    children: {
      control: false,
      description:
        'PageHeader structure — a `PageHeaderRow` (title + optional edit button + tags + actions) and an optional `PageHeaderDescriptionRow`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the root `<div>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const DESCRIPTION_TEXT =
  "The first time you land on a section I'll explain what it's for, how it relates to the rest of the console, and the common workflows partners use.";

export const Default: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
      </PageHeaderRow>
    </PageHeader>
  ),
};

export const H2Title: Story = {
  name: 'H2 title (embedded view)',
  tags: ['h2-title-visual'],
  render: () => (
    <div className="space-y-6">
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Workspace</PageHeaderTitle>
        </PageHeaderRow>
      </PageHeader>
      <PageHeader role="none">
        <PageHeaderRow>
          <PageHeaderTitle as="h2">Activity</PageHeaderTitle>
        </PageHeaderRow>
      </PageHeader>
    </div>
  ),
};

export const WithTags: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
      </PageHeaderRow>
    </PageHeader>
  ),
};

export const WithTagsAndActions: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
        <PageHeaderActions>
          <Button variant="secondary">Quick access</Button>
          <Button variant="secondary">Export data</Button>
          <ButtonMenu>Add user</ButtonMenu>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  ),
};

export const WithTitleEditable: Story = {
  name: 'Default Header + Editable (full page wizards)',
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <ButtonIcon variant="secondary" aria-label="Edit title">
          <PencilIcon size={16} />
        </ButtonIcon>
      </PageHeaderRow>
    </PageHeader>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
      </PageHeaderRow>
      <PageHeaderDescriptionRow>
        <PageHeaderDescription>{DESCRIPTION_TEXT}</PageHeaderDescription>
      </PageHeaderDescriptionRow>
    </PageHeader>
  ),
};

export const WithDescriptionAndTags: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
      </PageHeaderRow>
      <PageHeaderDescriptionRow>
        <PageHeaderDescription>{DESCRIPTION_TEXT}</PageHeaderDescription>
      </PageHeaderDescriptionRow>
    </PageHeader>
  ),
};

export const WithDescriptionTagsAndActions: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <PageHeaderTags>
          <Tag variant="info">Customer</Tag>
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Warning</Tag>
        </PageHeaderTags>
        <PageHeaderActions>
          <Button variant="secondary">Cancel</Button>
          <Button>Save</Button>
        </PageHeaderActions>
      </PageHeaderRow>
      <PageHeaderDescriptionRow>
        <PageHeaderDescription>{DESCRIPTION_TEXT}</PageHeaderDescription>
      </PageHeaderDescriptionRow>
    </PageHeader>
  ),
};

export const WithDescriptionEditable: Story = {
  name: 'with Description + Editable (full page wizards)',
  render: () => (
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderTitle>Page header</PageHeaderTitle>
        <ButtonIcon variant="secondary" aria-label="Edit title">
          <PencilIcon size={16} />
        </ButtonIcon>
      </PageHeaderRow>
      <PageHeaderDescriptionRow>
        <PageHeaderDescription>{DESCRIPTION_TEXT}</PageHeaderDescription>
        <ButtonIcon variant="secondary" aria-label="Edit description">
          <PencilIcon size={16} />
        </ButtonIcon>
      </PageHeaderDescriptionRow>
    </PageHeader>
  ),
};

// Forces overflow at a fixed width (rather than a viewport size, so it's a
// deterministic VR case) — matches the Figma "Breakpoints" page's two hard
// requirements: tags collapse to the first tag + a "+#" tag (labels on
// hover), and secondary buttons collapse under a single "More" ButtonIcon.
// Primary buttons (`Add user`) are never hidden.
export const TagsAndActionsOverflow: Story = {
  name: 'Tags + Actions overflow (narrow width)',
  render: () => (
    <div className="w-115">
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Page header</PageHeaderTitle>
          <PageHeaderTags>
            <Tag variant="info">Customer</Tag>
            <Tag variant="success">Active</Tag>
            <Tag variant="warning">Warning</Tag>
          </PageHeaderTags>
          <PageHeaderActions>
            <Button variant="secondary">Quick access</Button>
            <Button variant="secondary">Export data</Button>
            <ButtonMenu>Add user</ButtonMenu>
          </PageHeaderActions>
        </PageHeaderRow>
      </PageHeader>
    </div>
  ),
};
