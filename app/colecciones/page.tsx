export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getCollections } from '@/lib/shopify/queries';

export const metadata: Metadata = {
  title: 'Todas las colecciones',
  description: 'Explora todas las categorías de ULTRA belleza: maquillaje, capilar, dermocosméticos y más.',
};

export default async function CollectionsPage() {
  let collections = [];
  try {
    collections = await getCollections();
  } catch {
    collections = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Todas las colecciones</h1>
        <p className="text-gray-500 mt-1">Explora nuestras categorías de belleza</p>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">No hay colecciones disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/colecciones/${collection.handle}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-nude-50 border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-ultra-gradient-soft flex items-center justify-center">
                  <span className="text-6xl">✨</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-xl font-bold text-white">{collection.title}</h2>
                {collection.description && (
                  <p className="text-white/80 text-sm mt-1 line-clamp-1">
                    {collection.description}
                  </p>
                )}
                <span className="inline-block mt-2 text-xs font-semibold text-ultra-300 group-hover:text-white transition-colors">
                  Ver productos →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
