'use client'

export default function AdSlot({ size = 'banner' }: { size?: 'banner' | 'rectangle' }) {
  const height = size === 'banner' ? 'h-[90px]' : 'h-[250px]'

  return (
    <div className={`w-full ${height} bg-dark-800/50 rounded-xl flex items-center justify-center text-dark-500 text-xs border border-dark-600 border-dashed`}>
      Publicidad &mdash; <a href="mailto:ads@lajerga.app" className="text-primary-400 hover:underline ml-1">Anunciate aqu&iacute;</a>
    </div>
  )
}
