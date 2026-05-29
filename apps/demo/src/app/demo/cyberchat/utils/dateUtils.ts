import { formatDistanceToNow, format } from 'date-fns'

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}h ago`
  } else if (diffInMinutes < 10080) {
    const days = Math.floor(diffInMinutes / 1440)
    return days === 1 ? 'Yesterday' : `${days}d ago`
  } else {
    return format(date, 'MMM d')
  }
}

export function formatMessageTime(date: Date): string {
  return format(date, 'h:mm a')
}

export function formatFullTimestamp(date: Date): string {
  const now = new Date()
  const isToday = now.toDateString() === date.toDateString()

  if (isToday) {
    return `Today at ${format(date, 'h:mm a')}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = yesterday.toDateString() === date.toDateString()

  if (isYesterday) {
    return `Yesterday at ${format(date, 'h:mm a')}`
  }

  return format(date, 'MMM d, yyyy \'at\' h:mm a')
}

export function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}
