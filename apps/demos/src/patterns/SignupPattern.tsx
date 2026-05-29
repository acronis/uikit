import * as React from 'react'
import {
  AuthLayout, AuthLayoutCard, AuthLayoutLogo, AuthLayoutFooter,
  Button,
  Input,
  Label,
  Progress,
} from '@acronis-platform/shadcn-uikit/react'

const steps = ['Account', 'Profile', 'Done']

export function SignupPattern() {
  const [step, setStep] = React.useState(0)
  const progress = ((step + 1) / steps.length) * 100

  return (
    <AuthLayout>
      <AuthLayoutCard className="max-w-md">
        <AuthLayoutLogo>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">A</div>
            <span className="text-lg font-semibold">Acronis</span>
          </div>
        </AuthLayoutLogo>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            {steps.map((s, i) => (
              <span key={s} className={i <= step ? 'text-primary font-medium' : ''}>{s}</span>
            ))}
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Create your account</h1>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Work email</Label>
              <Input id="signup-email" type="email" placeholder="john@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" />
            </div>
            <Button className="w-full" onClick={() => setStep(1)}>Continue</Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Your profile</h1>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input placeholder="Acme Corp" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-xl font-bold">Account created!</h1>
            <p className="text-sm text-muted-foreground">Check your email to verify your account.</p>
            <Button className="w-full" onClick={() => setStep(0)}>Reset Demo</Button>
          </div>
        )}

        <AuthLayoutFooter>
          Already have an account?{' '}
          <a href="#" className="text-primary hover:underline">Sign in</a>
        </AuthLayoutFooter>
      </AuthLayoutCard>
    </AuthLayout>
  )
}
