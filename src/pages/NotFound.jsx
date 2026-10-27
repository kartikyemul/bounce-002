import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-5 pt-20 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight">Out of bounds</h1>
      <p className="mt-4 text-deep/75">That page does not exist.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-ball px-6 py-3 font-bold">Back to the home page</Link>
    </main>
  )
}
