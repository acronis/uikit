import {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetActions,
  WidgetContent,
  WidgetFooter,
  WidgetValue,
  WidgetLabel,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { ShieldIcon, WarningCircleIcon } from '@acronis-platform/shadcn-uikit'
import {
  ActivityIcon,
  BarChart3Icon,
  MoreVerticalIcon,
  TrendingUpIcon,
} from '../icons/missing-icons'
export function WidgetDashboardGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Widget interactive>
        <WidgetHeader>
          <WidgetIcon>
            <ShieldIcon className="h-4 w-4" />
          </WidgetIcon>
          <WidgetTitle>Protected</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>1,284</WidgetValue>
          <WidgetLabel>Workloads</WidgetLabel>
        </WidgetContent>
      </Widget>

      <Widget interactive>
        <WidgetHeader>
          <WidgetIcon>
            <WarningCircleIcon className="h-4 w-4" />
          </WidgetIcon>
          <WidgetTitle>Alerts</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>7</WidgetValue>
          <WidgetLabel>Active alerts</WidgetLabel>
        </WidgetContent>
      </Widget>

      <Widget interactive>
        <WidgetHeader>
          <WidgetIcon>
            <TrendingUpIcon className="h-4 w-4" />
          </WidgetIcon>
          <WidgetTitle>Storage</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <WidgetValue>3.2 TB</WidgetValue>
          <WidgetLabel>Used of 5 TB</WidgetLabel>
        </WidgetContent>
      </Widget>

      <Widget size="lg" className="col-span-2">
        <WidgetHeader>
          <WidgetIcon>
            <BarChart3Icon className="h-4 w-4" />
          </WidgetIcon>
          <WidgetTitle>Backup Success Rate</WidgetTitle>
          <WidgetActions>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </WidgetActions>
        </WidgetHeader>
        <WidgetContent>
          <p className="text-sm text-muted-foreground">
            Chart placeholder — visualization content area
          </p>
        </WidgetContent>
        <WidgetFooter>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </WidgetFooter>
      </Widget>

      <Widget size="lg">
        <WidgetHeader>
          <WidgetIcon>
            <ActivityIcon className="h-4 w-4" />
          </WidgetIcon>
          <WidgetTitle>ActivityIcon</WidgetTitle>
        </WidgetHeader>
        <WidgetContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <WidgetLabel>Backups</WidgetLabel>
              <span className="text-sm font-medium tabular-nums">248</span>
            </div>
            <div className="flex items-center justify-between">
              <WidgetLabel>Restores</WidgetLabel>
              <span className="text-sm font-medium tabular-nums">12</span>
            </div>
            <div className="flex items-center justify-between">
              <WidgetLabel>Failures</WidgetLabel>
              <span className="text-sm font-medium tabular-nums">3</span>
            </div>
          </div>
        </WidgetContent>
      </Widget>
    </div>
  )
}
