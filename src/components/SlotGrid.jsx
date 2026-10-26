import { hours, fmt, taken } from '../data/mock'

export default function SlotGrid({ court, selected, onPick, mine = [] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
      {hours.map((h) => {
        const busy = taken(court, h) || mine.some((m) => m.court === court && m.h === h)
        const on = selected === h
        return (
          <button key={h} disabled={busy} aria-pressed={on} onClick={() => onPick(h)}
            className={`rounded-md border-2 py-3 text-sm font-bold ${busy ? 'cursor-not-allowed border-deep/10 bg-deep/5 text-deep/35 line-through' : on ? 'border-deep bg-ball' : 'border-deep/30 bg-white hover:border-deep'}`}>
            {fmt(h)}
          </button>
        )
      })}
    </div>
  )
}
