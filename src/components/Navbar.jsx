import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ball text-[11px] font-extrabold">002</span>
        Bounce 002
      </Link>
      <nav className="flex items-center gap-5 text-sm font-semibold">
        <a href="/#courts" className="hidden sm:block">Courts</a>
        <a href="/#facilities" className="hidden sm:block">Facilities</a>
        <Link to="/login">Log in</Link>
        <Link to="/signup" className="rounded-full bg-deep px-4 py-2 text-mist">Sign up</Link>
      </nav>
    </header>
  )
}
