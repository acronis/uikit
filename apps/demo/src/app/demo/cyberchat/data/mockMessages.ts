import type { Message, TableData } from '../types'

const feedbackTableData: TableData = {
  headers: ['Category', 'Count', 'Type', 'Estimated time'],
  rows: [
    {
      Category: 'Delivery',
      Count: 5,
      Type: 'Tracking requests, minor delays',
      'Estimated time': '1 h',
    },
    {
      Category: 'Billing',
      Count: 4,
      Type: 'Invoice copies, pricing questions',
      'Estimated time': '48 min',
    },
    {
      Category: 'Technical',
      Count: 2,
      Type: 'Password reset, slow page load',
      'Estimated time': '30 min',
    },
    {
      Category: 'General',
      Count: 3,
      Type: 'Product availability, return policy',
      'Estimated time': '10 min',
    },
  ],
}

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    type: 'user',
    content:
      'Yes, I want you to prepare a quick summary of the remaining 14 non-urgent tickets:',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  },
  {
    id: 'msg-2',
    type: 'loading',
    content: 'Gathering info',
    timestamp: new Date(Date.now() - 9 * 60 * 1000), // 9 minutes ago
  },
  {
    id: 'msg-3',
    type: 'ai',
    content: "Here's a quick summary of the remaining 14 non-urgent tickets:",
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    badges: [
      { text: 'Source: Web', variant: 'outline' },
      { text: 'Confidence: High', variant: 'outline' },
    ],
  },
  {
    id: 'msg-4',
    type: 'ai',
    content: feedbackTableData,
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: 'msg-5',
    type: 'ai',
    content: `**Estimated handling time:** ~2.5 hours total

**Suggested assignment:** 1 junior agent + 1 billing specialist

Let me know if you want draft replies prepared in bulk or tickets assigned automatically.`,
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    actions: [
      { type: 'copy', label: 'Copy', active: false },
      { type: 'like', label: 'Like', active: false },
      { type: 'dislike', label: 'Dislike', active: false },
      { type: 'share', label: 'Share', active: false },
      { type: 'regenerate', label: 'Regenerate', active: false },
    ],
  },
  {
    id: 'msg-6',
    type: 'user',
    content:
      'Can you provide more details about the technical tickets? What specific issues are customers facing?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: 'msg-7',
    type: 'ai',
    content: `Based on the technical tickets, here are the specific issues:

**Password Reset Issues (1 ticket)**
- Customer unable to receive password reset email
- Issue: Email caught in spam filter
- Resolution time: ~15 minutes
- Action: Guide customer to check spam folder and whitelist domain

**Slow Page Load (1 ticket)**
- Dashboard taking 8-10 seconds to load
- Issue: Large dataset query without pagination
- Resolution time: ~15 minutes
- Action: Implement query optimization and add loading states

Both issues are straightforward and can be handled by a junior technical support agent with basic troubleshooting skills.`,
    timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    actions: [
      { type: 'copy', label: 'Copy', active: false },
      { type: 'like', label: 'Like', active: false },
      { type: 'dislike', label: 'Dislike', active: false },
      { type: 'share', label: 'Share', active: false },
      { type: 'regenerate', label: 'Regenerate', active: false },
    ],
    badges: [
      { text: 'Source: Knowledge Base', variant: 'outline' },
      { text: 'Confidence: High', variant: 'outline' },
    ],
  },
]
