import { createServerClient } from '@/lib/supabase-server'
import Buscador from '@/components/Buscador'
import FiltroPaises from '@/components/FiltroPaises'
import JergaCard from '@/components/JergaCard'
import type { Jerga } from '@/lib/supabase'

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const supabase = createServerClient()

  let query = supabase
    .from('jergas')
    .select('*')
    .eq('aprobado', true)
    .order('votos_positivos', { ascending: false })
    .limit(30)

  if (searchParams.q) {
    query = query.or(`jerga.ilike.%${searchParams.q}%,significado.ilike.%${searchParams.q}%`)
  }

  const { data: jergas } = await query

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-950/50 to-dark-900 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
              LaJerga
            </span>
          </h1>
          <p className="text-dark-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            El diccionario colaborativo de jergas y modismos del espa&ntilde;ol latinoamericano
          </p>
          <Buscador />
          <div className="mt-8">
            <FiltroPaises />
          </div>
        </div>
      </section>

      {/* Jergas populares */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          {searchParams.q
            ? `Resultados para "${searchParams.q}"`
            : 'Jergas populares'}
        </h2>

        {jergas && jergas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(jergas as Jerga[]).map((jerga) => (
              <JergaCard key={jerga.id} jerga={jerga} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-dark-400 text-lg">
              {searchParams.q
                ? 'No se encontraron jergas con ese t\u00e9rmino.'
                : 'No hay jergas disponibles a\u00fan.'}
            </p>
            <p className="text-dark-500 text-sm mt-2">
              {searchParams.q
                ? 'Intenta con otro t\u00e9rmino de b\u00fasqueda.'
                : 'Configura Supabase y ejecuta el seed para empezar.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
