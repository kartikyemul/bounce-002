import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as api from '../api'

export default function AcceptInvite() {
  const [params] = useSearchParams()
  const [f, setF] = useState({ name: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const input = 'mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2'

  const submit = async (e) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setError('Enter your full name.')
    if (f.password.length < 8) return setError('Use at least 8 characters.')
    if (f.confirm !== f.password) return setError('Passwords do not match.')
    try {
      await api.acceptInvite(params.get('token') || '', f.name.trim(), f.password)
      setDone(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-md px-5 pt-10">
        <h1 className="text-4xl font-extrabold tracking-tight">You are all set</h1>
        <Link to="/login" className="mt-8 inline-block rounded-full bg-ball px-6 py-3 font-bold">Log in</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Set up your account</h1>
      <p className="mt-2 text-sm text-deep/70">You were invited to run a court. Choose your name and a password.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">Full name<input value={f.name} onChange={set('name')} className={input} /></label>
        <label className="block text-sm font-semibold">Password<input type="password" value={f.password} onChange={set('password')} className={input} /></label>
        <label className="block text-sm font-semibold">Confirm password<input type="password" value={f.confirm} onChange={set('confirm')} className={input} /></label>
        {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
        <button className="w-full rounded-full bg-ball py-3 font-bold">Create my account</button>
      </form>
    </main>
  )
}
