import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as api from '../api'

const Ctx = createContext(null)
export const useBookings = () => useContext(Ctx)

export function BookingsProvider({ children }) {
  const [list, setList] = useState([])
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      setList((await api.upcoming()).map(api.toBooking))
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }, [])
  useEffect(() => { refresh() }, [refresh])

  // runs a change, reloads the list, and returns an error message ('' means it worked)
  const run = async (fn) => {
    try { await fn(); await refresh(); return '' } catch (e) { await refresh(); return e.message }
  }
  const add = (b) => run(() => api.book(b.court, b.date, b.h))
  const cancel = (id) => run(() => api.cancel(id))
  const checkIn = (id) => run(() => api.checkIn(id))
  const isBooked = (court, date, h) => list.some((b) => b.court === court && b.date === date && b.h === h)

  return <Ctx.Provider value={{ list, error, add, cancel, checkIn, isBooked }}>{children}</Ctx.Provider>
}
