import * as React from 'react'
import { MetricsCards } from './MetricsCards'
import { ChartsSection } from './ChartsSection'
import { RecentActivity } from './RecentActivity'
import { generateDashboardMetrics, generateTimeSeriesData, generateCategoryData, generateDistributionData, generateRecentActivity } from '../../lib/mock-data'
import { useLocale } from '../../context/LocaleContext'

export function DashboardPage() {
  const { t } = useLocale()
  const [metrics, setMetrics] = React.useState(() => generateDashboardMetrics())
  const [timeSeriesData] = React.useState(() => generateTimeSeriesData(30))
  const [categoryData, setCategoryData] = React.useState(() => generateCategoryData())
  const [distributionData, setDistributionData] = React.useState(() => generateDistributionData())
  const [recentActivity] = React.useState(() => generateRecentActivity())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateDashboardMetrics())
      setCategoryData(generateCategoryData())
      setDistributionData(generateDistributionData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('navigation.dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('messages.welcome', { username: 'User' })}
        </p>
      </div>

      <MetricsCards metrics={metrics} />

      <ChartsSection
        timeSeriesData={timeSeriesData}
        categoryData={categoryData}
        distributionData={distributionData}
      />

      <RecentActivity activities={recentActivity} maxItems={5} />
    </div>
  )
}
