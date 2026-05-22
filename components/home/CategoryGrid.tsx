import Link from 'next/link';

const CATEGORIES = [
  {
    title: 'Cuidado Capilar',
    subtitle: 'Shampoos, mascarillas y más',
    href: '/colecciones/capilar',
    emoji: '💆‍♀️',
    color: 'from-amber-50 to-amber-100',
    border: 'border-amber-200',
    textColor: 'text-amber-800',
  },
  {
    title: 'Maquillaje',
    subtitle: 'Base, labiales, delineadores',
    href: '/colecciones/maquillaje',
    emoji: '💄',
    color: 'from-rose-50 to-rose-100',
    border: 'border-rose-200',
    textColor: 'text-rose-800',
  },
  {
    title: 'Dermocosméticos',
    subtitle: 'Tratamientos especializados',
    href: '/colecciones/dermocosmeticos',
    emoji: '✨',
    color: 'from-violet-50 to-violet-100',
    border: 'border-violet-200',
    textColor: 'text-violet-800',
  },
  {
    title: 'Skin Care',
    subtitle: 'Sérum, cremas y hidratación',
    href: '/colecciones/skin-care',
    emoji: '🌿',
    color: 'from-emerald-50 to-emerald-100',
    border: 'border-emerald-200',
    textColor: 'text-emerald-800',
  },
  {
    title: 'Cuerpo & Baño',
    subtitle: 'Cremas corporales y más',
    href: '/colecciones/cuerpo',
    emoji: '🛁',
    color: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    textColor: 'text-blue-800',
  },
  {
    title: 'Accesorios',
    subtitle: 'Uñas, brochas y herramientas',
    href: '/colecciones/accesorios',
    emoji: '💅',
    color: 'from-pink-50 to-pink-100',
    border: 'border-pink-200',
    textColor: 'text-pink-800',
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Encuentra lo que buscas
        </h2>
        <p className="text-gray-500">Todo lo que necesitas para tu rutina de belleza</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`group flex flex-col items-center p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${cat.color} border ${cat.border} hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-center`}
          >
            <span className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-200">
              {cat.emoji}
            </span>
            <span className={`font-bold text-sm ${cat.textColor} leading-tight mb-0.5`}>
              {cat.title}
            </span>
            <span className="text-[11px] text-gray-500 hidden sm:block">{cat.subtitle}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
