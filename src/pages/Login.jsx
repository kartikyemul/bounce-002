import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Auth'

const roles = ['Customer', 'Court in-charge', 'Admin']
const paths = { Customer: '/app', 'Court in-charge': '/incharge', Admin: '/admin' }
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [role, setRole] = useState(roles[0])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!emailOk(email)) er.email = 'Enter a valid email address.'
    if (!password) er.password = 'Enter your password.'
    setErrors(er)
    if (Object.keys(er).length === 0) { login(role); nav(paths[role]) }
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Log in</h1>
      <div role="tablist" className="mt-6 flex flex-wrap gap-2">
        {roles.map((r) => (
          <button key={r} role="tab" aria-selected={role === r} onClick={() => setRole(r)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${role === r ? 'bg-deep text-mist' : 'bg-deep/10'}`}>{r}</button>
        ))}
      </div>
      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2" />
          {errors.email && <span className="text-sm text-red-700">{errors.email}</span>}
        </label>
        <label className="block text-sm font-semibold">Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border border-deep/30 bg-white px-3 py-2" />
          {errors.password && <span className="text-sm text-red-700">{errors.password}</span>}
        </label>
        <button className="w-full rounded-full bg-ball py-3 font-bold">Log in as {role.toLowerCase()}</button>
        <p className="text-sm text-deep/70">Demo mode: any valid email and password signs you in.</p>
      </form>
      <p className="mt-6 text-sm">New here? <Link to="/signup" className="font-bold underline">Create an account</Link></p>
    </main>
  )
}
