import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/react/components/button/button.tsx'

const meta: Meta<typeof Button> = {
  title: 'React/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
        'success',
        'warning',
        'info',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Default Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Button',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info Button',
  },
}

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    children: 'Large Button',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'default',
    disabled: true,
    children: 'Disabled Button',
  },
}
