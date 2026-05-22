import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-nude-50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-ultra-gradient-soft" />
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-ultra-100/60 to-transparent" />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-ultra-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-nude-300/20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-ultra-200 text-ultra-600 text-sm font-medium mb-6 shadow-sm">
            <span className="w-2 h-2 bg-ultra-500 rounded-full animate-pulse" />
            ✨ Nueva colección primavera-verano
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight mb-6">
            Tu belleza,{' '}
            <span className="relative">
              <span className="relative z-10 text-ultra-600">accesible</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-ultra-200/60 -z-10 -skew-x-3" />
            </span>{' '}
            y moderna.
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
            Maquillaje, cuidado capilar y dermocosméticos premium para mujeres colombianas que
            quieren verse arregladas sin gastar de más. Marcas nacionales e internacionales en
            un solo lugar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-row gap-3 mb-10">
            <Link
              href="/colecciones"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ultra-gradient text-white font-bold text-base rounded-2xl hover:opacity-90 transition-opacity ultra-shadow hover:ultra-shadow-lg active:scale-[0.98]"
            >
              Ver productos
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/colecciones/ofertas"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-ultra-500 text-ultra-600 font-bold text-base rounded-2xl hover:bg-ultra-50 transition-colors"
            >
              🔥 Ver ofertas
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { value: '+10.000', label: 'clientas felices' },
              { value: '+500', label: 'marcas y productos' },
              { value: '4.9★', label: 'calificación promedio' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust mini-bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center flex-wrap gap-6 text-sm text-gray-600">
            {[
              '🚚 Envío a todo Colombia',
              '💳 Hasta 12 cuotas sin interés',
              '🔄 Devoluciones fáciles',
              '✅ Productos 100% originales',
              '⚡ Despacho en 24h',
            ].map((item) => (
              <span key={item} className="font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
