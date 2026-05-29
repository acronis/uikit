import { Separator } from '@acronis-platform/shadcn-uikit/react'

export function SeparatorMultiple() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-semibold">Introduction</h4>
        <p className="text-sm text-muted-foreground">
          Welcome to our application. This is the introduction section.
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="mb-2 text-sm font-semibold">Features</h4>
        <p className="text-sm text-muted-foreground">
          Discover all the amazing features we offer.
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="mb-2 text-sm font-semibold">Pricing</h4>
        <p className="text-sm text-muted-foreground">
          Choose the plan that works best for you.
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="mb-2 text-sm font-semibold">Contact</h4>
        <p className="text-sm text-muted-foreground">Get in touch with our support team.</p>
      </div>
    </div>
  )
}
