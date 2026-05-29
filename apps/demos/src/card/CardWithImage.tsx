import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function CardWithImage() {
  return (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600" />
      <CardHeader>
        <CardTitle>Beautiful Landscape</CardTitle>
        <CardDescription>A stunning view of nature</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Discover the beauty of natural landscapes with our curated collection.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">View Gallery</Button>
      </CardFooter>
    </Card>
  )
}
