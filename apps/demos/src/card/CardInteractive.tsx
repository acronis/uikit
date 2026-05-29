import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@acronis-platform/shadcn-uikit/react'

export function CardInteractive() {
  return (
    <Card className="w-[350px] cursor-pointer transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Hover Me</CardTitle>
        <CardDescription>This card has hover effects</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Hover over this card to see the shadow effect.
        </p>
      </CardContent>
    </Card>
  )
}
