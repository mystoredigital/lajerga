import { PAISES } from '@/lib/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jergaUrls: MetadataRoute.Sitemap = []

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createServerClient } = await import('@/lib/supabase-server')
      const supabase = createServerClient()
      const { data: jergas } = await supabase
        .from('jergas')
        .select('id, creado_en')
        .eq('aprobado', true)

      for (const j of jergas ?? []) {
        jergaUrls.push({
          url: `https://lajerga.app/jerga/${j.id}`,
          lastModified: new Date(j.creado_en),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    } catch {
      // Supabase not available at build time
    }
  }

  const paisUrls = PAISES.map((p) => ({
    url: `https://lajerga.app/pais/${encodeURIComponent(p.nombre)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://lajerga.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...paisUrls,
    ...jergaUrls,
  ]
}
