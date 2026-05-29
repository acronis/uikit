import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@acronis-platform/shadcn-uikit/react'

export function CardMultiple() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>+20.1% from last month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>+180.1% from last month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2,350</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>+19% from last month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
        </CardContent>
      </Card>
    </div>
  )
}
