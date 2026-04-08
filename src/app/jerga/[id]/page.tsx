import { createServerClient } from '@/lib/supabase-server'
import { getBandera, type Jerga } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BotonVoto from '@/components/BotonVoto'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('jergas')
    .select('jerga, significado, pais')
    .eq('id', params.id)
    .single()

  if (!data) return { title: 'Jerga no encontrada' }

  return {
    title: `${data.jerga} - Significado en ${data.pais}`,
    description: data.significado,
  }
}

export default async function JergaPage({ params }: Props) {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('jergas')
    .select('*')
    .eq('id', params.id)
    .eq('aprobado', true)
    .single()

  if (!data) notFound()

  const jerga = data as Jerga
  const bandera = getBandera(jerga.pais)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="text-dark-400 hover:text-white text-sm mb-8 inline-flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </Link>

      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 mt-4">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-4xl font-bold text-white">{jerga.jerga}</h1>
          <span className="text-4xl">{bandera}</span>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-primary-400 uppercase tracking-wide mb-2">Significado</h2>
            <p className="text-dark-200 text-lg">{jerga.significado}</p>
          </div>

          {jerga.ejemplo && (
            <div>
              <h2 className="text-sm font-medium text-primary-400 uppercase tracking-wide mb-2">Ejemplo</h2>
              <p className="text-dark-300 text-lg italic">&ldquo;{jerga.ejemplo}&rdquo;</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/pais/${encodeURIComponent(jerga.pais)}`}
              className="text-sm bg-dark-700 text-dark-300 px-4 py-2 rounded-full hover:bg-dark-600 transition-colors"
            >
              {bandera} {jerga.pais}
            </Link>
            {jerga.categoria && (
              <span className="text-sm bg-dark-700 text-dark-300 px-4 py-2 rounded-full">
                {jerga.categoria}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-dark-700">
            <BotonVoto jergaId={jerga.id} tipo="up" count={jerga.votos_positivos} />
            <BotonVoto jergaId={jerga.id} tipo="down" count={jerga.votos_negativos} />
          </div>
        </div>
      </div>
    </div>
  )
}
