import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@acronis-platform/shadcn-uikit/react'

export function CardList() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Pushed to repository</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Created new branch</p>
              <p className="text-sm text-muted-foreground">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Merged pull request</p>
              <p className="text-sm text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
