import DashShell from '../components/DashShell'
import { useBookings } from '../context/Bookings'
import { hours, fmt, taken, days } from '../data/mock'

const COURT = 2 // later this comes from the logged-in in-charge's account
const today = days()[0]

export default function Incharge() {
  const { list, checkIn } = useBookings()
  const online = list.filter((b) => b.court === COURT && b.date === today.key)
  const find = (h) => online.find((b) => b.h === h)
  const total = hours.filter((h) => find(h) || taken(COURT, h, 0)).length
  const here = online.filter((b) => b.checkedIn).length

  return (
    <DashShell title={`Court ${COURT} today`}>
      <p className="text-lg">{total} bookings today, {online.length} made online, {here} checked in.</p>
      <ul className="divide-y divide-deep/15">
        {hours.map((h) => {
          const b = find(h)
          return (
            <li key={h} className="flex items-center justify-between py-3">
              <span className="w-20 font-bold">{fmt(h)}</span>
              {b ? (
                <button onClick={() => checkIn(b.id)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${b.checkedIn ? 'bg-ball' : 'border-2 border-deep'}`}>
                  {b.checkedIn ? 'Checked in' : 'Online booking, check in'}
                </button>
              ) : taken(COURT, h, 0) ? <span className="text-deep/70">Reserved</span> : <span className="text-deep/40">Free</span>}
            </li>
          )
        })}
      </ul>
    </DashShell>
  )
}
