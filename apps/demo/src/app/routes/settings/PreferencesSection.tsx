import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Label } from '@acronis-platform/shadcn-uikit/react'
import { Switch } from '@acronis-platform/shadcn-uikit/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@acronis-platform/shadcn-uikit/react'
import type { UserPreferences } from '../../types'
import { toast } from 'sonner'

interface PreferencesSectionProps {
  preferences: UserPreferences
  onUpdate: (preferences: Partial<UserPreferences>) => Promise<void>
  isLoading?: boolean
}

export function PreferencesSection({ preferences, onUpdate, isLoading = false }: PreferencesSectionProps) {
  const [localPreferences, setLocalPreferences] = React.useState(preferences)
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate(localPreferences)
      toast.success('Preferences updated successfully')
    } catch {
      toast.error('Failed to update preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize your application experience and notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Theme</h3>
            <Select
              value={localPreferences.theme}
              onValueChange={(value) =>
                setLocalPreferences({ ...localPreferences, theme: value as 'light' | 'dark' | 'system' })
              }
              disabled={isLoading || isSaving}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Language</h3>
            <Select
              value={localPreferences.language}
              onValueChange={(value) =>
                setLocalPreferences({ ...localPreferences, language: value })
              }
              disabled={isLoading || isSaving}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Display Density</h3>
            <Select
              value={localPreferences.display.density}
              onValueChange={(value) =>
                setLocalPreferences({
                  ...localPreferences,
                  display: { ...localPreferences.display, density: value as 'comfortable' | 'compact' }
                })
              }
              disabled={isLoading || isSaving}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notifications</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={localPreferences.notifications.email}
              onCheckedChange={(checked) =>
                setLocalPreferences({
                  ...localPreferences,
                  notifications: { ...localPreferences.notifications, email: checked }
                })
              }
              disabled={isLoading || isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in browser
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={localPreferences.notifications.push}
              onCheckedChange={(checked) =>
                setLocalPreferences({
                  ...localPreferences,
                  notifications: { ...localPreferences.notifications, push: checked }
                })
              }
              disabled={isLoading || isSaving}
            />
          </div>

          <div>
            <Label htmlFor="notification-frequency">Notification Frequency</Label>
            <Select
              value={localPreferences.notifications.frequency}
              onValueChange={(value) =>
                setLocalPreferences({
                  ...localPreferences,
                  notifications: {
                    ...localPreferences.notifications,
                    frequency: value as 'realtime' | 'daily' | 'weekly'
                  }
                })
              }
              disabled={isLoading || isSaving}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  )
}
