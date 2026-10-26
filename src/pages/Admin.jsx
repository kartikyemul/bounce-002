import { useState } from 'react'
import DashShell from '../components/DashShell'
import { courts, hours, taken } from '../data/mock'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function Admin() {
  const [emails, setEmails] = useState({})
  const [invited, setInvited] = useState({})
  const [err, setErr] = useState({})
  const total = courts.reduce((n, c) => n + hours.filter((h) => taken(c.id, h)).length, 0)

  const invite = (id) => {
    if (!emailOk(emails[id] || '')) return setErr({ ...err, [id]: 'Enter a valid email address.' })
    setErr({ ...err, [id]: '' }); setInvited({ ...invited, [id]: emails[id] })
  }

  return (
    <DashShell title="Admin overview">
      <p className="text-lg">{total} bookings today across {courts.length} courts. {Object.keys(invited).length} of {courts.length} courts have an in-charge.</p>
      <section>
        <h2 className="text-xl font-extrabold">Courts and in-charges</h2>
        <ul className="mt-2 divide-y divide-deep/15">
          {courts.map((c) => (
            <li key={c.id} className="grid items-start gap-2 py-4 sm:grid-cols-3">
              <div>
                <p className="font-bold">{c.name}</p>
                <p className="text-sm text-deep/70">{hours.filter((h) => taken(c.id, h)).length} bookings today</p>
              </div>
              <div className="sm:col-span-2">
                {invited[c.id] ? (
                  <p>Invite sent to {invited[c.id]} (demo)</p>
                ) : (
                  <div className="flex gap-2">
                    <input aria-label={`In-charge email for ${c.name}`} placeholder="In-charge email" value={emails[c.id] || ''}
                      onChange={(e) => setEmails({ ...emails, [c.id]: e.target.value })}
                      className="w-full rounded-md border border-deep/30 bg-white px-3 py-2" />
                    <button onClick={() => invite(c.id)} className="shrink-0 rounded-full bg-deep px-4 py-2 text-sm font-bold text-mist">Send invite</button>
                  </div>
                )}
                {err[c.id] && <p className="mt-1 text-sm text-red-700">{err[c.id]}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </DashShell>
  )
}
