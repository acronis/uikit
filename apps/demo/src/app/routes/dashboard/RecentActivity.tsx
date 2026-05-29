import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'
import { Badge } from '@acronis-platform/shadcn-uikit/react'
import { formatDistanceToNow } from 'date-fns'
import type { ActivityLog } from '../../types'

interface RecentActivityProps {
  activities: ActivityLog
  maxItems?: number
  isLoading?: boolean
}

export function RecentActivity({ activities, maxItems = 5, isLoading = false }: RecentActivityProps) {
  const displayedActivities = activities.slice(0, maxItems)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`h-2 w-2 mt-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' :
                activity.status === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.message}</p>
                <div className="flex items-center gap-2">
                  {activity.user && (
                    <span className="text-xs text-muted-foreground">{activity.user}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
