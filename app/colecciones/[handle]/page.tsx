export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCollection, getCollections } from '@/lib/shopify/queries';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Product } from '@/lib/shopify/types';

interface CollectionPageProps {
  params: { handle: string };
  searchParams: { sort?: string; order?: string };
}

const SORT_OPTIONS = [
  { label: 'Más vendidos', key: 'BEST_SELLING', reverse: false },
  { label: 'Precio: menor a mayor', key: 'PRICE', reverse: false },
  { label: 'Precio: mayor a menor', key: 'PRICE', reverse: true },
  { label: 'Más recientes', key: 'CREATED', reverse: true },
  { label: 'A–Z', key: 'TITLE', reverse: false },
];

export async function generateStaticParams() {
  try {
    const collections = await getCollections();
    return collections.map((c) => ({ handle: c.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollection({ handle: params.handle });
  if (!collection) return { title: 'Colección no encontrada' };
  return {
    title: collection.title,
    description:
      collection.description ||
      `Descubre nuestra colección de ${collection.title} en ULTRA belleza.`,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const sortKey = searchParams.sort || 'BEST_SELLING';
  const reverse = searchParams.order === 'desc';

  const collection = await getCollection({
    handle: params.handle,
    first: 24,
    sortKey,
    reverse,
  });

  if (!collection) notFound();

  const products: Product[] = collection.products.edges.map((e) => ({
    ...e.node,
    variantsList: e.node.variants.edges.map((v) => v.node),
    imagesList: e.node.images.edges.map((img) => img.node),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-3">
          <a href="/" className="hover:text-ultra-600">Inicio</a>
          {' / '}
          <a href="/colecciones" className="hover:text-ultra-600">Colecciones</a>
          {' / '}
          <span className="text-gray-800 font-medium">{collection.title}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{collection.title}</h1>
            {collection.description && (
              <p className="text-gray-500 mt-1 max-w-2xl">{collection.description}</p>
            )}
            <p className="text-sm text-gray-400 mt-1">
              {collection.products.edges.length} productos
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
              Ordenar por:
            </label>
            <select
              id="sort"
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-ultra-500 bg-white"
              defaultValue={sortKey}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set('sort', e.target.value);
                window.location.href = url.toString();
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={`${opt.key}-${opt.reverse}`} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <ProductGrid products={products} priority />

      {/* Load more */}
      {collection.products.pageInfo.hasNextPage && (
        <div className="text-center mt-12">
          <button className="px-10 py-3.5 border-2 border-ultra-500 text-ultra-600 font-semibold rounded-2xl hover:bg-ultra-50 transition-colors">
            Cargar más productos
          </button>
        </div>
      )}
    </div>
  );
}
