import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as api from '../api'
import { useAuth } from './Auth'

const Ctx = createContext(null)
export const useBookings = () => useContext(Ctx)

export function BookingsProvider({ children }) {
  const { user } = useAuth()
  const [list, setList] = useState([]) // every upcoming booking, used to grey out taken slots
  const [mine, setMine] = useState([]) // the logged-in customer's own bookings
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!user) { setList([]); setMine([]); return }
    try {
      setList((await api.upcoming()).map(api.toBooking))
      if (user.role === 'CUSTOMER') setMine((await api.mine()).map(api.toBooking))
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }, [user])
  useEffect(() => { refresh() }, [refresh])

  // runs a change, reloads, and returns an error message ('' means it worked)
  const run = async (fn) => {
    try { await fn(); await refresh(); return '' } catch (e) { await refresh(); return e.message }
  }
  const add = (b) => run(() => api.book(b.court, b.date, b.h))
  const cancel = (id) => run(() => api.cancel(id))
  const checkIn = (id) => run(() => api.checkIn(id))
  const isBooked = (court, date, h) => list.some((b) => b.court === court && b.date === date && b.h === h)

  return <Ctx.Provider value={{ list, mine, error, add, cancel, checkIn, isBooked }}>{children}</Ctx.Provider>
}
