const REVIEWS = [
  {
    name: 'Valentina M.',
    city: 'Bogotá',
    rating: 5,
    text: 'Increíble calidad y rapidez en el envío. El sérum facial que compré es exactamente lo que buscaba y llegó en perfectas condiciones. ¡Ya hice mi segunda compra!',
    product: 'Sérum Vitamina C',
    avatar: 'V',
    color: 'bg-ultra-500',
  },
  {
    name: 'Camila R.',
    city: 'Medellín',
    rating: 5,
    text: 'Llevo 3 meses comprando aquí y nunca me han fallado. Los precios son mucho mejores que en otras tiendas y todo llega bien empacado. 100% recomendada!',
    product: 'Kit Capilar OGX',
    avatar: 'C',
    color: 'bg-rose-500',
  },
  {
    name: 'Daniela O.',
    city: 'Cali',
    rating: 5,
    text: 'Por fin una tienda que tiene dermocosméticos colombianos y a buen precio. El tónico de Savar es TREMENDO para el acné. Gracias ULTRA belleza!',
    product: 'Tónico Savar',
    avatar: 'D',
    color: 'bg-violet-500',
  },
  {
    name: 'Luisa F.',
    city: 'Barranquilla',
    rating: 5,
    text: 'El maquillaje que llegó es 100% original. Puse la referencia en L\'Oréal y coincidía todo. Muy profesionales y atentos en WhatsApp cuando tuve dudas.',
    product: 'Base L\'Oréal',
    avatar: 'L',
    color: 'bg-amber-500',
  },
];

export function SocialProof() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-ultra-600 font-semibold text-sm uppercase tracking-widest mb-2">
          Testimonios reales
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          +10.000 mujeres ya confían en nosotras
        </h2>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="text-amber-400 text-xl">★</span>
          ))}
          <span className="text-gray-600 text-sm ml-2 font-medium">4.9 / 5.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REVIEWS.map((review) => (
          <div
            key={review.name}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i} className="text-amber-400 text-sm">★</span>
              ))}
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">
              "{review.text}"
            </p>

            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${review.color} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}
              >
                {review.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                <p className="text-xs text-gray-500">
                  {review.city} · Compró: {review.product}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
