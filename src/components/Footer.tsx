import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              LaJerga
            </h3>
            <p className="text-dark-400 text-sm mt-1">
              Diccionario colaborativo de jergas latinoamericanas
            </p>
          </div>
          <div className="flex gap-6 text-sm text-dark-400">
            <Link href="/" className="hover:text-primary-400 transition-colors">Inicio</Link>
            <Link href="/agregar" className="hover:text-primary-400 transition-colors">Agregar jerga</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-dark-800 text-center text-xs text-dark-500">
          &copy; {new Date().getFullYear()} LaJerga. Hecho con amor para Latinoam&eacute;rica.
        </div>
      </div>
    </footer>
  )
}
