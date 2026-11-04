import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as api from '../api'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const [state, setState] = useState('loading') // 'loading', 'ok', or an error message
  const started = useRef(false) // the link works once, so only call it once

  useEffect(() => {
    if (started.current) return
    started.current = true
    api.verify(params.get('token') || '').then(() => setState('ok')).catch((e) => setState(e.message))
  }, [params])

  return (
    <main className="mx-auto max-w-md px-5 pt-10">
      {state === 'loading' && <h1 className="text-3xl font-extrabold">Verifying your email...</h1>}
      {state === 'ok' && (
        <>
          <h1 className="text-4xl font-extrabold tracking-tight">Email verified</h1>
          <Link to="/login" className="mt-8 inline-block rounded-full bg-ball px-6 py-3 font-bold">Log in</Link>
        </>
      )}
      {state !== 'loading' && state !== 'ok' && (
        <>
          <h1 className="text-4xl font-extrabold tracking-tight">That did not work</h1>
          <p className="mt-4 text-deep/75">{state}</p>
          <Link to="/signup" className="mt-8 inline-block rounded-full border-2 border-deep px-6 py-3 font-bold">Sign up again</Link>
        </>
      )}
    </main>
  )
}
