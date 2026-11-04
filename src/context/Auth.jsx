import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import * as api from '../api'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!api.getToken())

  // if a token is saved, ask the server who it belongs to
  useEffect(() => {
    if (!api.getToken()) return
    api.me().then(setUser).catch(() => api.setToken(null)).finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.login(email, password)
    api.setToken(res.token)
    setUser(res.user)
    return res.user
  }
  const logout = async () => {
    try { await api.logout() } catch { /* already logged out */ }
    api.setToken(null)
    setUser(null)
  }

  return <Ctx.Provider value={{ user, role: user?.role ?? null, loading, login, logout }}>{children}</Ctx.Provider>
}

export function RequireRole({ role, children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="px-5 pt-10">Loading...</p>
  return user?.role === role ? children : <Navigate to="/login" replace />
}
