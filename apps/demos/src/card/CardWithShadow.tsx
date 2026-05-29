import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@acronis-platform/shadcn-uikit/react'

export function CardWithShadow() {
  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">John Doe</span> sent you a message
          </p>
          <p className="text-sm">
            <span className="font-medium">Jane Smith</span> liked your post
          </p>
          <p className="text-sm">
            <span className="font-medium">Bob Johnson</span> commented on your photo
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
