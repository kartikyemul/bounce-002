import { useState } from 'react'
import DashShell from '../components/DashShell'
import SlotGrid from '../components/SlotGrid'
import { useBookings } from '../context/Bookings'
import { courts, days, fmt } from '../data/mock'

const week = days()

export default function Customer() {
  const { list, add, cancel } = useBookings()
  const [court, setCourt] = useState(1)
  const [day, setDay] = useState(week[0])
  const [slot, setSlot] = useState(null)
  const [toast, setToast] = useState('')

  const confirm = () => {
    add({ court, date: day.key, h: slot })
    setToast(`Booked Court ${court}, ${day.label} at ${fmt(slot)}`)
    setSlot(null)
    setTimeout(() => setToast(''), 3000)
  }
  const label = (k) => week.find((d) => d.key === k)?.label ?? k
  const mine = [...list].sort((a, b) => a.date.localeCompare(b.date) || a.h - b.h)
  const pill = (on) => `rounded-full px-4 py-2 text-sm font-semibold ${on ? 'bg-deep text-mist' : 'bg-deep/10 hover:bg-deep/20'}`

  return (
    <DashShell title="Book a court">
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {week.map((d) => (
            <button key={d.key} aria-pressed={day.key === d.key} onClick={() => { setDay(d); setSlot(null) }}
              className={`${pill(day.key === d.key)} shrink-0 text-center leading-tight`}>
              {d.label}<span className="block text-xs font-normal opacity-75">{d.sub}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {courts.map((c) => (
            <button key={c.id} aria-pressed={court === c.id} onClick={() => { setCourt(c.id); setSlot(null) }} className={pill(court === c.id)}>{c.name}</button>
          ))}
        </div>
      </div>
      <p className="text-sm text-deep/70">One-hour slots. Greyed-out slots are already booked.</p>
      <SlotGrid court={court} day={day} selected={slot} onPick={setSlot} />
      {slot !== null && (
        <div className="flex items-center justify-between rounded-md bg-court p-4 text-mist" style={{ animation: 'fade-up .25s ease-out both' }}>
          <p className="font-semibold">Court {court}, {day.label} at {fmt(slot)}</p>
          <button onClick={confirm} className="rounded-full bg-ball px-5 py-2 font-bold text-deep">Confirm booking</button>
        </div>
      )}
      <section>
        <h2 className="text-xl font-extrabold">Your bookings</h2>
        {mine.length === 0 ? (
          <p className="mt-2 text-deep/70">No bookings yet. Pick a day, a court and a slot above to book your first game.</p>
        ) : (
          <ul className="mt-2 divide-y divide-deep/15">
            {mine.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <span>Court {m.court}, {label(m.date)} at {fmt(m.h)}</span>
                <button onClick={() => cancel(m.id)} className="text-sm font-bold underline">Cancel booking</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {toast && <p role="status" className="fixed bottom-5 left-1/2 animate-pop rounded-full bg-deep px-5 py-3 text-sm font-semibold text-mist shadow-lg">{toast}</p>}
    </DashShell>
  )
}
