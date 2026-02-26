import { createContext, useContext, useState } from 'react'

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

  const login = (profileData) => {
    const userData = {
      name: profileData.name.trim(),
      email: profileData.email.trim(),
      createdAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    } catch (e) {
      console.error('Failed to save auth:', e)
    }
    setUser(userData)
  }

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_KEY)
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
