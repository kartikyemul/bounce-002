import { hours, fmt, taken } from '../data/mock'
import { useBookings } from '../context/Bookings'

export default function SlotGrid({ court, day, selected, onPick }) {
  const { isBooked } = useBookings()
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
      {hours.map((h) => {
        const busy = taken(court, h, day.i) || isBooked(court, day.key, h)
        const on = selected === h
        return (
          <button key={h} disabled={busy} aria-pressed={on} onClick={() => onPick(h)}
            className={`rounded-md border-2 py-3 text-sm font-bold ${busy ? 'cursor-not-allowed border-deep/10 bg-deep/5 text-deep/35 line-through' : on ? 'border-deep bg-ball' : 'border-deep/30 bg-white hover:-translate-y-0.5 hover:border-deep'}`}>
            {fmt(h)}
          </button>
        )
      })}
    </div>
  )
}
