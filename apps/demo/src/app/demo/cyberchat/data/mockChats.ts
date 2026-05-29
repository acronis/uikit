import type { Chat } from '../types'

export const mockChats: Chat[] = [
  {
    id: 'sales-follow-up',
    title: 'Sales follow-up',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    preview: 'Discussing Q4 sales targets and pipeline...',
  },
  {
    id: 'customer-feedback-triage',
    title: 'Customer feedback triage',
    hasAlert: true,
    lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    preview: 'Analyzing 14 non-urgent support tickets...',
  },
  {
    id: 'marketing-campaign-strategy',
    title: 'Marketing campaign strategy',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    preview: 'Planning social media campaign for product launch...',
  },
  {
    id: 'feature-demo',
    title: 'Feature demo',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    preview: 'Preparing demo script for new dashboard features...',
  },
  {
    id: 'security-audit-review',
    title: 'Security audit review',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    preview: 'Reviewing findings from latest security assessment...',
  },
  {
    id: 'onboarding-improvements',
    title: 'Onboarding improvements',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    preview: 'Brainstorming ways to improve user onboarding flow...',
  },
  {
    id: 'api-documentation',
    title: 'API documentation',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    preview: 'Writing comprehensive API docs for v2 endpoints...',
  },
  {
    id: 'performance-optimization',
    title: 'Performance optimization',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    preview: 'Identifying bottlenecks in data processing pipeline...',
  },
  {
    id: 'compliance-checklist',
    title: 'Compliance checklist',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    preview: 'GDPR and SOC 2 compliance requirements review...',
  },
  {
    id: 'team-retrospective',
    title: 'Team retrospective',
    hasAlert: false,
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    preview: 'Sprint retrospective notes and action items...',
  },
]
