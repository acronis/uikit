import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Label } from '@acronis-platform/shadcn-uikit/react'
import { passwordChangeSchema } from '../../lib/validators'
import type { PasswordChangeFormData } from '../../lib/validators'
import { toast } from 'sonner'

interface AccountSectionProps {
  onPasswordChange: (data: PasswordChangeFormData) => Promise<void>
  isLoading?: boolean
}

export function AccountSection({ onPasswordChange, isLoading = false }: AccountSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onFormSubmit = async (data: PasswordChangeFormData) => {
    try {
      await onPasswordChange(data)
      toast.success('Password changed successfully')
      reset()
    } catch {
      toast.error('Failed to change password')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>
          Change your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              {...register('currentPassword')}
              disabled={isSubmitting || isLoading}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password *</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              {...register('newPassword')}
              disabled={isSubmitting || isLoading}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              {...register('confirmPassword')}
              disabled={isSubmitting || isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
