import { useState } from 'react'
import DashShell from '../components/DashShell'
import SlotGrid from '../components/SlotGrid'
import { courts, fmt } from '../data/mock'

export default function Customer() {
  const [court, setCourt] = useState(1)
  const [slot, setSlot] = useState(null)
  const [mine, setMine] = useState([])

  const confirm = () => { setMine([...mine, { court, h: slot }]); setSlot(null) }
  const cancel = (i) => setMine(mine.filter((_, x) => x !== i))

  return (
    <DashShell title="Book a court">
      <div className="flex flex-wrap gap-2">
        {courts.map((c) => (
          <button key={c.id} aria-pressed={court === c.id} onClick={() => { setCourt(c.id); setSlot(null) }}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${court === c.id ? 'bg-deep text-mist' : 'bg-deep/10'}`}>{c.name}</button>
        ))}
      </div>
      <p className="text-sm text-deep/70">Today. Greyed-out slots are already booked.</p>
      <SlotGrid court={court} selected={slot} onPick={setSlot} mine={mine} />
      {slot !== null && (
        <div className="flex items-center justify-between rounded-md bg-court p-4 text-mist">
          <p className="font-semibold">Court {court}, today at {fmt(slot)}</p>
          <button onClick={confirm} className="rounded-full bg-ball px-5 py-2 font-bold text-deep">Confirm booking</button>
        </div>
      )}
      <section>
        <h2 className="text-xl font-extrabold">Your bookings</h2>
        {mine.length === 0 ? (
          <p className="mt-2 text-deep/70">No bookings yet. Pick a slot above to book your first game.</p>
        ) : (
          <ul className="mt-2 divide-y divide-deep/15">
            {mine.map((m, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <span>Court {m.court}, today at {fmt(m.h)}</span>
                <button onClick={() => cancel(i)} className="text-sm font-bold underline">Cancel booking</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashShell>
  )
}
