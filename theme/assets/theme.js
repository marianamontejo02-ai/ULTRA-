/* ============================================================
   ULTRA belleza — theme.js
   ============================================================ */

/* ─── Announcement Bar ───────────────────────────────────── */
(function () {
  const msgs = document.querySelectorAll('[data-announcement]');
  const bar  = document.getElementById('announcement-bar');
  if (!msgs.length || !bar) return;

  let idx = 0;
  const show = (i) => {
    msgs.forEach((m, j) => {
      m.style.display = j === i ? 'block' : 'none';
      if (j === i) m.classList.add('fadeInUp');
    });
  };
  show(0);
  setInterval(() => { idx = (idx + 1) % msgs.length; show(idx); }, 4000);

  document.getElementById('announcement-close')?.addEventListener('click', () => {
    bar.style.display = 'none';
  });
})();

/* ─── Header scroll shadow ───────────────────────────────── */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();

/* ─── Mobile menu ────────────────────────────────────────── */
(function () {
  const toggle  = document.getElementById('menu-toggle');
  const menu    = document.getElementById('mobile-menu');
  const icon    = document.getElementById('menu-icon');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    icon.setAttribute('data-open', open);
  });

  // Accordion inside mobile menu
  document.querySelectorAll('.mobile-accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = btn.nextElementSibling;
      const open = list.classList.toggle('open');
      btn.classList.toggle('open', open);
    });
  });
})();

/* ─── Search toggle ──────────────────────────────────────── */
(function () {
  const btn   = document.getElementById('search-toggle');
  const form  = document.getElementById('search-form-desktop');
  const close = document.getElementById('search-close');
  if (!btn || !form) return;

  btn.addEventListener('click', () => {
    form.classList.toggle('open');
    if (form.classList.contains('open')) form.querySelector('input')?.focus();
    btn.style.display = form.classList.contains('open') ? 'none' : '';
  });
  close?.addEventListener('click', () => {
    form.classList.remove('open');
    btn.style.display = '';
  });
})();

/* ─── Cart ───────────────────────────────────────────────── */
const SHIPPING_THRESHOLD = 150000; // COP

const Cart = {
  overlay:   document.getElementById('cart-overlay'),
  drawer:    document.getElementById('cart-drawer'),
  countEl:   document.querySelectorAll('.cart-count'),
  bodyEl:    document.getElementById('cart-body'),
  subtotalEl:document.getElementById('cart-subtotal'),
  progressEl:document.getElementById('shipping-progress'),
  msgEl:     document.getElementById('shipping-msg'),

  open() {
    this.overlay?.classList.add('open');
    this.drawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.refresh();
  },
  close() {
    this.overlay?.classList.remove('open');
    this.drawer?.classList.remove('open');
    document.body.style.overflow = '';
  },
  updateCount(n) {
    this.countEl.forEach(el => {
      el.textContent = n > 99 ? '99+' : n;
      el.style.display = n > 0 ? '' : 'none';
    });
  },
  formatMoney(cents) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cents / 100);
  },
  updateShipping(subtotalCents) {
    const sub = subtotalCents / 100;
    const pct = Math.min((sub / SHIPPING_THRESHOLD) * 100, 100);
    if (this.progressEl) this.progressEl.style.width = pct + '%';
    if (this.msgEl) {
      if (pct >= 100) {
        this.msgEl.innerHTML = '<span class="shipping-free-msg">🎉 ¡Tienes envío gratis!</span>';
      } else {
        const left = SHIPPING_THRESHOLD - sub;
        this.msgEl.innerHTML = `Te faltan <strong>${new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(left)}</strong> para envío gratis`;
      }
    }
  },

  async refresh() {
    try {
      const res  = await fetch('/cart.js');
      const cart = await res.json();
      this.updateCount(cart.item_count);
      this.updateShipping(cart.total_price);
      if (this.subtotalEl) this.subtotalEl.textContent = this.formatMoney(cart.total_price);
      this.renderItems(cart);
    } catch (e) { console.error('Cart refresh error', e); }
  },

  renderItems(cart) {
    if (!this.bodyEl) return;
    if (!cart.items.length) {
      this.bodyEl.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos y vuelve aquí</p>
          <button onclick="Cart.close()" class="btn btn-primary">Ver productos</button>
        </div>`;
      return;
    }

    this.bodyEl.innerHTML = cart.items.map(item => `
      <div class="cart-item" data-key="${item.key}">
        <a href="${item.url}" class="cart-item__image" onclick="Cart.close()">
          <img src="${item.image}" alt="${item.product_title}" loading="lazy">
        </a>
        <div class="cart-item__info">
          <span class="cart-item__vendor">${item.vendor}</span>
          <a href="${item.url}" class="cart-item__title" onclick="Cart.close()">${item.product_title}</a>
          ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
          <div class="cart-item__bottom">
            <div class="qty-control">
              <button class="qty-btn" onclick="Cart.change('${item.key}', ${item.quantity - 1})">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="Cart.change('${item.key}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item__price">
              ${this.formatMoney(item.final_line_price)}
              ${item.original_line_price > item.final_line_price ? `<del>${this.formatMoney(item.original_line_price)}</del>` : ''}
            </div>
          </div>
        </div>
        <button class="cart-item__remove" onclick="Cart.change('${item.key}', 0)" aria-label="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`).join('');
  },

  async add(variantId, qty = 1, btn) {
    if (btn) { btn.disabled = true; btn.textContent = 'Agregando...'; }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: qty })
      });
      if (!res.ok) throw new Error('Error al agregar');
      if (btn) { btn.textContent = '¡Agregado! ✓'; btn.classList.add('added'); setTimeout(() => { btn.disabled = false; btn.textContent = btn.getAttribute('data-text') || 'Agregar al carrito'; btn.classList.remove('added'); }, 2000); }
      this.open();
    } catch (e) {
      alert('No se pudo agregar el producto. Intenta de nuevo.');
      if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-text') || 'Agregar al carrito'; }
    }
  },

  async change(key, qty) {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    });
    this.refresh();
  }
};

