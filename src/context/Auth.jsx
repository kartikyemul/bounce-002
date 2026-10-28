import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'

const KEY = 'bounce002.role'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

// demo only: real login with tokens comes with the backend
export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    try { return localStorage.getItem(KEY) } catch { return null }
  })
  const set = (r) => {
    setRole(r)
    try { r ? localStorage.setItem(KEY, r) : localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
  }
  return <Ctx.Provider value={{ role, login: set, logout: () => set(null) }}>{children}</Ctx.Provider>
}

export function RequireRole({ role, children }) {
  const { role: current } = useAuth()
  return current === role ? children : <Navigate to="/login" replace />
}
