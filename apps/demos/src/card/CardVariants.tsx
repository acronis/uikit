import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@acronis-platform/shadcn-uikit/react'

export function CardVariants() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="w-full border-primary">
        <CardHeader>
          <CardTitle className="text-sm">Primary Border</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Card with primary color border</p>
        </CardContent>
      </Card>
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-sm">Error Border</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Card with error/destructive border</p>
        </CardContent>
      </Card>
      <Card className="w-full border-2">
        <CardHeader>
          <CardTitle className="text-sm">Thick Border</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Card with thicker border</p>
        </CardContent>
      </Card>
    </div>
  )
}
