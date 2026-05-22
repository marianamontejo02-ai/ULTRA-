import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl mb-6">💄</span>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Ups! Página no encontrada</h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md">
        Parece que esta página se fue de compras. Vuelve al inicio y encuentra lo que buscas.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-8 py-3.5 bg-ultra-gradient text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
        >
          Ir al inicio
        </Link>
        <Link
          href="/colecciones"
          className="px-8 py-3.5 border-2 border-ultra-500 text-ultra-600 font-bold rounded-2xl hover:bg-ultra-50 transition-colors"
        >
          Ver productos
        </Link>
      </div>
    </div>
  );
}
