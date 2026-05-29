import {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetContent,
  WidgetDivider,
  WidgetValue,
  WidgetLabel,
} from '@acronis-platform/shadcn-uikit/react'
import { ActivityIcon } from '../icons/missing-icons'
export function WidgetWithDivider() {
  return (
    <Widget className="w-[350px]">
      <WidgetHeader>
        <WidgetIcon>
          <ActivityIcon className="h-4 w-4" />
        </WidgetIcon>
        <WidgetTitle>System Health</WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        <div className="flex items-center justify-between">
          <WidgetLabel>CPU Usage</WidgetLabel>
          <WidgetValue>32%</WidgetValue>
        </div>
      </WidgetContent>
      <WidgetDivider />
      <WidgetContent>
        <div className="flex items-center justify-between">
          <WidgetLabel>Memory</WidgetLabel>
          <WidgetValue>64%</WidgetValue>
        </div>
      </WidgetContent>
      <WidgetDivider />
      <WidgetContent>
        <div className="flex items-center justify-between">
          <WidgetLabel>Disk I/O</WidgetLabel>
          <WidgetValue>18%</WidgetValue>
        </div>
      </WidgetContent>
    </Widget>
  )
}
