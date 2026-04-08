import { createServerClient } from '@/lib/supabase-server'
import FiltroPaises from '@/components/FiltroPaises'
import JergaCard from '@/components/JergaCard'
import { PAISES, type Jerga } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = {
  params: { pais: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pais = decodeURIComponent(params.pais)
  return {
    title: `Jergas de ${pais}`,
    description: `Descubre las jergas y modismos más populares de ${pais}.`,
  }
}

export default async function PaisPage({ params }: Props) {
  const pais = decodeURIComponent(params.pais)

  const paisValido = PAISES.find(p => p.nombre === pais)
  if (!paisValido) notFound()

  const supabase = createServerClient()
  const { data: jergas } = await supabase
    .from('jergas')
    .select('*')
    .eq('aprobado', true)
    .eq('pais', pais)
    .order('votos_positivos', { ascending: false })

  return (
    <div>
      <section className="bg-gradient-to-b from-primary-950/50 to-dark-900 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-4xl mr-3">{paisValido.bandera}</span>
            <span className="text-white">Jergas de {pais}</span>
          </h1>
          <p className="text-dark-300 mb-8">
            {jergas?.length ?? 0} jergas encontradas
          </p>
          <FiltroPaises paisActivo={pais} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {jergas && jergas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(jergas as Jerga[]).map((jerga) => (
              <JergaCard key={jerga.id} jerga={jerga} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-dark-400 text-lg">No hay jergas de {pais} a&uacute;n.</p>
          </div>
        )}
      </section>
    </div>
  )
}
