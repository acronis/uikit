import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../resizable';

// The handle must contribute no size to the group, so adjacent panels' edges (and
// any borders a consumer puts on them) meet. Asserted here rather than left to the
// visual regression baselines: the shift is ~0.2% of a story's pixels, under the
// test-runner's 0.5% failureThreshold, so a regression would pass unnoticed.
const expectPanelsFlush = (
  canvasElement: HTMLElement,
  axis: 'horizontal' | 'vertical'
) => {
  const [first, second] = canvasElement.querySelectorAll('[data-panel]');
  const a = first.getBoundingClientRect();
  const b = second.getBoundingClientRect();
  const gap = axis === 'horizontal' ? b.left - a.right : b.top - a.bottom;
  expect(gap).toBeCloseTo(0, 1);
};

const meta = {
  title: 'UI/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Resize axis — horizontal (row) or vertical (column).',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
        category: 'Layout',
      },
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Panels need a bounded box from their container; each story sets one on a wrapper.
const cellStyle: CSSProperties = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  fontSize: 14,
};

const box = (children: ReactNode, height = 240) => (
  <div
    style={{
      height,
      width: 480,
      borderRadius: 8,
      border: '1px solid var(--ui-resizable-border-color-hover)',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

export const Default: Story = {
  args: { orientation: 'horizontal' },
  render: (args) =>
    box(
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={40} minSize={20}>
          <div style={cellStyle}>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div style={cellStyle}>Content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
  play: ({ canvasElement }) => expectPanelsFlush(canvasElement, 'horizontal'),
};

export const Vertical: Story = {
  play: ({ canvasElement }) => expectPanelsFlush(canvasElement, 'vertical'),
  render: () =>
    box(
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={60}>
          <div style={cellStyle}>Editor</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40}>
          <div style={cellStyle}>Preview</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
};

export const ThreePanels: Story = {
  render: () =>
    box(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={25} minSize={15}>
          <div style={cellStyle}>Nav</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div style={cellStyle}>List</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          <div style={cellStyle}>Detail</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
};

export const Nested: Story = {
  render: () =>
    box(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={40} minSize={20}>
          <div style={cellStyle}>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={55}>
              <div style={cellStyle}>Content</div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={45}>
              <div style={cellStyle}>Console</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>,
      300
    ),
};
