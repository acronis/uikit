import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
  WidgetValue,
  WidgetLabel,
} from '@acronis-platform/shadcn-uikit/react'

export function WidgetSizes() {
  return (
    <div className="flex items-start gap-4 flex-wrap">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Widget key={size} size={size} className="w-[200px]">
          <WidgetHeader>
            <WidgetTitle>Size: {size}</WidgetTitle>
          </WidgetHeader>
          <WidgetContent>
            <WidgetValue>123</WidgetValue>
            <WidgetLabel>Items</WidgetLabel>
          </WidgetContent>
        </Widget>
      ))}
    </div>
  )
}
