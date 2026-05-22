export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCollection, getCollections } from '@/lib/shopify/queries';
import { ProductGrid } from '@/components/product/ProductGrid';
import { BrandFilter } from '@/components/collection/BrandFilter';
import type { Product } from '@/lib/shopify/types';

interface CollectionPageProps {
  params: { handle: string };
  searchParams: { sort?: string; marca?: string };
}

const SORT_OPTIONS = [
  { label: 'Más vendidos',          value: 'BEST_SELLING' },
  { label: 'Precio: menor a mayor', value: 'PRICE_ASC' },
  { label: 'Precio: mayor a menor', value: 'PRICE_DESC' },
  { label: 'Más recientes',         value: 'CREATED' },
  { label: 'A – Z',                 value: 'TITLE' },
];

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  try {
    const collection = await getCollection({ handle: params.handle });
    if (!collection) return { title: 'Colección no encontrada' };
    return {
      title: collection.title,
      description:
        collection.description ||
        `Descubre nuestra colección de ${collection.title} en ULTRA belleza.`,
    };
  } catch {
    return { title: params.handle };
  }
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const sortParam = searchParams.sort || 'BEST_SELLING';
  const marcaFilter = searchParams.marca?.trim() || '';

  // Map sort param to Shopify args
  const sortMap: Record<string, { sortKey: string; reverse: boolean }> = {
    BEST_SELLING: { sortKey: 'BEST_SELLING', reverse: false },
    PRICE_ASC:    { sortKey: 'PRICE',        reverse: false },
    PRICE_DESC:   { sortKey: 'PRICE',        reverse: true  },
    CREATED:      { sortKey: 'CREATED',      reverse: true  },
    TITLE:        { sortKey: 'TITLE',        reverse: false },
  };
  const { sortKey, reverse } = sortMap[sortParam] ?? sortMap.BEST_SELLING;

  let collection;
  try {
    collection = await getCollection({ handle: params.handle, first: 100, sortKey, reverse });
  } catch {
    collection = null;
  }

  if (!collection) notFound();

  // Normalize products
  let products: Product[] = collection.products.edges.map((e) => ({
    ...e.node,
    variantsList: e.node.variants.edges.map((v) => v.node),
    imagesList:   e.node.images.edges.map((img) => img.node),
  }));

  // Collect unique vendors for the brand filter
  const allVendors = Array.from(new Set(products.map((p) => p.vendor).filter(Boolean))).sort();

  // Apply brand filter
  if (marcaFilter) {
    products = products.filter(
      (p) => p.vendor.toLowerCase() === marcaFilter.toLowerCase()
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-5">
        <Link href="/" className="hover:text-ultra-600">Inicio</Link>
        {' / '}
        <Link href="/colecciones" className="hover:text-ultra-600">Colecciones</Link>
        {' / '}
        <span className="text-gray-800 font-medium">{collection.title}</span>
        {marcaFilter && (
          <>
            {' / '}
            <span className="text-ultra-600 font-medium">{marcaFilter}</span>
          </>
        )}
      </nav>

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {marcaFilter ? (
              <>
                {marcaFilter}{' '}
                <span className="text-gray-400 font-normal text-xl">en {collection.title}</span>
              </>
            ) : (
              collection.title
            )}
          </h1>
          {collection.description && !marcaFilter && (
            <p className="text-gray-500 mt-1 max-w-2xl text-sm">{collection.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-1">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        {/* Sort selector */}
        <form method="get" className="flex items-center gap-2 shrink-0">
          {marcaFilter && <input type="hidden" name="marca" value={marcaFilter} />}
          <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">Ordenar:</label>
          <select
            id="sort"
            name="sort"
            defaultValue={sortParam}
            onChange={(e) => (e.target.form as HTMLFormElement).submit()}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-ultra-500 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </form>
      </div>

      {/* Brand filter pills */}
      <BrandFilter
        brands={allVendors}
        active={marcaFilter}
        collectionHandle={params.handle}
        sortParam={sortParam}
      />

      {/* Products grid */}
      <ProductGrid products={products} priority />
    </div>
  );
}
