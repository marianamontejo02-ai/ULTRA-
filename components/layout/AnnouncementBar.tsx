'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ANNOUNCEMENTS = [
  '🚚 Envío GRATIS en compras desde $150.000 a todo Colombia',
  '✨ Nuevas llegadas de dermocosméticos colombianos — ¡Descúbrelas!',
  '🧴 3x2 en productos capilares seleccionados esta semana',
  '💳 Paga con Nequi, PSE o tarjeta — Hasta 12 cuotas sin interés',
  '🌟 Más de 10.000 mujeres felices nos respaldan',
];

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-ultra-gradient text-white text-center text-xs sm:text-sm font-medium py-2 px-10 overflow-hidden">
      <span
        key={current}
        className="inline-block animate-fade-in"
        style={{ animationDuration: '0.5s' }}
      >
        {ANNOUNCEMENTS[current]}
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        aria-label="Cerrar anuncio"
      >
        <X size={14} />
      </button>
    </div>
  );
}
