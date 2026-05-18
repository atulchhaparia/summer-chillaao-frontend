'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [mode,    setMode]    = useState('login')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, pass)
        if (error) throw error
        router.push('/')
      } else {
        const { error } = await signUp(email, pass, name)
        if (error) throw error
        setSuccess('Account created! Check your email to confirm, then sign in.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-5xl block mb-2">☀️</span>
            <h1 className="text-2xl font-extrabold text-stone-900">Summer Chillaao</h1>
            <p className="text-stone-500 text-sm mt-1">
              {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to order.'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
            {['login','signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                  ${mode === m ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm mb-4">{success}</div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <input className="input" type="text" placeholder="Atul Chhaparia" value={name}
                  onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={pass}
                onChange={e => setPass(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-6">
            By continuing, you agree to our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
