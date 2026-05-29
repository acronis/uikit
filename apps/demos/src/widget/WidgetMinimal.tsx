import {
  Widget,
  WidgetContent,
} from '@acronis-platform/shadcn-uikit/react'

export function WidgetMinimal() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Widget className="w-[300px]">
        <WidgetContent>
          <p className="text-sm text-muted-foreground">
            A minimal widget with content only — no header or footer.
          </p>
        </WidgetContent>
      </Widget>

      <Widget size="sm" className="w-[300px]">
        <WidgetContent className="flex items-center justify-center">
          <p className="text-sm font-medium">Small content-only widget</p>
        </WidgetContent>
      </Widget>
    </div>
  )
}
