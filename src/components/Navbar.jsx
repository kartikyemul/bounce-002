import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Auth'

const home = { Customer: '/app', 'Court in-charge': '/incharge', Admin: '/admin' }

export default function Navbar() {
  const { role, logout } = useAuth()
  const nav = useNavigate()
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ball text-[11px] font-extrabold">002</span>
        Bounce 002
      </Link>
      <nav className="flex items-center gap-5 text-sm font-semibold">
        <a href="/#courts" className="hidden sm:block">Courts</a>
        <a href="/#facilities" className="hidden sm:block">Facilities</a>
        {role ? (
          <>
            <Link to={home[role]} className="rounded-full bg-deep px-4 py-2 text-mist">My dashboard</Link>
            <button onClick={() => { logout(); nav('/') }}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="rounded-full bg-deep px-4 py-2 text-mist">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  )
}
