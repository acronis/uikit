import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function CardProduct() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Premium Plan</CardTitle>
          <CardDescription>For professional use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <span className="text-3xl font-bold">$29</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✓ Unlimited projects</li>
            <li>✓ Priority support</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Custom domain</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Subscribe</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Plan</CardTitle>
          <CardDescription>For large organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <span className="text-3xl font-bold">$99</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✓ Everything in Premium</li>
            <li>✓ Dedicated support</li>
            <li>✓ SSO authentication</li>
            <li>✓ SLA guarantee</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Contact Sales</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
