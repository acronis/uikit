export interface DataRow {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  category: string
  value: number
  description?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface DataRowFormData {
  name: string
  status: 'active' | 'inactive' | 'pending'
  category: string
  value: number
  description?: string
  tags?: string[]
}

export interface DashboardMetrics {
  totalUsers: number
  revenue: number
  activeSessions: number
  growth: number
  lastUpdated: Date
}

export interface ActivityLogEntry {
  id: string
  type: 'create' | 'update' | 'delete' | 'login' | 'other'
  message: string
  user?: string
  timestamp: Date
  status?: 'success' | 'warning' | 'error'
}

export type ActivityLog = ActivityLogEntry[]

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    frequency: 'realtime' | 'daily' | 'weekly'
  }
  display: {
    density: 'comfortable' | 'compact'
    sidebarCollapsed: boolean
  }
}

export interface ProfileFormData {
  name: string
  email: string
  avatar?: string
}

export interface PasswordChangeFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface LocalStorageSchema {
  version: number
  auth: {
    token: string | null
    user: User | null
  }
  data: {
    rows: DataRow[]
    lastSync: Date
  }
  preferences: UserPreferences
  dashboard: {
    metrics: DashboardMetrics
    lastRefresh: Date
  }
}

import type { User } from './auth'
