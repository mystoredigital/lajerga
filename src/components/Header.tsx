import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            LaJerga
          </span>
          <span className="text-xs text-dark-400 hidden sm:inline">diccionario latino</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/agregar"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Agregar jerga
          </Link>
        </nav>
      </div>
    </header>
  )
}
