import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as api from '../api'

const Ctx = createContext(null)
export const useCourts = () => useContext(Ctx)

// the courts that are open for booking, loaded from the backend
export function CourtsProvider({ children }) {
  const [courts, setCourts] = useState([])
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setCourts(await api.courts())
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }, [])
  useEffect(() => { reload() }, [reload])

  return <Ctx.Provider value={{ courts, error, reload }}>{children}</Ctx.Provider>
}
