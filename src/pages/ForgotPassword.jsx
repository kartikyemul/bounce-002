import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!emailOk(email.trim())) return setError('Enter a valid email address.')
    setError('')
    setBusy(true)
    try {
      await api.forgotPassword(email.trim())
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <main className="mx-auto max-w-md px-5 pt-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Check your email</h1>
        <p className="mt-4 text-deep/75">If an account exists for {email.trim()}, we sent a link to reset the password. It works for one hour.</p>
        <p className="mt-3 text-sm text-deep/60">Development mode: the link is printed in the backend log instead of being emailed.</p>
        <Link to="/login" className="mt-8 inline-block rounded-full bg-ball px-6 py-3 font-bold">Back to log in</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Forgot your password?</h1>
      <p className="mt-2 text-sm text-deep/70">Enter your email and we will send you a reset link.</p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2" />
        </label>
        {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-ball py-3 font-bold disabled:opacity-60">{busy ? 'Sending...' : 'Send reset link'}</button>
      </form>
      <p className="mt-6 text-sm"><Link to="/login" className="font-bold underline">Back to log in</Link></p>
    </main>
  )
}
