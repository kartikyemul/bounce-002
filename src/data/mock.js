export const courts = [1, 2, 3, 4].map((n) => ({ id: n, name: `Court ${n}` }))
export const hours = Array.from({ length: 14 }, (_, i) => 8 + i)
export const fmt = (h) => `${h % 12 || 12} ${h < 12 ? 'am' : 'pm'}`
// fake "already booked" rule so the grid looks real until the backend exists
export const taken = (court, h) => (court * 7 + h * 3) % 5 === 0
