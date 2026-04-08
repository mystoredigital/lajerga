'use client'

import Link from 'next/link'
import { PAISES } from '@/lib/supabase'

export default function FiltroPaises({ paisActivo }: { paisActivo?: string }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Link
        href="/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !paisActivo
            ? 'bg-primary-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-600'
        }`}
      >
        Todos
      </Link>
      {PAISES.map((pais) => (
        <Link
          key={pais.codigo}
          href={`/pais/${encodeURIComponent(pais.nombre)}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            paisActivo === pais.nombre
              ? 'bg-primary-600 text-white'
              : 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-600'
          }`}
        >
          {pais.bandera} {pais.nombre}
        </Link>
      ))}
    </div>
  )
}
