export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
  createdAt: Date
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface AuthStorage {
  token: string | null
  user: User | null
}
