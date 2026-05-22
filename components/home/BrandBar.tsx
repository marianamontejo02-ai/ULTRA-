const BRANDS = [
  { name: "L'Oréal", flag: '🇫🇷' },
  { name: 'Revlon', flag: '🇺🇸' },
  { name: 'OGX', flag: '🇺🇸' },
  { name: 'Tío Nacho', flag: '🇨🇴' },
  { name: 'Savar', flag: '🇨🇴' },
  { name: 'Pantene', flag: '🌎' },
  { name: 'Sedal', flag: '🌎' },
  { name: 'Wella', flag: '🇩🇪' },
  { name: 'Kerastase', flag: '🇫🇷' },
  { name: 'Weleda', flag: '🇩🇪' },
  { name: 'Natura', flag: '🇧🇷' },
  { name: 'Payot', flag: '🇧🇷' },
];

export function BrandBar() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Marcas que amamos y distribuimos
        </p>
      </div>
      <div className="relative flex gap-8 items-center">
        {/* Duplicated for infinite scroll effect */}
        <div className="flex animate-ticker gap-8 items-center">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[90px] px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-ultra-200 hover:shadow-md transition-all"
            >
              <span className="text-2xl">{brand.flag}</span>
              <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