// Expose globally
window.Cart = Cart;

// Bind open/close
document.getElementById('cart-toggle')?.addEventListener('click', () => Cart.open());
document.getElementById('cart-overlay')?.addEventListener('click', () => Cart.close());
document.getElementById('cart-close')?.addEventListener('click', () => Cart.close());

// Init count on load
Cart.refresh();

/* ─── Add to cart buttons ────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-add-to-cart]');
  if (!btn) return;
  e.preventDefault();
  const variantId = btn.getAttribute('data-variant-id') || document.getElementById('variant-id')?.value;
  if (variantId) Cart.add(variantId, 1, btn);
});

/* ─── Quick add on product cards ─────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-quick-add]');
  if (!btn) return;
  e.preventDefault();
  const vid = btn.getAttribute('data-quick-add');
  Cart.add(vid, 1, btn);
});

/* ─── Wishlist toggle ────────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-wishlist]');
  if (!btn) return;
  btn.classList.toggle('active');
});

/* ─── Variant selector on PDP ────────────────────────────── */
(function () {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.querySelectorAll('.variant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.variant-buttons');
      group.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update label
      const label = btn.closest('.variant-option')?.querySelector('.variant-selected-value');
      if (label) label.textContent = btn.textContent.trim();

      // Find matching variant
      updateSelectedVariant();
    });
  });

  function updateSelectedVariant() {
    const selected = {};
    form.querySelectorAll('.variant-option').forEach(opt => {
      const name = opt.getAttribute('data-option-name');
      const active = opt.querySelector('.variant-btn.active');
      if (name && active) selected[name] = active.textContent.trim();
    });

    const variants = JSON.parse(document.getElementById('product-variants-json')?.textContent || '[]');
    const match = variants.find(v =>
      v.options.every((val, i) => {
        const key = `option${i + 1}`;
        return Object.values(selected)[i] === val;
      })
    );

    if (match) {
      document.getElementById('variant-id').value = match.id;
      const priceEl = document.getElementById('product-price');
      const compareEl = document.getElementById('product-compare-price');
      if (priceEl) priceEl.textContent = Cart.formatMoney(match.price);
      if (compareEl) {
        if (match.compare_at_price > match.price) {
          compareEl.textContent = Cart.formatMoney(match.compare_at_price);
          compareEl.style.display = '';
        } else {
          compareEl.style.display = 'none';
        }
      }

      const addBtn = document.getElementById('add-to-cart-btn');
      if (addBtn) {
        if (match.available) {
          addBtn.disabled = false;
          addBtn.textContent = 'Agregar al carrito';
        } else {
          addBtn.disabled = true;
          addBtn.textContent = 'Producto agotado';
        }
      }
    }
  }
})();

/* ─── Product gallery thumbnails ─────────────────────────── */
(function () {
  const thumbs = document.querySelectorAll('.product-gallery__thumb');
  const main   = document.getElementById('gallery-main-img');
  if (!thumbs.length || !main) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.querySelector('img')?.src;
      if (src) { main.style.opacity = '0'; setTimeout(() => { main.src = src; main.style.opacity = '1'; }, 200); }
    });
  });
})();

/* ─── Accordion (product description) ───────────────────── */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const content = trigger.nextElementSibling;
    const open = content.classList.toggle('open');
    trigger.classList.toggle('open', open);
  });
});

/* ─── Brand filter pills ─────────────────────────────────── */
document.querySelectorAll('.brand-pill[data-vendor]').forEach(pill => {
  pill.addEventListener('click', () => {
    const vendor = pill.getAttribute('data-vendor');
    const url = new URL(window.location.href);
    if (vendor === '') {
      url.searchParams.delete('filter.p.vendor');
    } else {
      url.searchParams.set('filter.p.vendor', vendor);
    }
    window.location.href = url.toString();
  });
});

/* ─── Smooth image transition ────────────────────────────── */
document.querySelectorAll('.product-card__image').forEach(img => {
  img.style.transition = 'opacity .35s';
});
