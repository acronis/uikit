import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { Input } from '../input'
import { Button } from '../button'

const meta = {
  title: 'UI/Form',
  component: Form,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as React.ComponentProps<typeof Form>,
  render: () => {
    const form = useForm()
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="w-[400px] space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormDescription>This is your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    )
  },
}
