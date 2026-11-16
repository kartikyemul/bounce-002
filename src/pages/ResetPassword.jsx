import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as api from '../api'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const [f, setF] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const input = 'mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2'

  const submit = async (e) => {
    e.preventDefault()
    if (f.password.length < 8) return setError('Use at least 8 characters.')
    if (f.confirm !== f.password) return setError('Passwords do not match.')
    try {
      await api.resetPassword(params.get('token') || '', f.password)
      setDone(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-md px-5 pt-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Password changed</h1>
        <p className="mt-4 text-deep/75">You were signed out everywhere. Log in with your new password.</p>
        <Link to="/login" className="mt-8 inline-block rounded-full bg-ball px-6 py-3 font-bold">Log in</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Choose a new password</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">New password<input type="password" value={f.password} onChange={set('password')} className={input} /></label>
        <label className="block text-sm font-semibold">Confirm password<input type="password" value={f.confirm} onChange={set('confirm')} className={input} /></label>
        {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
        <button className="w-full rounded-full bg-ball py-3 font-bold">Change password</button>
      </form>
    </main>
  )
}
