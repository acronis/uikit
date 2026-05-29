import type { LocalStorageSchema } from '../types/data'
import type { UserPreferences } from '../types/data'

const STORAGE_KEY = 'shadcn-demo-app'
const STORAGE_VERSION = 1

export function getDefaultStorage(): LocalStorageSchema {
  return {
    version: STORAGE_VERSION,
    auth: {
      token: null,
      user: null,
    },
    data: {
      rows: [],
      lastSync: new Date(),
    },
    preferences: {
      theme: 'system',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        frequency: 'daily',
      },
      display: {
        density: 'comfortable',
        sidebarCollapsed: false,
      },
    },
    dashboard: {
      metrics: {
        totalUsers: 0,
        revenue: 0,
        activeSessions: 0,
        growth: 0,
        lastUpdated: new Date(),
      },
      lastRefresh: new Date(),
    },
  }
}

export function getStorage(): LocalStorageSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultStorage()

    const data = JSON.parse(raw, (key, value) => {
      if (
        key === 'createdAt' ||
        key === 'updatedAt' ||
        key === 'lastSync' ||
        key === 'lastUpdated' ||
        key === 'lastRefresh' ||
        key === 'timestamp'
      ) {
        return new Date(value)
      }
      return value
    })

    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, resetting to default')
      return getDefaultStorage()
    }

    return data
  } catch (error) {
    console.error('Failed to parse storage:', error)
    return getDefaultStorage()
  }
}

export function setStorage(updates: Partial<LocalStorageSchema>): void {
  try {
    const current = getStorage()
    const updated = { ...current, ...updates, version: STORAGE_VERSION }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded')
      throw new Error('Storage quota exceeded. Please clear some data.')
    }
    console.error('Failed to save storage:', error)
    throw error
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function updateAuthStorage(auth: LocalStorageSchema['auth']): void {
  setStorage({ auth })
}

export function updateDataStorage(data: LocalStorageSchema['data']): void {
  setStorage({ data })
}

export function updatePreferences(preferences: Partial<UserPreferences>): void {
  const current = getStorage()
  setStorage({
    preferences: { ...current.preferences, ...preferences },
  })
}
