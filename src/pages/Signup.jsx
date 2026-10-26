import { useState } from 'react'
import { Link } from 'react-router-dom'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function Signup() {
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Enter your full name.'
    if (!emailOk(f.email)) er.email = 'Enter a valid email address.'
    if (f.password.length < 8) er.password = 'Use at least 8 characters.'
    if (f.confirm !== f.password) er.confirm = 'Passwords do not match.'
    setErrors(er)
    setDone(Object.keys(er).length === 0)
  }

  const field = (k, label, type = 'text') => (
    <label className="block text-sm font-semibold">{label}
      <input type={type} value={f[k]} onChange={set(k)}
        className="mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2" />
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
        <button className="w-full rounded-full bg-ball py-3 font-bold">Create account</button>
        {done && <p className="text-sm">Details look good. We will email a verification link once the backend is connected.</p>}
      </form>
      <p className="mt-6 text-sm">Already have an account? <Link to="/login" className="font-bold underline">Log in</Link></p>
    </main>
  )
}
