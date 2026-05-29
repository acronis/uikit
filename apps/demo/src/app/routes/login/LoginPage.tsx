import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'
import { LoginForm } from './LoginForm'
import { useAuth } from '../../hooks/useAuth'
import type { LoginFormData } from '../../lib/validators'

export function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/demo/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (data: LoginFormData) => {
    await login(data.email, data.password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter any email and password to sign in to the demo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>This is a demo with mock authentication.</p>
            <p className="mt-1">Any credentials will work!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
