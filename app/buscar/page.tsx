export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { getProducts } from '@/lib/shopify/queries';
import { ProductGrid } from '@/components/product/ProductGrid';

interface SearchPageProps {
  searchParams: { q?: string };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const q = searchParams.q;
  return {
    title: q ? `Resultados para "${q}"` : 'Buscar productos',
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() || '';
  const products = q ? await getProducts({ first: 24, query: q }) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search form */}
      <form action="/buscar" method="get" className="mb-10 max-w-2xl">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar maquillaje, capilar, dermocosméticos..."
              autoFocus={!q}
              className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-ultra-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-ultra-gradient text-white font-bold text-sm rounded-2xl hover:opacity-90 transition-opacity"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Results */}
      {!q ? (
        <div className="text-center py-20 text-gray-400">
          <Search size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium text-gray-500">¿Qué estás buscando?</p>
          <p className="text-sm mt-1">
            Busca por nombre del producto, marca o categoría
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {['Sérum vitamina C', 'Shampoo OGX', 'Base L\'Oréal', 'Mascarilla capilar', 'Labial matte'].map(
              (suggestion) => (
                <a
                  key={suggestion}
                  href={`/buscar?q=${encodeURIComponent(suggestion)}`}
                  className="px-4 py-2 bg-nude-50 text-gray-700 text-sm rounded-full border border-nude-200 hover:bg-ultra-50 hover:border-ultra-200 hover:text-ultra-700 transition-colors"
                >
                  {suggestion}
                </a>
              )
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {products.length > 0 ? (
                <>
                  <span className="text-ultra-600">{products.length}</span> resultados para "{q}"
                </>
              ) : (
                `Sin resultados para "${q}"`
              )}
            </h1>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-2">
                No encontramos productos que coincidan con tu búsqueda.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Intenta con términos más generales o busca por marca.
              </p>
              <a
                href="/colecciones"
                className="inline-block px-8 py-3 bg-ultra-gradient text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
              >
                Ver todos los productos
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
