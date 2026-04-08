'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, PAISES } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AgregarPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    jerga: '',
    significado: '',
    ejemplo: '',
    pais: '',
    categoria: 'coloquial',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/')
      } else {
        setUser(data.user)
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const { error } = await supabase.from('jergas').insert({
      ...form,
      creado_por: user.id,
      aprobado: true,
    })

    setLoading(false)

    if (!error) {
      router.push('/')
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Agregar nueva jerga</h1>

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
            placeholder="Describe qué significa esta jerga"
            rows={3}
            className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Ejemplo de uso</label>
          <input
            type="text"
            value={form.ejemplo}
            onChange={(e) => setForm({ ...form, ejemplo: e.target.value })}
            placeholder="ej: Ey parce, vamos a rumbear esta noche"
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
              <option value="expresión">Expresi&oacute;n</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
        >
          {loading ? 'Guardando...' : 'Agregar jerga'}
        </button>
      </form>
    </div>
  )
}
