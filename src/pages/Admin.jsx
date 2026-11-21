import { useCallback, useEffect, useState } from 'react'
import DashShell from '../components/DashShell'
import { useBookings } from '../context/Bookings'
import { useCourts } from '../context/Courts'
import * as api from '../api'
import { hours, days, CURRENCY } from '../data/mock'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
const today = days()[0]
const blank = { name: '', surface: 'Acrylic hard court', setting: 'OUTDOOR', description: '', pricePerHour: 400, active: true }
const input = 'mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2'

function CourtForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial)
  const [error, setError] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const price = Number(f.pricePerHour)
    if (!f.name.trim()) return setError('Give the court a name.')
    if (!Number.isInteger(price) || price < 0) return setError('Price must be a whole number, 0 or more.')
    try {
      await onSave({ ...f, name: f.name.trim(), pricePerHour: price })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 grid gap-3 rounded-md bg-deep/5 p-4 sm:grid-cols-2">
      <label className="text-sm font-semibold">Name<input value={f.name} onChange={set('name')} className={input} /></label>
      <label className="text-sm font-semibold">Surface<input value={f.surface} onChange={set('surface')} className={input} /></label>
      <label className="text-sm font-semibold">Indoor or outdoor
        <select value={f.setting} onChange={set('setting')} className={input}>
          <option value="OUTDOOR">Outdoor</option>
          <option value="INDOOR">Indoor</option>
        </select>
      </label>
      <label className="text-sm font-semibold">Price per hour ({CURRENCY})<input value={f.pricePerHour} onChange={set('pricePerHour')} className={input} /></label>
      <label className="text-sm font-semibold sm:col-span-2">Description<textarea rows={2} value={f.description} onChange={set('description')} className={input} /></label>
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={f.active} onChange={set('active')} />Open for booking</label>
      <div className="flex items-center justify-end gap-3 sm:col-span-2">
        {error && <p role="alert" className="mr-auto text-sm font-semibold text-red-700">{error}</p>}
        <button type="button" onClick={onCancel} className="text-sm font-bold underline">Cancel</button>
        <button className="rounded-full bg-ball px-5 py-2 text-sm font-bold">Save court</button>
      </div>
    </form>
  )
}

export default function Admin() {
  const { list } = useBookings()
  const { reload } = useCourts()
  const [courts, setCourts] = useState([])
  const [staff, setStaff] = useState([])
  const [editing, setEditing] = useState(null) // a court id, 'new', or null
  const [emails, setEmails] = useState({})
  const [err, setErr] = useState({})
  const [notice, setNotice] = useState('')

  const load = useCallback(
    () => Promise.all([api.adminCourts().then(setCourts), api.inchargeList().then(setStaff)])
      .catch((e) => setErr((x) => ({ ...x, page: e.message }))),
    [])
  useEffect(() => { load() }, [load])

  const count = (id) => list.filter((b) => b.court === id && b.date === today.key).length
  const total = courts.reduce((n, c) => n + count(c.id), 0)
  const staffFor = (id) => staff.find((s) => s.courtId === id)

  const save = async (data) => {
    await api.saveCourt(editing === 'new' ? null : editing, data)
    setEditing(null)
    await load()
    await reload() // so the homepage and booking page show the change
  }

  const invite = async (id) => {
    const email = (emails[id] || '').trim()
    if (!emailOk(email)) return setErr({ ...err, [id]: 'Enter a valid email address.' })
    try {
      await api.invite(email, id)
      setErr({ ...err, [id]: '' })
      setNotice('Invite created. In development mode the invite link is printed in the backend log.')
      await load()
    } catch (e) {
      setErr({ ...err, [id]: e.message })
    }
  }

  return (
    <DashShell title="Admin overview">
      <p className="text-lg">{total} bookings today across {courts.filter((c) => c.active).length} open courts, {list.length} upcoming in total.</p>
      {err.page && <p role="alert" className="text-sm font-semibold text-red-700">{err.page}</p>}
      {notice && <p role="status" className="rounded-md bg-ball/60 p-3 text-sm font-semibold">{notice}</p>}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Courts</h2>
          <button onClick={() => setEditing('new')} className="rounded-full bg-deep px-4 py-2 text-sm font-bold text-mist">Add court</button>
        </div>
        {editing === 'new' && <CourtForm initial={blank} onSave={save} onCancel={() => setEditing(null)} />}
        <ul className="mt-2 divide-y divide-deep/15">
          {courts.map((c) => {
            const s = staffFor(c.id)
            return (
              <li key={c.id} className="py-4">
                <div className="grid items-start gap-2 sm:grid-cols-3">
                  <div>
                    <p className="font-bold">{c.name}{!c.active && <span className="ml-2 text-sm font-semibold text-red-700">closed</span>}</p>
                    <p className="text-sm text-deep/70">{c.setting === 'INDOOR' ? 'Indoor' : 'Outdoor'}, {c.surface}, {CURRENCY}{c.pricePerHour} per hour</p>
                    <p className="text-sm text-deep/70">{count(c.id)} of {hours.length} slots booked today</p>
                    <button onClick={() => setEditing(c.id)} className="mt-1 text-sm font-bold underline">Edit court</button>
                  </div>
                  <div className="sm:col-span-2">
                    {s ? <p>{s.email}, {s.active ? 'active' : 'invite pending'}</p> : (
                      <div className="flex gap-2">
                        <input aria-label={`In-charge email for ${c.name}`} placeholder="In-charge email" value={emails[c.id] || ''}
                          onChange={(e) => setEmails({ ...emails, [c.id]: e.target.value })}
                          className="w-full rounded-md border border-deep/30 bg-white px-3 py-2" />
                        <button onClick={() => invite(c.id)} className="shrink-0 rounded-full bg-deep px-4 py-2 text-sm font-bold text-mist">Send invite</button>
                      </div>
                    )}
                    {err[c.id] && <p className="mt-1 text-sm text-red-700">{err[c.id]}</p>}
                  </div>
                </div>
                {editing === c.id && (
                  <CourtForm onSave={save} onCancel={() => setEditing(null)}
                    initial={{ name: c.name, surface: c.surface, setting: c.setting, description: c.description, pricePerHour: c.pricePerHour, active: c.active }} />
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </DashShell>
  )
}
