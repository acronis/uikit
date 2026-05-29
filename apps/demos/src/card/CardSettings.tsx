import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@acronis-platform/shadcn-uikit/react'
import { Button, Label, Switch } from '@acronis-platform/shadcn-uikit/react'

export function CardSettings() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Manage your cookie preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="necessary">Strictly Necessary</Label>
          <Switch id="necessary" defaultChecked disabled />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="functional">Functional Cookies</Label>
          <Switch id="functional" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="performance">Performance Cookies</Label>
          <Switch id="performance" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
