# ULTRA belleza — Guía de configuración en Shopify

## 1. Instalar el tema
Shopify Admin → Tienda online → Temas → "Subir tema" → selecciona `ultra-belleza-theme.zip`

---

## 2. Configurar la navegación (IMPORTANTE — hazlo PRIMERO)

El menú del encabezado se alimenta de los menús de Shopify:

**Shopify Admin → Tienda online → Navegación**

### Menú principal (barra de categorías)
- Nombre del menú: `main-menu` (ya existe por defecto)
- Agrega los enlaces que quieras en el orden que quieras:
  - Inicio → /
  - Maquillaje → /collections/maquillaje
  - Cuidado Capilar → /collections/capilar
  - Dermocosméticos → /collections/dermocosmeticos
  - Skin Care → /collections/skin-care
  - Novedades → /collections/novedades
  - Ofertas → /collections/ofertas

### Mega-menús de marcas (opcionales)
Crea estos menús adicionales para que aparezcan los desplegables de marcas:

**Menú: `mega-maquillaje`**  
Agrega los enlaces de marcas de maquillaje:
- Anyeluz → /collections/maquillaje?filter.p.vendor=Anyeluz
- Atenea → /collections/maquillaje?filter.p.vendor=Atenea
- Milagros → /collections/maquillaje?filter.p.vendor=Milagros
- L'Oréal → /collections/maquillaje?filter.p.vendor=L'Or%C3%A9al
- Maybelline → /collections/maquillaje?filter.p.vendor=Maybelline
- (etc.)

**Menú: `mega-capilar`**
**Menú: `mega-dermos`**

---

## 3. Personalizar el tema

**Shopify Admin → Tienda online → Temas → Personalizar**

### Encabezado
En la configuración del encabezado puedes editar:
- Qué menú principal usar
- Qué menú mega para cada categoría
- Texto de búsqueda
- Qué palabra del menú resaltar en rojo ("Ofertas")

### Hero principal
- Elige el diseño: Dividido (foto a la derecha) o Imagen de fondo completa
- Sube tu foto de modelo
- Edita título, subtítulo, botones y sus enlaces

### Cuadrícula de categorías
- Haz clic en cada tarjeta para editarla
- Sube la foto de esa categoría
- Cambia el nombre, descripción y enlace

### Productos destacados (aparecen dos secciones)
- Selecciona la colección que quieres mostrar
- Elige cuántos productos mostrar (2–16)
- Activa "Modo carrusel" si quieres scroll horizontal

### Reseñas
- Edita cada reseña o agrega nuevas
- Puedes subir foto del cliente

---

## 4. Filtros en páginas de colección
Los filtros de marca, precio y disponibilidad se generan automáticamente desde los productos de cada colección. No necesitas configurarlos manualmente.

---

## 5. WhatsApp
**Shopify Admin → Tienda online → Temas → Personalizar → Configuración del tema (ícono de paleta)**
- Número de WhatsApp (solo dígitos, sin +): ej. 573001234567
- Mensaje predeterminado

---

## Preguntas frecuentes

**¿Por qué no veo productos en la página de inicio?**  
Ve a Personalizar → sección "Más vendidos" → "Colección de productos" → selecciona una colección. Si no seleccionas ninguna, se muestran todos los productos automáticamente.

**¿Cómo agrego una nueva categoría al menú?**  
Shopify Admin → Tienda online → Navegación → main-menu → Agregar elemento de menú.

**¿Cómo cambio el mega-menú de una categoría?**  
Crea o edita el menú correspondiente (mega-maquillaje, mega-capilar, mega-dermos) en Shopify Admin → Navegación.
