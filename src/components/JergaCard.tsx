'use client'

import Link from 'next/link'
import { getBandera, type Jerga } from '@/lib/supabase'
import BotonVoto from './BotonVoto'

export default function JergaCard({ jerga }: { jerga: Jerga }) {
  const bandera = getBandera(jerga.pais)

  return (
    <Link href={`/jerga/${jerga.id}`} className="block group">
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-primary-500/50 hover:bg-dark-800/80 transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {jerga.jerga}
          </h3>
          <span className="text-2xl" title={jerga.pais}>{bandera}</span>
        </div>

        <p className="text-dark-300 text-sm mb-3 line-clamp-2">
          {jerga.significado}
        </p>

        {jerga.ejemplo && (
          <p className="text-dark-400 text-sm italic mb-4 line-clamp-1">
            &ldquo;{jerga.ejemplo}&rdquo;
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-dark-500 bg-dark-700 px-3 py-1 rounded-full">
            {jerga.pais}
          </span>
          <div className="flex items-center gap-3" onClick={(e) => e.preventDefault()}>
            <BotonVoto jergaId={jerga.id} tipo="up" count={jerga.votos_positivos} />
            <BotonVoto jergaId={jerga.id} tipo="down" count={jerga.votos_negativos} />
          </div>
        </div>
      </div>
    </Link>
  )
}
