import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartState } from '../chart-state';

const meta = {
  title: 'Widgets/ChartState',
  component: ChartState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'warning', 'error', 'number'],
    },
    description: { control: 'text' },
  },
} satisfies Meta<typeof ChartState>;

export default meta;
type Story = StoryObj<typeof meta>;

// ChartState fills its slot, so these stories provide the chart-sized surface.
const slot = (Story: () => React.ReactElement) => (
  <div className="flex h-[280px] w-[440px] rounded-lg border border-border bg-background p-4 text-foreground">
    <Story />
  </div>
);

export const Loading: Story = {
  decorators: [slot],
  args: { state: 'loading' },
};

export const Empty: Story = {
  decorators: [slot],
  args: { state: 'empty' },
};

export const Warning: Story = {
  decorators: [slot],
  args: { state: 'warning', description: 'Data may be incomplete' },
};

export const Error: Story = {
  decorators: [slot],
  args: { state: 'error' },
};

export const Number: Story = {
  decorators: [slot],
  args: { state: 'number' },
};

export const NumberWithUnit: Story = {
  decorators: [slot],
  args: { state: 'number', description: '0 GB' },
};

/**
 * Long unbroken error paths stay inside the slot. The text wraps and the root
 * can scroll when the message is taller than the card body.
 */
export const ErrorLongDescription: Story = {
  decorators: [slot],
  args: {
    state: 'error',
    description:
      "failed to execute 'cti.a.p.dts.func.v1.0~a.ax_core.query.v1.0~a.ax_core.widget.v1.0~a.ax_core.daily_activity_table.v1.0': failed to execute node 'func': failed to build return: failed to execute expression '$func[cti.a.p.dts.func.v1.0~a.ax_core.platform.daily_activity_table.v1.0](query=$.params.query)': failed to execute module function 'Platform.GetDailyActivityTableQuery': failed to query daily_activity_table: unmarshaling error",
  },
};

export const CustomDescription: Story = {
  decorators: [slot],
  args: { state: 'empty', description: 'No results for the selected range' },
};
