import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { InputText } from '../../input-text';
import {
  AuthLayout,
  AuthLayoutCard,
  AuthLayoutFooter,
  AuthLayoutLogo,
} from '../auth-layout';

const meta = {
  title: 'UI/AuthLayout',
  component: AuthLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  render: () => (
    <div className="h-[520px] bg-[var(--ui-background-surface-secondary)]">
      <AuthLayout className="min-h-0 h-full">
        <AuthLayoutCard>
          <AuthLayoutLogo>
            <span className="text-base font-semibold">Sign in</span>
          </AuthLayoutLogo>
          <div className="flex flex-col gap-4">
            <InputText label="Email" type="email" placeholder="you@example.com" />
            <InputText label="Password" type="password" />
            <Button className="w-full">Sign in</Button>
          </div>
          <AuthLayoutFooter>
            <a className="underline underline-offset-4" href="#">
              Forgot password?
            </a>
          </AuthLayoutFooter>
        </AuthLayoutCard>
      </AuthLayout>
    </div>
  ),
};
