import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { jerga_id, voto } = await request.json()

    if (!jerga_id || typeof voto !== 'boolean') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
    const ip_hash = createHash('sha256').update(ip + jerga_id).digest('hex')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check if already voted
    const { data: existing } = await supabase
      .from('votos')
      .select('id')
      .eq('jerga_id', jerga_id)
      .eq('ip_hash', ip_hash)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Ya votaste por esta jerga' }, { status: 409 })
    }

    // Insert vote
    const { error: voteError } = await supabase
      .from('votos')
      .insert({ jerga_id, ip_hash, voto })

    if (voteError) {
      return NextResponse.json({ error: 'Error al votar' }, { status: 500 })
    }

    // Update count
    const { data: jerga } = await supabase
      .from('jergas')
      .select('votos_positivos, votos_negativos')
      .eq('id', jerga_id)
      .single()

    if (jerga) {
      const update = voto
        ? { votos_positivos: jerga.votos_positivos + 1 }
        : { votos_negativos: jerga.votos_negativos + 1 }
      await supabase
        .from('jergas')
        .update(update)
        .eq('id', jerga_id)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
