'use client';

import { MessageCircle } from 'lucide-react';

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567';
const MESSAGE = encodeURIComponent(
  '¡Hola! Estoy en la tienda ULTRA belleza y tengo una consulta sobre un producto. ¿Me pueden ayudar?'
);

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-200 group"
    >
      <MessageCircle size={26} strokeWidth={1.5} />
      <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ¿Necesitas ayuda?
      </span>
    </a>
  );
}
