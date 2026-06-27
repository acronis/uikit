import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: 'plan',
    title: 'What is included in the plan?',
    body: 'Backup, recovery, and anti-malware for all registered workloads.',
  },
  {
    value: 'devices',
    title: 'How many devices can I protect?',
    body: 'Up to the seat count in your subscription; add more at any time.',
  },
  {
    value: 'support',
    title: 'Do you offer 24/7 support?',
    body: 'Yes — support is available around the clock for all paid tiers.',
  },
];

export const Default: Story = {
  render: () => (
    <Accordion defaultValue={['plan']} className="w-[420px]">
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion multiple defaultValue={['plan', 'support']} className="w-[420px]">
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
