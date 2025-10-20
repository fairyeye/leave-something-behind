import React, { createContext, useContext, useEffect, useState } from 'react'
import api from './api'

export type User = {
  id: number
  username: string
  email: string
  createdAt: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (identifier: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      refreshMe()
    }
  }, [token])

  const login = async (identifier: string, password: string) => {
    const res = await api.post('/api/auth/login', { identifier, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
  }

  const register = async (username: string, email: string, password: string) => {
    await api.post('/api/auth/register', { username, email, password })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const refreshMe = async () => {
    try {
      const res = await api.get('/api/user/me')
      setUser(res.data)
    } catch (e) {
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
