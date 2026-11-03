const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const TZ = 'Asia/Kolkata' // the club's time zone, same as the backend setting
const OFFSET = '+05:30' // this zone has no daylight saving

async function request(path, options) {
  let res
  try {
    res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  if (!res.ok) {
    let msg = 'Something went wrong. Please try again.'
    try { msg = (await res.json()).message || msg } catch { /* no JSON body */ }
    throw new Error(msg)
  }
  return res.status === 204 ? null : res.json()
}

export const slotInstant = (date, h) => new Date(`${date}T${String(h).padStart(2, '0')}:00:00${OFFSET}`)

export const upcoming = () => request('/api/bookings/upcoming')
export const book = (courtId, date, h) =>
  request('/api/bookings', { method: 'POST', body: JSON.stringify({ courtId, startsAt: slotInstant(date, h).toISOString() }) })
export const cancel = (id) => request(`/api/bookings/${id}`, { method: 'DELETE' })
export const checkIn = (id) => request(`/api/bookings/${id}/check-in`, { method: 'PATCH' })

const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' })
const dateFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ })

// turns the server's booking into the shape the pages already use
export const toBooking = (b) => {
  const d = new Date(b.startsAt)
  return { id: b.id, court: b.courtId, date: dateFmt.format(d), h: parseInt(hourFmt.format(d), 10), checkedIn: b.status === 'CHECKED_IN' }
}
