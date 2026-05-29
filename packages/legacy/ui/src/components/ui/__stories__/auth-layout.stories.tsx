import type { Meta, StoryObj } from '@storybook/react-vite'
import { AuthLayout, AuthLayoutCard, AuthLayoutLogo, AuthLayoutFooter } from '../auth-layout'
import { Button } from '../button'
import { Input } from '../input'
import { Label } from '../label'

const meta = {
  title: 'UI/AuthLayout',
  component: AuthLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutCard>
        <AuthLayoutLogo>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            A
          </div>
        </AuthLayoutLogo>
        <h2 className="mb-2 text-center text-xl font-semibold">
          Sign in to your account
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Enter your credentials to continue
        </p>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Sign In</Button>
        </div>
        <AuthLayoutFooter>
          Don&apos;t have an account?{' '}
          <a
            href="#"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </a>
        </AuthLayoutFooter>
      </AuthLayoutCard>
    </AuthLayout>
  ),
};

export const SignUp: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutCard>
        <AuthLayoutLogo>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            A
          </div>
        </AuthLayoutLogo>
        <h2 className="mb-2 text-center text-xl font-semibold">Create an account</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Get started with a free account
        </p>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email2">Email</Label>
            <Input id="email2" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password2">Password</Label>
            <Input id="password2" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Create Account</Button>
        </div>
        <AuthLayoutFooter>
          Already have an account?{' '}
          <a href="#" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </a>
        </AuthLayoutFooter>
      </AuthLayoutCard>
    </AuthLayout>
  ),
}
