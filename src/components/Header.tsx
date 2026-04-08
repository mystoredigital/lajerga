'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setShowLogin(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}`,
      },
    })
    setLoading(false)
    setSent(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              LaJerga
            </span>
            <span className="text-xs text-dark-400 hidden sm:inline">diccionario latino</span>
          </Link>

          <nav className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/agregar"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Agregar jerga
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-dark-400 hover:text-white text-sm transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Iniciar sesi&oacute;n
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Modal de login */}
      {showLogin && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-sm relative">
            <button
              onClick={() => { setShowLogin(false); setSent(false); setEmail('') }}
              className="absolute top-3 right-3 text-dark-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Inicia sesi&oacute;n</h2>
            <p className="text-dark-400 text-sm mb-5">
              Te enviaremos un enlace m&aacute;gico a tu email
            </p>

            {sent ? (
              <div className="text-center py-4">
                <p className="text-2xl mb-3">&#x2709;&#xFE0F;</p>
                <p className="text-white font-medium">&iexcl;Revisa tu email!</p>
                <p className="text-dark-400 text-sm mt-1">
                  Enviamos un enlace a <strong className="text-dark-200">{email}</strong>
                </p>
                <button
                  onClick={() => { setSent(false); setEmail('') }}
                  className="text-primary-400 text-sm mt-4 hover:underline"
                >
                  Usar otro email
                </button>
              </div>
            ) : (
              <form onSubmit={handleMagicLink}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 mb-3"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {loading ? 'Enviando...' : 'Enviar enlace m\u00e1gico'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
