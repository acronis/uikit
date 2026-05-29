import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
  WidgetValue,
  WidgetLabel,
} from '@acronis-platform/shadcn-uikit/react'

export function WidgetValueDisplay() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Widget className="w-[220px]">
        <WidgetHeader>
          <WidgetTitle>Revenue</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>$45,231</WidgetValue>
          <WidgetLabel>+20.1% from last month</WidgetLabel>
        </WidgetContent>
      </Widget>

      <Widget className="w-[220px]">
        <WidgetHeader>
          <WidgetTitle>Users</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>2,350</WidgetValue>
          <WidgetLabel>+180 this week</WidgetLabel>
        </WidgetContent>
      </Widget>

      <Widget className="w-[220px]">
        <WidgetHeader>
          <WidgetTitle>Uptime</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>99.9%</WidgetValue>
          <WidgetLabel>Last 30 days</WidgetLabel>
        </WidgetContent>
      </Widget>
    </div>
  )
}
