import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
  WidgetFooter,
} from '@acronis-platform/shadcn-uikit/react'

export function WidgetBasic() {
  return (
    <Widget className="w-[350px]">
      <WidgetHeader>
        <WidgetTitle>Widget Title</WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        <p className="text-sm text-muted-foreground">
          A basic widget with header, content, and footer sections.
        </p>
      </WidgetContent>
      <WidgetFooter>
        <p className="text-xs text-muted-foreground">Last updated: just now</p>
      </WidgetFooter>
    </Widget>
  )
}
