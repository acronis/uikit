import * as React from 'react'
import {
  AuthLayout, AuthLayoutCard, AuthLayoutLogo, AuthLayoutFooter,
  Button,
  Input,
  Label,
} from '@acronis-platform/shadcn-uikit/react'

export function LoginPattern() {
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <AuthLayout>
      <AuthLayoutCard>
        <AuthLayoutLogo>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">A</div>
            <span className="text-lg font-semibold">Acronis</span>
          </div>
        </AuthLayoutLogo>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@company.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <AuthLayoutFooter>
          Don&apos;t have an account?{' '}
          <a href="#" className="text-primary hover:underline">Create account</a>
        </AuthLayoutFooter>
      </AuthLayoutCard>
    </AuthLayout>
  )
}
