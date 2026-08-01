import { createContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export { AuthContext }

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  // Hồ sơ đang chọn: { type: 'parent' } hoặc { type: 'child', child: {...} }
  const [profile, setProfile] = useState(() => {
    const saved = sessionStorage.getItem('profile')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    // Làm sạch fragment access_token khỏi URL nếu có
    if (window.location.hash.includes('access_token') || window.location.hash.includes('type=')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    supabase.auth.getSession()
      .then(({ data }) => {
        setSession(data?.session ?? null)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Auth getSession error:', err)
        setSession(null)
        setLoading(false)
      })

    let subscription = null
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s)
        if (!s) selectProfile(null)
      })
      subscription = data?.subscription
    } catch (err) {
      console.error('Auth onAuthStateChange error:', err)
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  function selectProfile(p) {
    setProfile(p)
    if (p) sessionStorage.setItem('profile', JSON.stringify(p))
    else sessionStorage.removeItem('profile')
  }

  const value = {
    session,
    loading,
    familyId: session?.user?.id ?? null,
    profile,
    selectProfile,
    signOut: () => supabase.auth.signOut(),
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
