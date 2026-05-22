'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronDown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { AnnouncementBar } from './AnnouncementBar';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Colecciones',
    href: '/colecciones',
    children: [
      { label: 'Cuidado Capilar', href: '/colecciones/capilar', icon: '💆‍♀️' },
      { label: 'Maquillaje', href: '/colecciones/maquillaje', icon: '💄' },
      { label: 'Dermocosméticos', href: '/colecciones/dermocosmeticos', icon: '✨' },
      { label: 'Skin Care', href: '/colecciones/skin-care', icon: '🌿' },
      { label: 'Cuerpo & Baño', href: '/colecciones/cuerpo', icon: '🛁' },
      { label: 'Accesorios', href: '/colecciones/accesorios', icon: '💅' },
    ],
  },
  { label: 'Marcas', href: '/colecciones/marcas' },
  { label: 'Novedades', href: '/colecciones/novedades' },
  { label: 'Ofertas', href: '/colecciones/ofertas' },
];

export function Navbar() {
  const pathname = usePathname();
  const { cart, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const totalItems = cart?.totalQuantity ?? 0;

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-white shadow-md'
            : 'bg-white/95 backdrop-blur-sm'
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
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-bold text-xl sm:text-2xl text-ultra-600 tracking-tight"
            >
              <span className="hidden xs:inline-block w-8 h-8 bg-ultra-gradient rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ultra-shadow">
                U
              </span>
              <span>
                ULTRA{' '}
                <span className="text-gray-800 font-light tracking-widest text-base sm:text-lg">
                  belleza
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      pathname === link.href
                        ? 'text-ultra-600 bg-ultra-50'
                        : 'text-gray-700 hover:text-ultra-600 hover:bg-ultra-50'
                    )}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={14} className="mt-0.5" />}
                  </Link>

                  {/* Mega dropdown */}
                  {link.children && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-ultra-50 hover:text-ultra-600 transition-colors"
                        >
                          <span className="text-base">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              {searchOpen ? (
                <form
                  action="/buscar"
                  method="get"
                  className="hidden lg:flex items-center"
                >
                  <input
                    ref={searchRef}
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-52 px-3 py-1.5 text-sm border border-ultra-200 rounded-l-lg focus:outline-none focus:border-ultra-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-ultra-500 text-white rounded-r-lg hover:bg-ultra-600 transition-colors"
                  >
                    <Search size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-ultra-600 transition-colors rounded-md hover:bg-ultra-50"
                  aria-label="Buscar"
                >
                  <Search size={20} />
                </button>
              )}

              {/* Wishlist */}
              <button
                className="hidden sm:flex p-2 text-gray-600 hover:text-ultra-600 transition-colors rounded-md hover:bg-ultra-50"
                aria-label="Lista de deseos"
              >
                <Heart size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-ultra-600 transition-colors rounded-md hover:bg-ultra-50"
                aria-label={`Carrito (${totalItems} items)`}
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
          <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
            {/* Mobile search */}
            <div className="p-4 border-b border-gray-100">
              <form action="/buscar" method="get" className="flex">
                <input
                  name="q"
                  placeholder="Buscar productos..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-l-lg focus:outline-none focus:border-ultra-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-ultra-500 text-white rounded-r-lg"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            <nav className="py-2">
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-800 hover:text-ultra-600 hover:bg-ultra-50"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="bg-gray-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 px-10 py-2.5 text-sm text-gray-600 hover:text-ultra-600"
                        >
                          <span>{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <Link
                href="/cuenta"
                className="block text-center py-2.5 px-4 bg-ultra-gradient text-white font-semibold rounded-lg text-sm"
              >
                Mi cuenta
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
