import { Card } from '@acronis-platform/shadcn-uikit/react'

export function CardCompact() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-4">
        <div className="text-sm font-medium">Active Users</div>
        <div className="text-2xl font-bold">1,234</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm font-medium">Total Sales</div>
        <div className="text-2xl font-bold">$45.2K</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm font-medium">Conversion</div>
        <div className="text-2xl font-bold">3.2%</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm font-medium">Growth</div>
        <div className="text-2xl font-bold">+12%</div>
      </Card>
    </div>
  )
}
