import type {
  DataRow,
  DashboardMetrics,
  ActivityLog,
  TimeSeriesData,
  CategoryData,
  DistributionData,
} from '../types'

export function generateSeedData(): DataRow[] {
  const categories = ['Marketing', 'Sales', 'Development', 'Support', 'Operations']
  const statuses: DataRow['status'][] = ['active', 'inactive', 'pending']
  const names = [
    'Product Launch Campaign',
    'Customer Onboarding Flow',
    'Website Redesign',
    'Mobile App Development',
    'Q1 Sales Initiative',
    'Email Marketing Campaign',
    'Social Media Strategy',
    'Customer Support Portal',
    'Analytics Dashboard',
    'Payment Integration',
    'User Authentication System',
    'Content Management System',
    'API Documentation',
    'Performance Optimization',
    'Security Audit',
    'Database Migration',
    'Cloud Infrastructure',
    'CI/CD Pipeline',
    'Monitoring System',
    'Backup Solution',
  ]

  return Array.from({ length: 20 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: names[i],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    value: Math.floor(Math.random() * 50000) + 1000,
    description: `Description for ${names[i]}`,
    tags: ['demo', 'sample'],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }))
}

export function generateDashboardMetrics(): DashboardMetrics {
  const baseMetrics = {
    totalUsers: 1247,
    revenue: 45320.5,
    activeSessions: 89,
    growth: 12.5,
  }

  return {
    totalUsers: baseMetrics.totalUsers + Math.floor((Math.random() - 0.5) * 20),
    revenue: baseMetrics.revenue + (Math.random() - 0.5) * 1000,
    activeSessions: baseMetrics.activeSessions + Math.floor((Math.random() - 0.5) * 10),
    growth: baseMetrics.growth + (Math.random() - 0.5) * 2,
    lastUpdated: new Date(),
  }
}

export function generateTimeSeriesData(days: number = 30): TimeSeriesData {
  const baseValue = 100
  const data: TimeSeriesData = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    const variation = (Math.random() - 0.5) * 20
    const value = Math.max(0, baseValue + variation + i * 2)

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    })
  }

  return data
}

export function generateCategoryData(): CategoryData {
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books']
  const baseValues = [12500, 8300, 6700, 5200, 4100]

  return categories.map((category, i) => ({
    category,
    value: baseValues[i] + Math.floor((Math.random() - 0.5) * 1000),
  }))
}

export function generateDistributionData(): DistributionData {
  const segments = [
    { name: 'Free', baseValue: 620 },
    { name: 'Pro', baseValue: 380 },
    { name: 'Enterprise', baseValue: 247 },
  ]

  return segments.map((segment, i) => ({
    name: segment.name,
    value: segment.baseValue + Math.floor((Math.random() - 0.5) * 50),
    fill: `var(--av-chart-${i + 1})`,
  }))
}

export function generateRecentActivity(): ActivityLog {
  const activities = [
    { type: 'create' as const, message: 'New campaign "Summer Sale" created', user: 'John Doe' },
    { type: 'update' as const, message: 'Campaign "Product Launch" updated', user: 'Jane Smith' },
    {
      type: 'delete' as const,
      message: 'Old campaign "Spring Promo" deleted',
      user: 'Bob Johnson',
    },
    { type: 'login' as const, message: 'User logged in from new device', user: 'Alice Williams' },
    { type: 'create' as const, message: 'New user account created', user: 'System' },
  ]

  return activities.map((activity, i) => ({
    id: crypto.randomUUID(),
    type: activity.type,
    message: activity.message,
    user: activity.user,
    timestamp: new Date(Date.now() - i * 15 * 60 * 1000),
    status: 'success' as const,
  }))
}
