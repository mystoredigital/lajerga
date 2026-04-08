import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-4">
        &iexcl;Esa jerga no existe!
      </h2>
      <p className="text-dark-400 mb-8">
        No encontramos lo que buscas. Quiz&aacute;s a&uacute;n nadie la ha agregado.
      </p>
      <Link
        href="/"
        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-block"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
