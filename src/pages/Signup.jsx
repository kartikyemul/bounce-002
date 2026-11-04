import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function Signup() {
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Enter your full name.'
    if (!emailOk(f.email.trim())) er.email = 'Enter a valid email address.'
    if (f.password.length < 8) er.password = 'Use at least 8 characters.'
    if (f.confirm !== f.password) er.confirm = 'Passwords do not match.'
    setErrors(er)
    setServerError('')
    if (Object.keys(er).length) return
    setBusy(true)
    try {
      await api.signup(f.name.trim(), f.email.trim(), f.password)
      setDone(true)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-md px-5 pt-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Check your email</h1>
        <p className="mt-4 text-deep/75">We sent a verification link to {f.email}. Open it to activate your account, then log in.</p>
        <p className="mt-3 text-sm text-deep/60">Development mode: the link is printed in the backend log instead of being emailed.</p>
        <Link to="/login" className="mt-8 inline-block rounded-full bg-ball px-6 py-3 font-bold">Go to log in</Link>
      </main>
    )
  }

  const field = (k, label, type = 'text') => (
    <label className="block text-sm font-semibold">{label}
      <input type={type} value={f[k]} onChange={set(k)} className="mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2" />
      {errors[k] && <span className="text-sm text-red-700">{errors[k]}</span>}
    </label>
  )

  return (
    <main className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Create your account</h1>
      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        {field('name', 'Full name')}
        {field('email', 'Email', 'email')}
        {field('password', 'Password', 'password')}
        {field('confirm', 'Confirm password', 'password')}
        {serverError && <p role="alert" className="text-sm font-semibold text-red-700">{serverError}</p>}
        <button disabled={busy} className="w-full rounded-full bg-ball py-3 font-bold disabled:opacity-60">{busy ? 'Creating...' : 'Create account'}</button>
      </form>
      <p className="mt-6 text-sm">Already have an account? <Link to="/login" className="font-bold underline">Log in</Link></p>
    </main>
  )
}
