import Link from 'next/link';
import { Instagram, MessageCircle, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const COLLECTIONS = [
  { label: 'Cuidado Capilar', href: '/colecciones/capilar' },
  { label: 'Maquillaje', href: '/colecciones/maquillaje' },
  { label: 'Dermocosméticos', href: '/colecciones/dermocosmeticos' },
  { label: 'Skin Care', href: '/colecciones/skin-care' },
  { label: 'Cuerpo & Baño', href: '/colecciones/cuerpo' },
  { label: 'Ofertas', href: '/colecciones/ofertas' },
];

const INFO_LINKS = [
  { label: 'Sobre nosotras', href: '/nosotras' },
  { label: 'Políticas de envío', href: '/envio' },
  { label: 'Devoluciones', href: '/devoluciones' },
  { label: 'Preguntas frecuentes', href: '/faq' },
  { label: 'Términos y condiciones', href: '/terminos' },
  { label: 'Política de privacidad', href: '/privacidad' },
];

const PAYMENT_METHODS = [
  { name: 'Visa', src: 'https://cdn.shopify.com/s/files/1/0303/7507/5765/files/visa.svg' },
  { name: 'Mastercard', src: 'https://cdn.shopify.com/s/files/1/0303/7507/5765/files/mastercard.svg' },
  { name: 'PSE', label: 'PSE' },
  { name: 'Nequi', label: 'Nequi' },
  { name: 'Bancolombia', label: 'Bancolombia' },
  { name: 'Efecty', label: 'Efecty' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter strip */}
      <div className="bg-ultra-gradient py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-white text-2xl font-bold mb-1">
            Únete a la comunidad ULTRA belleza
          </h3>
          <p className="text-white/80 text-sm mb-5">
            Suscríbete y recibe un <strong>10% de descuento</strong> en tu primera compra +
            novedades, tips y ofertas exclusivas.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@correo.com"
              required
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Quiero mi descuento ✨
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-white text-2xl font-bold tracking-tight">
                ULTRA{' '}
                <span className="text-ultra-400 font-light tracking-widest text-lg">belleza</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Tu tienda de belleza accesible y moderna. Maquillaje, capilar y cuidado personal
              para mujeres colombianas que quieren verse increíbles sin gastar de más.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com/ultrabelleza', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com/ultrabelleza', label: 'Facebook' },
                { icon: Youtube, href: 'https://youtube.com/@ultrabelleza', label: 'YouTube' },
                { icon: MessageCircle, href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567'}`, label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-ultra-500 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Tienda
            </h4>
            <ul className="space-y-2.5">
              {COLLECTIONS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-ultra-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Información
            </h4>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-ultra-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin size={15} className="text-ultra-400 mt-0.5 flex-shrink-0" />
                Colombia — Envíos a todo el país
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <MessageCircle size={15} className="text-ultra-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/573001234567`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ultra-400 transition-colors"
                >
                  WhatsApp: +57 300 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail size={15} className="text-ultra-400 flex-shrink-0" />
                <a
                  href="mailto:hola@ultra.com.co"
                  className="hover:text-ultra-400 transition-colors"
                >
                  hola@ultra.com.co
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone size={15} className="text-ultra-400 flex-shrink-0" />
                Lun–Sáb: 8am – 6pm
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 px-4 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} ULTRA belleza. Todos los derechos reservados.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method.name}
                className="px-2.5 py-1 bg-gray-800 text-gray-400 text-[10px] font-semibold rounded-md uppercase tracking-wide"
              >
                {method.label || method.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
