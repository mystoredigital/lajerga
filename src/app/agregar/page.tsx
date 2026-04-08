'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, PAISES } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AgregarPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    jerga: '',
    significado: '',
    ejemplo: '',
    pais: '',
    categoria: 'coloquial',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setShowLogin(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Detect country for pre-selection (IP first, then timezone fallback)
  useEffect(() => {
    if (form.pais) return
    const codeToPais: Record<string, string> = {
      ES: 'España', MX: 'México', CO: 'Colombia', AR: 'Argentina',
      VE: 'Venezuela', PE: 'Perú', CL: 'Chile', EC: 'Ecuador',
      GT: 'Guatemala', HN: 'Honduras', SV: 'El Salvador', NI: 'Nicaragua',
      CR: 'Costa Rica', PA: 'Panamá', CU: 'Cuba', DO: 'Rep. Dominicana',
      PR: 'Puerto Rico', UY: 'Uruguay', PY: 'Paraguay', BO: 'Bolivia',
      GQ: 'Guinea Ecuatorial',
    }
    const tzMap: Record<string, string> = {
      'Europe/Madrid': 'España', 'Atlantic/Canary': 'España',
      'America/Mexico_City': 'México', 'America/Monterrey': 'México',
      'America/Cancun': 'México', 'America/Bogota': 'Colombia',
      'America/Buenos_Aires': 'Argentina', 'America/Argentina/Buenos_Aires': 'Argentina',
      'America/Caracas': 'Venezuela', 'America/Lima': 'Perú',
      'America/Santiago': 'Chile', 'America/Guayaquil': 'Ecuador',
      'America/Guatemala': 'Guatemala', 'America/Tegucigalpa': 'Honduras',
      'America/El_Salvador': 'El Salvador', 'America/Managua': 'Nicaragua',
      'America/Costa_Rica': 'Costa Rica', 'America/Panama': 'Panamá',
      'America/Havana': 'Cuba', 'America/Santo_Domingo': 'Rep. Dominicana',
      'America/Puerto_Rico': 'Puerto Rico', 'America/Montevideo': 'Uruguay',
      'America/Asuncion': 'Paraguay', 'America/La_Paz': 'Bolivia',
      'Africa/Malabo': 'Guinea Ecuatorial',
    }
    async function detectar() {
      try {
        const res = await fetch('https://ipapi.co/country_code/')
        if (res.ok) {
          const pais = codeToPais[(await res.text()).trim()]
          if (pais) { setForm(f => ({ ...f, pais })); return }
        }
      } catch { /* fall through */ }
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const pais = tzMap[tz]
        if (pais) setForm(f => ({ ...f, pais }))
      } catch { /* ignore */ }
    }
    detectar()
  }, [form.pais])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoginLoading(true)
    await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/agregar` },
    })
    setLoginLoading(false)
    setSent(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setShowLogin(true)
      return
    }

    setLoading(true)
    const { error } = await supabase.from('jergas').insert({
      ...form,
      creado_por: user.id,
      aprobado: true,
    })
    setLoading(false)

    if (!error) {
      setSuccess(true)
      setTimeout(() => router.push('/'), 2000)
    }
  }

  if (checking) return null

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">&#x1F389;</p>
        <h1 className="text-2xl font-bold text-white mb-2">&iexcl;Jerga agregada!</h1>
        <p className="text-dark-400">Gracias por contribuir. Redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Agregar nueva jerga</h1>
      <p className="text-dark-400 mb-8">
        Comparte las jergas de tu pa&iacute;s con toda Latinoam&eacute;rica
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Jerga *</label>
          <input
            type="text"
            required
            value={form.jerga}
            onChange={(e) => setForm({ ...form, jerga: e.target.value })}
            placeholder="ej: Parce, Chido, Boludo"
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Significado *</label>
          <textarea
            required
            value={form.significado}
            onChange={(e) => setForm({ ...form, significado: e.target.value })}
            placeholder="Describe qu&eacute; significa esta jerga"
            rows={3}
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Ejemplo de uso *</label>
          <input
            type="text"
            required
            value={form.ejemplo}
            onChange={(e) => setForm({ ...form, ejemplo: e.target.value })}
            placeholder="Escribe una frase usando la jerga"
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Pa&iacute;s *</label>
            <select
              required
              value={form.pais}
              onChange={(e) => setForm({ ...form, pais: e.target.value })}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">Seleccionar</option>
              {PAISES.map((p) => (
                <option key={p.codigo} value={p.nombre}>
                  {p.bandera} {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Categor&iacute;a</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="coloquial">Coloquial</option>
              <option value="vulgar">Vulgar</option>
              <option value="expresi&oacute;n">Expresi&oacute;n</option>
            </select>
          </div>
        </div>

        {!user && (
          <p className="text-dark-400 text-sm bg-dark-800 border border-dark-700 rounded-xl p-3 text-center">
            &#x1F512; Necesitas iniciar sesi&oacute;n para enviar. Al presionar el bot&oacute;n te pediremos tu email.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
        >
          {loading ? 'Guardando...' : user ? 'Agregar jerga' : 'Continuar e iniciar sesi\u00f3n'}
        </button>
      </form>

      {/* Modal login inline */}
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

            <h2 className="text-xl font-bold text-white mb-1">Inicia sesi&oacute;n para contribuir</h2>
            <p className="text-dark-400 text-sm mb-5">
              Te enviaremos un enlace a tu email para confirmar
            </p>

            {sent ? (
              <div className="text-center py-4">
                <p className="text-2xl mb-3">&#x2709;&#xFE0F;</p>
                <p className="text-white font-medium">&iexcl;Revisa tu email!</p>
                <p className="text-dark-400 text-sm mt-1">
                  Haz clic en el enlace que enviamos a <strong className="text-dark-200">{email}</strong>
                </p>
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
                  disabled={loginLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {loginLoading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
