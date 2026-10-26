import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null)
  return <Ctx.Provider value={{ role, login: setRole, logout: () => setRole(null) }}>{children}</Ctx.Provider>
}

export function RequireRole({ role, children }) {
  const { role: current } = useAuth()
  return current === role ? children : <Navigate to="/login" replace />
}
