import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export type Jerga = {
  id: string
  jerga: string
  significado: string
  ejemplo: string
  pais: string
  region: string | null
  categoria: string | null
  votos_positivos: number
  votos_negativos: number
  creado_por: string | null
  creado_en: string
  aprobado: boolean
}

export type Perfil = {
  id: string
  email: string
  nombre: string
  pais: string | null
  jergas_agregadas: number
  creado_en: string
}

export const PAISES = [
  { nombre: 'Colombia', codigo: 'CO', bandera: '\u{1F1E8}\u{1F1F4}' },
  { nombre: 'M\u00e9xico', codigo: 'MX', bandera: '\u{1F1F2}\u{1F1FD}' },
  { nombre: 'Argentina', codigo: 'AR', bandera: '\u{1F1E6}\u{1F1F7}' },
  { nombre: 'Venezuela', codigo: 'VE', bandera: '\u{1F1FB}\u{1F1EA}' },
  { nombre: 'Per\u00fa', codigo: 'PE', bandera: '\u{1F1F5}\u{1F1EA}' },
  { nombre: 'Chile', codigo: 'CL', bandera: '\u{1F1E8}\u{1F1F1}' },
  { nombre: 'Ecuador', codigo: 'EC', bandera: '\u{1F1EA}\u{1F1E8}' },
  { nombre: 'Costa Rica', codigo: 'CR', bandera: '\u{1F1E8}\u{1F1F7}' },
  { nombre: 'Cuba', codigo: 'CU', bandera: '\u{1F1E8}\u{1F1FA}' },
  { nombre: 'Rep. Dominicana', codigo: 'DO', bandera: '\u{1F1E9}\u{1F1F4}' },
] as const

export function getBandera(pais: string): string {
  const found = PAISES.find(p => p.nombre === pais)
  return found?.bandera ?? '\u{1F30E}'
}
