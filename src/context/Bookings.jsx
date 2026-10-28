import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'bounce002.bookings'
const Ctx = createContext(null)
export const useBookings = () => useContext(Ctx)

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

// saved in this browser only, until the backend and database replace it
export function BookingsProvider({ children }) {
  const [list, setList] = useState(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* storage unavailable */ }
  }, [list])

  const add = (b) => setList((l) => [...l, { ...b, id: uid(), checkedIn: false }])
  const cancel = (id) => setList((l) => l.filter((b) => b.id !== id))
  const checkIn = (id) => setList((l) => l.map((b) => (b.id === id ? { ...b, checkedIn: !b.checkedIn } : b)))
  const isBooked = (court, date, h) => list.some((b) => b.court === court && b.date === date && b.h === h)

  return <Ctx.Provider value={{ list, add, cancel, checkIn, isBooked }}>{children}</Ctx.Provider>
}
