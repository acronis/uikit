import * as React from 'react'
import { UsersIcon } from '@acronis-platform/shadcn-uikit'
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, ActivityIcon } from '@/components/icons/missing-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'
import type { DashboardMetrics } from '../../types'

interface MetricsCardsProps {
  metrics: DashboardMetrics
  isLoading?: boolean
}

export function MetricsCards({ metrics, isLoading = false }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      icon: UsersIcon,
      trend: metrics.growth > 0 ? 'up' : 'down',
      trendValue: `${Math.abs(metrics.growth).toFixed(1)}%`,
    },
    {
      title: 'Revenue',
      value: `$${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSignIcon,
      trend: metrics.growth > 0 ? 'up' : 'down',
      trendValue: `${Math.abs(metrics.growth).toFixed(1)}%`,
    },
    {
      title: 'Active Sessions',
      value: metrics.activeSessions.toLocaleString(),
      icon: ActivityIcon,
      trend: 'up',
      trendValue: 'Live',
    },
    {
      title: 'Growth',
      value: `${metrics.growth.toFixed(1)}%`,
      icon: metrics.growth > 0 ? TrendingUpIcon : TrendingDownIcon,
      trend: metrics.growth > 0 ? 'up' : 'down',
      trendValue: 'vs last month',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {card.trend === 'up' ? (
                  <TrendingUpIcon className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDownIcon className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span>{card.trendValue}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
