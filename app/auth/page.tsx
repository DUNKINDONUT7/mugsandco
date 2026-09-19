'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) window.location.href = '/dashboard'
      })
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    if (!supabase) {
      setMessage('Supabase is not configured. Add the values in .env.local.')
      setLoading(false)
      return
    }

    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } })

    if (result.error) {
      setMessage(result.error.message)
    } else if (mode === 'signup' && !result.data.session) {
      setMessage('Account created. Check your email to confirm it, then log in.')
    } else {
      window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <main className="auth-shell">
      <div className="auth-brand-panel">
        <a className="brand brand-on-dark" href="/"><span className="brand-mark">M</span><span>Mugs <i>&</i> Co.</span></a>
        <div className="auth-quote"><Sparkles size={19} /><p>Made for coffee moments,<br /><em>gifts, and cozy homes.</em></p></div>
        <span className="auth-footer-note">A little joy in every sip.</span>
      </div>
      <section className="auth-card" aria-labelledby="auth-title">
        <a className="back-link" href="/"><ArrowLeft size={15} /> Back to store</a>
        <p className="eyebrow">Mugs & Co. studio</p>
        <h1 id="auth-title">{mode === 'login' ? <>Welcome<br /><em>back.</em></> : <>Join the<br /><em>club.</em></>}</h1>
        <p className="auth-intro">{mode === 'login' ? 'Sign in to follow your submissions and manage your collection.' : 'Create an account to submit your own mug designs to the community.'}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && <label><span>Name</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required placeholder="Your name" autoComplete="name" /></label>}
          <label><span>Email address</span><div className="input-with-icon"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" autoComplete="email" /></div></label>
          <label><span>Password</span><div className="input-with-icon"><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} placeholder="At least 6 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></div></label>
          {message && <p className="form-message" role="alert">{message}</p>}
          <button className="button button-purple auth-submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={17} /></button>
        </form>
        <p className="auth-switch">{mode === 'login' ? 'New to Mugs & Co.?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
      </section>
    </main>
  )
}
