'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      setUser(s?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signUp   = (email, password, name) =>
    supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })

  const signIn   = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut  = () => supabase.auth.signOut()

  const token = session?.access_token ?? null

  return (
    <AuthContext.Provider value={{ user, session, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
