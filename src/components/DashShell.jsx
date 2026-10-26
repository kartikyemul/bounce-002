import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Auth'

export default function DashShell({ title, children }) {
  const { role, logout } = useAuth()
  const nav = useNavigate()
  return (
    <main className="mx-auto max-w-4xl px-5 pt-6">
      <div className="flex items-center justify-between border-b border-deep/15 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm text-deep/70">Signed in as {role.toLowerCase()} (demo)</p>
        </div>
        <button onClick={() => { logout(); nav('/') }} className="rounded-full border-2 border-deep px-4 py-2 text-sm font-bold">Log out</button>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </main>
  )
}
