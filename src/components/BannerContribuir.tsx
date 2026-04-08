'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PAISES } from '@/lib/supabase'

const PAIS_POR_CODIGO: Record<string, string> = {
  CO: 'Colombia',
  MX: 'México',
  AR: 'Argentina',
  VE: 'Venezuela',
  PE: 'Perú',
  CL: 'Chile',
  EC: 'Ecuador',
  CR: 'Costa Rica',
  CU: 'Cuba',
  DO: 'Rep. Dominicana',
}

const PAIS_POR_TIMEZONE: Record<string, string> = {
  'America/Bogota': 'Colombia',
  'America/Mexico_City': 'México',
  'America/Monterrey': 'México',
  'America/Cancun': 'México',
  'America/Buenos_Aires': 'Argentina',
  'America/Argentina/Buenos_Aires': 'Argentina',
  'America/Caracas': 'Venezuela',
  'America/Lima': 'Perú',
  'America/Santiago': 'Chile',
  'America/Guayaquil': 'Ecuador',
  'America/Costa_Rica': 'Costa Rica',
  'America/Havana': 'Cuba',
  'America/Santo_Domingo': 'Rep. Dominicana',
}

export default function BannerContribuir() {
  const [paisDetectado, setPaisDetectado] = useState<string | null>(null)
  const [bandera, setBandera] = useState('')

  useEffect(() => {
    async function detectarPais() {
      // Intentar por IP primero (respeta VPN)
      try {
        const res = await fetch('https://ipapi.co/country_code/')
        if (res.ok) {
          const code = (await res.text()).trim()
          const pais = PAIS_POR_CODIGO[code]
          if (pais) {
            setPaisDetectado(pais)
            setBandera(PAISES.find(p => p.nombre === pais)?.bandera ?? '')
            return
          }
        }
      } catch {
        // IP detection failed, fall back to timezone
      }

      // Fallback: timezone del sistema
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const pais = PAIS_POR_TIMEZONE[tz]
        if (pais) {
          setPaisDetectado(pais)
          setBandera(PAISES.find(p => p.nombre === pais)?.bandera ?? '')
        }
      } catch {
        // timezone detection not available
      }
    }

    detectarPais()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-primary-900/40 to-primary-800/20 border border-primary-700/30 rounded-2xl p-6 md:p-8 text-center">
        {paisDetectado ? (
          <>
            <p className="text-3xl mb-3">{bandera}</p>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              &iexcl;Hola desde {paisDetectado}!
            </h2>
            <p className="text-dark-300 mb-4 max-w-lg mx-auto">
              &iquest;Conoces jergas de {paisDetectado} que no est&eacute;n aqu&iacute;?
              Ay&uacute;danos a hacer el diccionario m&aacute;s completo de Latinoam&eacute;rica.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/agregar"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                + Agregar jerga de {paisDetectado}
              </Link>
              <Link
                href={`/pais/${encodeURIComponent(paisDetectado)}`}
                className="bg-dark-700 hover:bg-dark-600 text-dark-200 px-6 py-3 rounded-xl font-medium transition-colors border border-dark-600"
              >
                Ver jergas de {paisDetectado}
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-3xl mb-3">&#x1F30E;</p>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              &iquest;Falta la jerga de tu pa&iacute;s?
            </h2>
            <p className="text-dark-300 mb-4 max-w-lg mx-auto">
              Este diccionario lo construimos entre todos.
              Agrega las jergas que conoces y ayuda a preservar el espa&ntilde;ol de Latinoam&eacute;rica.
            </p>
            <Link
              href="/agregar"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              + Agregar una jerga
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
