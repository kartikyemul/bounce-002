import { useState } from 'react'
import DashShell from '../components/DashShell'
import { hours, fmt, taken } from '../data/mock'

const COURT = 2 // later this comes from the logged-in in-charge's account

export default function Incharge() {
  const [arrived, setArrived] = useState([])
  const booked = hours.filter((h) => taken(COURT, h))
  const toggle = (h) => setArrived(arrived.includes(h) ? arrived.filter((x) => x !== h) : [...arrived, h])

  return (
    <DashShell title={`Court ${COURT} today`}>
      <p className="text-lg">{booked.length} bookings today, {arrived.length} checked in.</p>
      <ul className="divide-y divide-deep/15">
        {hours.map((h) => (
          <li key={h} className="flex items-center justify-between py-3">
            <span className="w-20 font-bold">{fmt(h)}</span>
            {taken(COURT, h) ? (
              <button onClick={() => toggle(h)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${arrived.includes(h) ? 'bg-ball' : 'border-2 border-deep'}`}>
                {arrived.includes(h) ? 'Checked in' : 'Check in player'}
              </button>
            ) : <span className="text-deep/50">Free</span>}
          </li>
        ))}
      </ul>
    </DashShell>
  )
}
