export const courts = [1, 2, 3, 4].map((n) => ({ id: n, name: `Court ${n}` }))
export const hours = Array.from({ length: 14 }, (_, i) => 8 + i)
export const fmt = (h) => `${h % 12 || 12} ${h < 12 ? 'am' : 'pm'}`

const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// the next 7 days, i = days from today
export const days = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      i,
      key: key(d),
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString(undefined, { weekday: 'short' }),
      sub: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    }
  })

// fake "already booked by others" rule until the backend exists
export const taken = (court, h, i = 0) => (court * 7 + h * 3 + i * 2) % 5 === 0
