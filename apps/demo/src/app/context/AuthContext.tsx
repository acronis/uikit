import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types/auth'
import { getStorage, updateAuthStorage } from '../lib/storage'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const navigate = useNavigate()

  React.useEffect(() => {
    const storage = getStorage()
    if (storage.auth.token && storage.auth.user) {
      setUser(storage.auth.user)
    }
    setIsLoading(false)
  }, [])

  const login = React.useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email format')
      }
      if (!password) {
        throw new Error('Password is required')
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      const mockToken = `mock_jwt_${btoa(email)}_${Date.now()}`
      const newUser: User = {
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'admin',
        createdAt: new Date(),
      }

      updateAuthStorage({ token: mockToken, user: newUser })
      setUser(newUser)
      navigate('/demo/dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  const logout = React.useCallback(() => {
    updateAuthStorage({ token: null, user: null })
    setUser(null)
    navigate('/demo/login')
  }, [navigate])

  const updateUser = React.useCallback((updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in')
    }
    const updatedUser = { ...user, ...updates }
    updateAuthStorage({ token: getStorage().auth.token, user: updatedUser })
    setUser(updatedUser)
  }, [user])

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, isLoading, login, logout, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
