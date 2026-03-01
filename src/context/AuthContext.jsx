import { createContext, useContext, useState } from 'react'
import api from '../utils/api'
import { toast } from 'sonner'

const AuthContext = createContext(null)

const AUTH_KEY = 'hwa_auth'

function loadAuth() {
  try {
    const data = localStorage.getItem(AUTH_KEY)
    if (data) return JSON.parse(data)
  } catch (e) {
    console.error('Failed to load auth:', e)
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadAuth())

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user: userData, token } = response.data.data
      
      const sessionData = {
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        token: token,
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData))
      setUser(sessionData)
      toast.success('Welcome back!')
      return true
    } catch (e) {
      console.error('Failed to login via API:', e)
      toast.error(e.response?.data?.error?.message || 'Login failed')
      return false
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_KEY)
      toast.info('Logged out')
    } catch (e) {
      console.error('Failed to clear auth:', e)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
