export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  }

  // Fallback for older browsers
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  document.body.appendChild(textArea)
  textArea.select()

  try {
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return Promise.resolve()
  } catch (err) {
    document.body.removeChild(textArea)
    return Promise.reject(err)
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

export function filterBySearchQuery<T extends Record<string, any>>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query.trim()) {
    return items
  }

  const lowerQuery = query.toLowerCase()

  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerQuery)
      }
      return false
    })
  )
}

export function getUsageColor(
  usage: number
): 'green' | 'yellow' | 'red' {
  if (usage <= 33) return 'green'
  if (usage <= 66) return 'yellow'
  return 'red'
}

export function scrollToBottom(element: HTMLElement | null, smooth = true) {
  if (!element) return

  element.scrollTo({
    top: element.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  })
}
