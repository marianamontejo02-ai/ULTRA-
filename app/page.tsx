export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandBar } from '@/components/home/BrandBar';
import { SocialProof } from '@/components/home/SocialProof';
import { ProductGridSkeleton } from '@/components/product/ProductGrid';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />

      <Suspense fallback={<div className="py-16 px-4 max-w-7xl mx-auto"><ProductGridSkeleton count={8} /></div>}>
        <FeaturedProducts
          title="Más vendidos"
          subtitle="Los favoritos de nuestra comunidad"
          sortKey="BEST_SELLING"
          limit={8}
        />
      </Suspense>

      <BrandBar />

      <Suspense fallback={<div className="py-16 px-4 max-w-7xl mx-auto"><ProductGridSkeleton count={4} /></div>}>
        <FeaturedProducts
          title="Novedades"
          subtitle="Recién llegados a nuestra tienda"
          sortKey="CREATED_AT"
          limit={4}
          viewAllHref="/colecciones/novedades"
        />
      </Suspense>

      <SocialProof />

      {/* Promo banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ultra-gradient-soft">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-ultra-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Oferta limitada
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🚚 Envío GRATIS en tu primera compra
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Usa el código <span className="font-bold text-ultra-600 bg-ultra-100 px-2 py-1 rounded-lg">ULTRA10</span>{' '}
            y obtén 10% de descuento + envío gratis
          </p>
          <a
            href="/colecciones"
            className="inline-flex items-center gap-2 px-10 py-4 bg-ultra-gradient text-white font-bold text-base rounded-2xl hover:opacity-90 ultra-shadow hover:ultra-shadow-lg transition-all"
          >
            Aprovechar oferta ✨
          </a>
        </div>
      </section>
    </>
  );
}
