const steps = [
  ['Choose a court', 'Four courts, each with its own live schedule.'],
  ['Pick a time', 'Free slots are clear, taken ones are greyed out.'],
  ['Show up and play', 'Check in at the court and start your game.'],
]

export default function HowItWorks() {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-5">
      <h2 className="text-3xl font-extrabold tracking-tight">Booking in three steps</h2>
      <ol className="mt-6 grid gap-6 md:grid-cols-3">
        {steps.map(([t, d], i) => (
          <li key={t} className="border-t-4 border-deep pt-4">
            <span className="text-sm font-bold text-court">Step {i + 1}</span>
            <p className="mt-1 text-xl font-extrabold">{t}</p>
            <p className="mt-1 text-deep/75">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
