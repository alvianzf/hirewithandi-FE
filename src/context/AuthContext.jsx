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
      const response = await api.post('/auth/login', { email, password, app: 'job-tracker' })
      const { user: userData, token, refreshToken } = response.data.data
      
      const sessionData = {
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        token,
        refreshToken,
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

  const checkEmail = async (email) => {
    try {
      const response = await api.post('/auth/check-email', { email });
      return response.data.data; // { exists: boolean, hasPassword: boolean }
    } catch (e) {
      console.error('Failed to check email via API:', e);
      toast.error(e.response?.data?.error?.message || 'Failed to verify email');
      return null;
    }
  }

  const setupPassword = async (email, password) => {
    try {
      const response = await api.post('/auth/setup-password', { email, password, app: 'job-tracker' });
      const { user: userData, token, refreshToken } = response.data.data;
      
      const sessionData = {
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        token,
        refreshToken,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
      setUser(sessionData);
      toast.success('Password created successfully. Welcome!');
      return true;
    } catch (e) {
      console.error('Failed to setup password via API:', e);
      toast.error(e.response?.data?.error?.message || 'Failed to setup password');
      return false;
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
    <AuthContext.Provider value={{ user, login, logout, checkEmail, setupPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
