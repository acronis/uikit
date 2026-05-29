import {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetContent,
  WidgetFooter,
  WidgetValue,
  WidgetLabel,
} from '@acronis-platform/shadcn-uikit/react'
import { TrendingUpIcon } from '../icons/missing-icons'
export function WidgetInteractive() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Widget interactive className="w-[280px]">
        <WidgetHeader>
          <WidgetIcon>
            <TrendingUpIcon className="h-4 w-4" />
          </WidgetIcon>
          <WidgetTitle>Clickable Widget</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>+12.5%</WidgetValue>
          <WidgetLabel>Growth this quarter</WidgetLabel>
        </WidgetContent>
        <WidgetFooter>
          <p className="text-xs text-muted-foreground">
            Hover, click, or focus to see interactive states
          </p>
        </WidgetFooter>
      </Widget>

      <Widget className="w-[280px]">
        <WidgetHeader>
          <WidgetTitle>Non-interactive</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>Static</WidgetValue>
          <WidgetLabel>This widget has no hover/focus states</WidgetLabel>
        </WidgetContent>
      </Widget>
    </div>
  )
}
