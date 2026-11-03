import DashShell from '../components/DashShell'
import { useBookings } from '../context/Bookings'
import { hours, fmt, days } from '../data/mock'

const COURT = 2 // later this comes from the logged-in in-charge's account
const today = days()[0]

export default function Incharge() {
  const { list, checkIn } = useBookings()
  const mine = list.filter((b) => b.court === COURT && b.date === today.key)
  const here = mine.filter((b) => b.checkedIn).length

  return (
    <DashShell title={`Court ${COURT} today`}>
      <p className="text-lg">{mine.length} bookings today, {here} checked in.</p>
      <ul className="divide-y divide-deep/15">
        {hours.map((h) => {
          const b = mine.find((x) => x.h === h)
          return (
            <li key={h} className="flex items-center justify-between py-3">
              <span className="w-20 font-bold">{fmt(h)}</span>
              {b ? (
                <button onClick={() => checkIn(b.id)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${b.checkedIn ? 'bg-ball' : 'border-2 border-deep'}`}>
                  {b.checkedIn ? 'Checked in' : 'Booked, check in'}
                </button>
              ) : <span className="text-deep/40">Free</span>}
            </li>
          )
        })}
      </ul>
    </DashShell>
  )
}
