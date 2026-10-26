import { Link } from 'react-router-dom'
import CourtSVG from '../components/CourtSVG'

const facilities = [
  ['Online booking', 'Pick a court and a time slot, pay, and get a confirmation.'],
  ['Paddle and ball rental', 'Turn up with nothing and still play.'],
  ['Coaching', 'Group clinics and one-to-one sessions for every level.'],
  ['Open play', 'Join a game at your skill level without bringing a partner.'],
  ['Changing rooms and water', 'Clean rooms and free drinking water on site.'],
]

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-8 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            Four courts.<br />Your time slot.<br />Game on.
          </h1>
          <p className="mt-6 max-w-md text-lg text-deep/75">
            Reserve a pickleball court in under a minute. See what is free, book it, and walk in.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/signup" className="rounded-full bg-ball px-6 py-3 font-bold">Book a court</Link>
            <a href="#courts" className="rounded-full border-2 border-deep px-6 py-3 font-bold">See the courts</a>
          </div>
        </div>
        <CourtSVG className="w-full rounded-lg shadow-xl" />
      </section>

      <section id="courts" className="mt-24 bg-court py-14 text-mist">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-extrabold tracking-tight">Pick your court</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <CourtSVG className="w-full rounded-md ring-2 ring-mist/40" />
                <p className="mt-3 font-bold">Court {n}</p>
                <p className="text-sm text-mist/75">Details coming soon</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="facilities" className="mx-auto mt-20 max-w-3xl px-5">
        <h2 className="text-3xl font-extrabold tracking-tight">What you get</h2>
        <dl className="mt-6 divide-y divide-deep/15">
          {facilities.map(([t, d]) => (
            <div key={t} className="grid gap-1 py-4 sm:grid-cols-3">
              <dt className="font-bold">{t}</dt>
              <dd className="text-deep/75 sm:col-span-2">{d}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
