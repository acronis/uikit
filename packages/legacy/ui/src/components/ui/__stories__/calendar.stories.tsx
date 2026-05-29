import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from '../calendar'
import { useState } from 'react'

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date('2025-01-15'))
    return <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date('2025-01-01')} />
  },
}

export const WithoutSelection: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date('2025-01-01')} />
  },
}
