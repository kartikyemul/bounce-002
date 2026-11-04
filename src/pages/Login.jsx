import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Auth'

const home = { CUSTOMER: '/app', INCHARGE: '/incharge', ADMIN: '/admin' }
const input = 'mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const u = await login(email.trim(), password)
      nav(home[u.role])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Log in</h1>
      <p className="mt-2 text-sm text-deep/70">Court in-charges: use the invite link in your email to set a password first.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </label>
        <label className="block text-sm font-semibold">Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        </label>
        {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-ball py-3 font-bold disabled:opacity-60">{busy ? 'Logging in...' : 'Log in'}</button>
      </form>
      <p className="mt-6 text-sm">New here? <Link to="/signup" className="font-bold underline">Create an account</Link></p>
    </main>
  )
}
