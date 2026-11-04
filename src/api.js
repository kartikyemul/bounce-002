const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const TZ = 'Asia/Kolkata' // the club's time zone, same as the backend setting
const OFFSET = '+05:30' // this zone has no daylight saving
const KEY = 'bounce002.token'

export const getToken = () => {
  try { return localStorage.getItem(KEY) } catch { return null }
}
export const setToken = (t) => {
  try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  let res
  try {
    res = await fetch(BASE + path, { ...options, headers })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  if (res.status === 401 && token && !path.startsWith('/api/auth/')) {
    setToken(null) // the session expired, so send them to log in again
    window.location.assign('/login')
  }
  if (!res.ok) {
    let msg = 'Something went wrong. Please try again.'
    try { msg = (await res.json()).message || msg } catch { /* no JSON body */ }
    throw new Error(msg)
  }
  return res.status === 204 ? null : res.json()
}
const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })

// accounts
export const signup = (fullName, email, password) => post('/api/auth/signup', { fullName, email, password })
export const verify = (token) => post('/api/auth/verify', { token })
export const login = (email, password) => post('/api/auth/login', { email, password })
export const logout = () => request('/api/auth/logout', { method: 'POST' })
export const me = () => request('/api/auth/me')
export const acceptInvite = (token, fullName, password) => post('/api/auth/accept-invite', { token, fullName, password })
export const inchargeList = () => request('/api/admin/incharges')
export const invite = (email, courtId) => post('/api/admin/incharges', { email, courtId })

// bookings
export const slotInstant = (date, h) => new Date(`${date}T${String(h).padStart(2, '0')}:00:00${OFFSET}`)
export const upcoming = () => request('/api/bookings/upcoming')
export const mine = () => request('/api/bookings/mine')
export const book = (courtId, date, h) => post('/api/bookings', { courtId, startsAt: slotInstant(date, h).toISOString() })
export const cancel = (id) => request(`/api/bookings/${id}`, { method: 'DELETE' })
export const checkIn = (id) => request(`/api/bookings/${id}/check-in`, { method: 'PATCH' })

const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' })
const dateFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ })

// turns the server's booking into the shape the pages use
export const toBooking = (b) => {
  const d = new Date(b.startsAt)
  return { id: b.id, court: b.courtId, date: dateFmt.format(d), h: parseInt(hourFmt.format(d), 10), checkedIn: b.status === 'CHECKED_IN' }
}
