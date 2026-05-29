import {
  AlertContent,
  AlertIcon,
  Button, CriticalIcon, DangerIcon, InfoIcon,
  InfrastructureIcon,
  SuccessIcon,
  WarningIcon
} from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Label } from '@acronis-platform/shadcn-uikit/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'
import { Badge } from '@acronis-platform/shadcn-uikit/react'
import { Alert, AlertDescription, AlertTitle } from '@acronis-platform/shadcn-uikit/react'
import { Separator } from '@acronis-platform/shadcn-uikit/react'
import { Switch } from '@acronis-platform/shadcn-uikit/react'
import { Checkbox } from '@acronis-platform/shadcn-uikit/react'

export const ComponentShowcase: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-2xl font-bold my-2">Components Showcase</h3>
        <p className="text-sm text-muted-foreground">
          Explore a collection of reusable UI components, form elements, and
          design patterns built with shadcn/ui and Tailwind CSS.
        </p>
        <p className="text-sm text-muted-foreground">
          This showcase demonstrates available variants, states, and real-world
          usage.
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Cards</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a sample card component showing how your theme affects
                card styling.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge>Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Alerts</h3>
        <div className="space-y-3">
          <Alert variant="neutral">
            <AlertIcon>
              <InfrastructureIcon />
            </AlertIcon>
            <AlertContent>
              <AlertDescription>
                This is an informational alert message.
              </AlertDescription>
            </AlertContent>
          </Alert>

          <Alert variant="success">
            <AlertIcon>
              <SuccessIcon />
            </AlertIcon>
            <AlertContent>
              <AlertDescription>
                Operation completed successfully!
              </AlertDescription>
            </AlertContent>
          </Alert>

          <Alert variant="warning">
            <AlertIcon>
              <WarningIcon />
            </AlertIcon>
            <AlertContent>
              <AlertDescription>
                Please review this warning before proceeding.
              </AlertDescription>
            </AlertContent>
          </Alert>

          <Alert variant="critical">
            <AlertIcon>
              <CriticalIcon />
            </AlertIcon>
            <AlertContent>
              <AlertDescription>
                Critical issue detected that requires immediate attention.
              </AlertDescription>
            </AlertContent>
          </Alert>

          <Alert variant="destructive">
            <AlertIcon>
              <DangerIcon />
            </AlertIcon>
            <AlertContent>
              <AlertDescription>
                Danger! This action cannot be undone.
              </AlertDescription>
            </AlertContent>
          </Alert>

          <Alert variant="info">
            <AlertIcon>
              <InfoIcon />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>System Update Available</AlertTitle>
              <AlertDescription>
                A new version is ready to install. Click here to update now.
              </AlertDescription>
            </AlertContent>
          </Alert>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Form Elements</h3>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Enter your name" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm font-normal">
                Accept terms and conditions
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications" className="text-sm font-normal">
                Enable notifications
              </Label>
            </div>

            <Button className="w-full">Submit</Button>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Typography</h3>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <h3 className="text-2xl font-semibold">Heading 3</h3>
              <h4 className="text-xl font-semibold">Heading 4</h4>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-base">
                This is regular body text using the foreground color token.
              </p>
              <p className="text-sm text-muted-foreground">
                This is muted text using the muted-foreground color token.
              </p>
              <p className="text-xs text-muted-foreground">
                This is small text also using muted-foreground.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Badges & Status</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge className="bg-primary text-primary-foreground">
                Primary
              </Badge>
              <Badge className="bg-accent text-accent-foreground">Accent</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
