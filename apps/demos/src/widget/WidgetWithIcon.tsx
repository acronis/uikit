import {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetActions,
  WidgetContent,
  WidgetValue,
  WidgetLabel,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { ShieldIcon } from '@acronis-platform/shadcn-uikit'
import { MoreVerticalIcon } from '../icons/missing-icons'
export function WidgetWithIcon() {
  return (
    <Widget className="w-[350px]">
      <WidgetHeader>
        <WidgetIcon>
          <ShieldIcon className="h-4 w-4" />
        </WidgetIcon>
        <WidgetTitle>Protection Status</WidgetTitle>
        <WidgetActions>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </WidgetActions>
      </WidgetHeader>
      <WidgetContent>
        <WidgetValue>All Clear</WidgetValue>
        <WidgetLabel>No issues detected</WidgetLabel>
      </WidgetContent>
    </Widget>
  )
}
