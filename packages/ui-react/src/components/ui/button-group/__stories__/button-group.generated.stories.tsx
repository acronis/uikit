// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ButtonGroupItem } from '../button-group';
import {
  LayoutGridIcon,
  LayoutTableIcon,
  ListIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { ButtonGroup } from '../button-group';

const meta = {
  title: 'UI/ButtonGroup/All States (generated)',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['outlined', 'inlined'] as const;

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {VARIANTS.map((v) => (
        <ButtonGroup aria-label="View mode" key={v} variant={v}>
          <ButtonGroupItem aria-label="List view">
            <ListIcon size={16} />
          </ButtonGroupItem>
          <ButtonGroupItem aria-label="Grid view">
            <LayoutGridIcon size={16} />
          </ButtonGroupItem>
          <ButtonGroupItem aria-label="Table view">
            <LayoutTableIcon size={16} />
          </ButtonGroupItem>
        </ButtonGroup>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {VARIANTS.map((v) => (
        <ButtonGroup aria-label="View mode" key={v} variant={v} disabled>
          <ButtonGroupItem aria-label="List view">
            <ListIcon size={16} />
          </ButtonGroupItem>
          <ButtonGroupItem aria-label="Grid view">
            <LayoutGridIcon size={16} />
          </ButtonGroupItem>
          <ButtonGroupItem aria-label="Table view">
            <LayoutTableIcon size={16} />
          </ButtonGroupItem>
        </ButtonGroup>
      ))}
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <ButtonGroup aria-label="View mode">
      <ButtonGroupItem aria-label="List view">
        <ListIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Grid view">
        <LayoutGridIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Table view">
        <LayoutTableIcon size={16} />
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
  render: () => (
    <ButtonGroup aria-label="View mode">
      <ButtonGroupItem aria-label="List view">
        <ListIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Grid view">
        <LayoutGridIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Table view">
        <LayoutTableIcon size={16} />
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <ButtonGroup aria-label="View mode">
      <ButtonGroupItem aria-label="List view">
        <ListIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Grid view">
        <LayoutGridIcon size={16} />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Table view">
        <LayoutTableIcon size={16} />
      </ButtonGroupItem>
    </ButtonGroup>
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
