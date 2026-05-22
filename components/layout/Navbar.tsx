'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronDown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { AnnouncementBar } from './AnnouncementBar';
import { UltraLogo } from '@/components/ui/UltraLogo';

// ─── Brand subcategories ──────────────────────────────────────────────────────
const COLLECTIONS_MENU = [
  {
    category: 'Cuidado Capilar',
    handle: 'capilar',
    emoji: '💆‍♀️',
    brands: ['Anyeluz', 'Atenea', 'Montoc', 'Milagros', 'OGX', 'Pantene', 'Sedal', 'Tío Nacho', 'Wella'],
  },
  {
    category: 'Maquillaje',
    handle: 'maquillaje',
    emoji: '💄',
    brands: ['Anyeluz', 'Atenea', 'Milagros', "L'Oréal", 'Revlon', 'Maybelline', 'NYX', 'Rimmel'],
  },
  {
    category: 'Dermocosméticos',
    handle: 'dermocosmeticos',
    emoji: '✨',
    brands: ['Anyeluz', 'Atenea', 'Montoc', 'Milagros', 'Weleda', 'Savar', 'Natura', 'Payot'],
  },
];

const EXTRA_LINKS = [
  { label: 'Novedades', href: '/colecciones/novedades' },
  { label: 'Ofertas 🔥', href: '/colecciones/ofertas' },
];

export function Navbar() {
  const pathname = usePathname();
  const { cart, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const totalItems = cart?.totalQuantity ?? 0;

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300 bg-white',
          scrolled ? 'shadow-md' : 'shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-ultra-500"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <UltraLogo size={40} />
              <span className="hidden sm:block text-sm font-semibold text-gray-500 tracking-widest uppercase group-hover:text-ultra-500 transition-colors">
                belleza
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === '/' ? 'text-ultra-600 bg-ultra-50' : 'text-gray-700 hover:text-ultra-600 hover:bg-ultra-50'
                )}
              >
                Inicio
              </Link>

              {/* Colecciones mega-menu */}
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname.startsWith('/colecciones')
                      ? 'text-ultra-600 bg-ultra-50'
                      : 'text-gray-700 hover:text-ultra-600 hover:bg-ultra-50'
                  )}
                >
                  Colecciones
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform', megaOpen && 'rotate-180')}
                  />
                </button>

                {/* Mega menu */}
                {megaOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[680px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-fade-in">
                    <div className="grid grid-cols-3 gap-6">
                      {COLLECTIONS_MENU.map((col) => (
                        <div key={col.handle}>
                          <Link
                            href={`/colecciones/${col.handle}`}
                            className="flex items-center gap-2 font-bold text-gray-900 hover:text-ultra-600 mb-3 group"
                          >
                            <span className="text-xl">{col.emoji}</span>
                            <span className="text-sm">{col.category}</span>
                          </Link>
                          <ul className="space-y-1.5">
                            <li>
                              <Link
                                href={`/colecciones/${col.handle}`}
                                className="text-xs font-semibold text-ultra-500 hover:text-ultra-700 uppercase tracking-wide"
                              >
                                Ver todo →
                              </Link>
                            </li>
                            {col.brands.map((brand) => (
                              <li key={brand}>
                                <Link
                                  href={`/colecciones/${col.handle}?marca=${encodeURIComponent(brand)}`}
                                  className="text-sm text-gray-600 hover:text-ultra-600 hover:font-medium transition-all"
                                >
                                  {brand}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                      <Link
                        href="/colecciones"
                        className="flex-1 text-center py-2 bg-ultra-50 text-ultra-700 text-sm font-semibold rounded-xl hover:bg-ultra-100 transition-colors"
                      >
                        Ver todas las colecciones
                      </Link>
                      <Link
                        href="/colecciones/ofertas"
                        className="flex-1 text-center py-2 bg-ultra-gradient text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                      >
                        🔥 Ver ofertas
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {EXTRA_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === link.href
                      ? 'text-ultra-600 bg-ultra-50'
                      : 'text-gray-700 hover:text-ultra-600 hover:bg-ultra-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              {searchOpen ? (
                <form action="/buscar" method="get" className="hidden lg:flex items-center">
                  <input
                    name="q"
                    autoFocus
                    placeholder="Buscar productos o marcas..."
                    className="w-52 px-3 py-1.5 text-sm border border-ultra-200 rounded-l-lg focus:outline-none focus:border-ultra-500"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-ultra-500 text-white rounded-r-lg">
                    <Search size={15} />
                  </button>
                  <button type="button" onClick={() => setSearchOpen(false)} className="ml-2 text-gray-400 hover:text-gray-600">
                    <X size={15} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-ultra-600 rounded-md hover:bg-ultra-50 transition-colors"
                  aria-label="Buscar"
                >
                  <Search size={20} />
                </button>
              )}

              <button className="hidden sm:flex p-2 text-gray-600 hover:text-ultra-600 rounded-md hover:bg-ultra-50 transition-colors" aria-label="Favoritos">
                <Heart size={20} />
              </button>

              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-ultra-600 rounded-md hover:bg-ultra-50 transition-colors"
                aria-label={`Carrito (${totalItems})`}
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-ultra-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in max-h-[80vh] overflow-y-auto">
            {/* Mobile search */}
            <div className="p-4 border-b border-gray-100">
              <form action="/buscar" method="get" className="flex gap-2">
                <input
                  name="q"
                  placeholder="Buscar productos o marcas..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ultra-500"
                />
                <button type="submit" className="px-4 bg-ultra-500 text-white rounded-lg">
                  <Search size={16} />
                </button>
              </form>
            </div>

            <nav className="py-2">
              <Link href="/" className="block px-6 py-3 text-sm font-medium text-gray-800 hover:text-ultra-600 hover:bg-ultra-50">
                Inicio
              </Link>

              {/* Collapsible collection categories */}
              {COLLECTIONS_MENU.map((col) => (
                <div key={col.handle}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === col.handle ? null : col.handle)}
                    className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-800 hover:text-ultra-600 hover:bg-ultra-50"
                  >
                    <span className="flex items-center gap-2">
                      <span>{col.emoji}</span>
                      {col.category}
                    </span>
                    <ChevronDown
                      size={14}
                      className={cn('text-gray-400 transition-transform', mobileExpanded === col.handle && 'rotate-180')}
                    />
                  </button>
                  {mobileExpanded === col.handle && (
                    <div className="bg-gray-50 px-6 py-2 space-y-1">
                      <Link
                        href={`/colecciones/${col.handle}`}
                        className="block py-2 text-sm font-semibold text-ultra-600"
                      >
                        Ver todo {col.category}
                      </Link>
                      {col.brands.map((brand) => (
                        <Link
                          key={brand}
                          href={`/colecciones/${col.handle}?marca=${encodeURIComponent(brand)}`}
                          className="block py-1.5 pl-3 text-sm text-gray-600 hover:text-ultra-600 border-l-2 border-gray-200 hover:border-ultra-400"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {EXTRA_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-6 py-3 text-sm font-medium text-gray-800 hover:text-ultra-600 hover:bg-ultra-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
