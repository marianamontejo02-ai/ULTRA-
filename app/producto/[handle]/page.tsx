export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Truck, RefreshCw, Shield, ChevronDown, Eye } from 'lucide-react';
import { getProductByHandle, getProductRecommendations } from '@/lib/shopify/queries';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ProductGrid } from '@/components/product/ProductGrid';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface ProductPageProps {
  params: { handle: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `${product.title} en ULTRA belleza`,
    openGraph: {
      title: product.title,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductByHandle(params.handle);
  if (!product) notFound();

  const recommendations = await getProductRecommendations(product.id);
  const firstVariant = product.variantsList[0];
  const discountPct = firstVariant
    ? getDiscountPercentage(firstVariant.price, firstVariant.compareAtPrice)
    : 0;

  const isLowStock =
    firstVariant?.quantityAvailable !== null &&
    firstVariant?.quantityAvailable !== undefined &&
    firstVariant.quantityAvailable <= 5 &&
    firstVariant.quantityAvailable > 0;

  const breadcrumbCollection = product.collections.edges[0]?.node;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-ultra-600">Inicio</Link>
        {' / '}
        {breadcrumbCollection && (
          <>
            <Link href={`/colecciones/${breadcrumbCollection.handle}`} className="hover:text-ultra-600">
              {breadcrumbCollection.title}
            </Link>
            {' / '}
          </>
        )}
        <span className="text-gray-800 font-medium line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Images */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-nude-50 border border-gray-100">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl">✨</span>
              </div>
            )}
            {discountPct > 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="sale" className="text-sm px-3 py-1">
                  -{discountPct}%
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.imagesList.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scroll-smooth">
              {product.imagesList.map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-ultra-200 bg-nude-50 cursor-pointer hover:border-ultra-400 transition-colors"
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.title} imagen ${i + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          {/* Brand & badges */}
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/colecciones/${product.vendor.toLowerCase()}`}
              className="text-sm font-bold text-ultra-600 uppercase tracking-wider hover:text-ultra-700"
            >
              {product.vendor}
            </Link>
            <div className="flex gap-1.5">
              {product.tags.includes('nuevo') && <Badge variant="new">Nuevo</Badge>}
              {product.tags.includes('bestseller') && <Badge variant="bestseller">Top</Badge>}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">
            {product.title}
          </h1>

          {/* Rating (static for now) */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-amber-400 text-sm">★</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">4.8 (127 reseñas)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className={`text-3xl font-bold ${discountPct > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {firstVariant && formatPrice(firstVariant.price)}
            </span>
            {firstVariant?.compareAtPrice &&
              parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount) && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(firstVariant.compareAtPrice)}
                  </span>
                  <Badge variant="sale">Ahorras {discountPct}%</Badge>
                </>
              )}
          </div>

          {/* Urgency signals */}
          {isLowStock && (
            <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl">
              <span className="text-orange-500 text-sm font-semibold">
                ⚡ ¡Solo quedan {firstVariant?.quantityAvailable} en stock!
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
            <Eye size={14} />
            <span>
              {Math.floor(Math.random() * 20) + 8} personas están viendo este producto ahora
            </span>
          </div>

          {/* Variant selector — client */}
          {product.options.length > 0 && (
            <div className="mb-6">
              <VariantSelector
                options={product.options}
                variants={product.variantsList}
                onVariantChange={() => {}}
              />
            </div>
          )}

          {/* Add to cart */}
          <AddToCartButton
            variantId={firstVariant?.id ?? ''}
            available={product.availableForSale && (firstVariant?.availableForSale ?? false)}
            className="mb-5"
          />

          {/* Shipping & guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, title: 'Envío a Colombia', text: 'Despacho en 24h' },
              { icon: RefreshCw, title: 'Devoluciones', text: '30 días, sin preguntas' },
              { icon: Shield, title: '100% Original', text: 'Garantía de autenticidad' },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <Icon size={18} className="text-ultra-500 mb-1.5" />
                <p className="text-xs font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <p className="text-xs text-gray-500 mb-6 text-center">
            💳 Paga con Visa, Mastercard, Nequi, PSE, Bancolombia o Efecty
          </p>

          {/* Accordion: Description, Ingredients, How to use */}
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            {[
              { title: 'Descripción del producto', content: product.descriptionHtml },
              {
                title: 'Modo de uso',
                content: '<p>Aplica según las indicaciones del producto. Para mejores resultados, úsalo en tu rutina diaria de belleza.</p>',
              },
            ].map((section) => (
              <details key={section.title} className="group py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-gray-800 hover:text-ultra-600">
                  {section.title}
                  <ChevronDown
                    size={16}
                    className="text-gray-400 group-open:rotate-180 transition-transform"
                  />
                </summary>
                <div
                  className="mt-3 text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="mt-16 pt-10 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Completa tu rutina</h2>
          <ProductGrid products={recommendations} />
        </section>
      )}
    </div>
  );
}
