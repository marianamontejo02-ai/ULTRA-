/* ============================================================
   ULTRA belleza - theme.js
   ============================================================ */

/* ---- Expose Cart globally so onclick handlers work ---- */
var Cart = null;

document.addEventListener('DOMContentLoaded', function() {

  /* --- Announcement Bar --- */
  (function() {
    var msgs = document.querySelectorAll('[data-announcement]');
    var bar  = document.getElementById('announcement-bar');
    if (!msgs.length || !bar) return;
    var idx = 0;
    function show(i) {
      msgs.forEach(function(m, j) {
        m.style.display = j === i ? 'block' : 'none';
      });
    }
    show(0);
    if (msgs.length > 1) {
      setInterval(function() { idx = (idx + 1) % msgs.length; show(idx); }, 4000);
    }
    var closeBtn = document.getElementById('announcement-close');
    if (closeBtn) closeBtn.addEventListener('click', function() { bar.style.display = 'none'; });
  })();

  /* --- Header scroll shadow --- */
  (function() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  })();

  /* --- Mobile menu --- */
  (function() {
    var toggle  = document.getElementById('menu-toggle');
    var menu    = document.getElementById('mobile-menu');
    var overlay = document.getElementById('mobile-overlay');
    var closeBtn= document.getElementById('mobile-menu-close');
    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-accordion-header').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var list = btn.nextElementSibling;
        if (!list) return;
        var isOpen = list.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });
    });
  })();

  /* --- Cart Drawer --- */
  var SHIPPING_THRESHOLD = 150000;

  Cart = {
    overlay:   document.getElementById('cart-overlay'),
    drawer:    document.getElementById('cart-drawer'),
    countEls:  document.querySelectorAll('.cart-count'),
    bodyEl:    document.getElementById('cart-body'),
    subtotalEl:document.getElementById('cart-subtotal'),
    progressEl:document.getElementById('shipping-progress'),
    msgEl:     document.getElementById('shipping-msg'),

    open: function() {
      if (this.overlay) this.overlay.classList.add('open');
      if (this.drawer)  this.drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.refresh();
    },
    close: function() {
      if (this.overlay) this.overlay.classList.remove('open');
      if (this.drawer)  this.drawer.classList.remove('open');
      document.body.style.overflow = '';
    },
    updateCount: function(n) {
      this.countEls.forEach(function(el) {
        el.textContent = n > 99 ? '99+' : n;
        el.style.display = n > 0 ? '' : 'none';
      });
    },
    formatMoney: function(cents) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cents / 100);
    },
    updateShipping: function(subtotalCents) {
      var sub = subtotalCents / 100;
      var pct = Math.min((sub / SHIPPING_THRESHOLD) * 100, 100);
      if (this.progressEl) this.progressEl.style.width = pct + '%';
      if (this.msgEl) {
        if (pct >= 100) {
          this.msgEl.innerHTML = '<span class="shipping-free-msg">Envio gratis!</span>';
        } else {
          var left = SHIPPING_THRESHOLD - sub;
          this.msgEl.innerHTML = 'Te faltan <strong>' + this.formatMoney(left * 100) + '</strong> para envio gratis';
        }
      }
    },
    refresh: function() {
      var self = this;
      fetch('/cart.js')
        .then(function(r) { return r.json(); })
        .then(function(cart) {
          self.updateCount(cart.item_count);
          self.updateShipping(cart.total_price);
          if (self.subtotalEl) self.subtotalEl.textContent = self.formatMoney(cart.total_price);
          self.renderItems(cart);
        })
        .catch(function(e) { console.warn('Cart refresh error', e); });
    },
    renderItems: function(cart) {
      if (!this.bodyEl) return;
      var self = this;
      if (!cart.items || !cart.items.length) {
        this.bodyEl.innerHTML = '<div class="cart-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><h3>Tu carrito esta vacio</h3><p>Agrega productos y vuelve aqui</p><button onclick="Cart.close()" class="btn btn-primary">Ver productos</button></div>';
        return;
      }
      this.bodyEl.innerHTML = cart.items.map(function(item) {
        return '<div class="cart-item" data-key="' + item.key + '">' +
          '<a href="' + item.url + '" class="cart-item__image" onclick="Cart.close()">' +
          (item.image ? '<img src="' + item.image + '" alt="' + item.product_title + '" loading="lazy">' : '') +
          '</a>' +
          '<div class="cart-item__info">' +
          '<span class="cart-item__vendor">' + (item.vendor || '') + '</span>' +
          '<a href="' + item.url + '" class="cart-item__title" onclick="Cart.close()">' + item.product_title + '</a>' +
          (item.variant_title && item.variant_title !== 'Default Title' ? '<p class="cart-item__variant">' + item.variant_title + '</p>' : '') +
          '<div class="cart-item__bottom">' +
          '<div class="qty-control">' +
          '<button class="qty-btn" onclick="Cart.change(\'' + item.key + '\',' + (item.quantity - 1) + ')">-</button>' +
          '<span class="qty-value">' + item.quantity + '</span>' +
          '<button class="qty-btn" onclick="Cart.change(\'' + item.key + '\',' + (item.quantity + 1) + ')">+</button>' +
          '</div>' +
          '<div class="cart-item__price">' + self.formatMoney(item.final_line_price) + '</div>' +
          '</div></div>' +
          '<button class="cart-item__remove" onclick="Cart.change(\'' + item.key + '\',0)" aria-label="Eliminar">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button></div>';
      }).join('');
    },
    add: function(variantId, qty, btn) {
      var self = this;
      qty = qty || 1;
      if (btn) { btn.disabled = true; btn.textContent = 'Agregando...'; }
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(variantId), quantity: qty })
      }).then(function(r) {
        if (!r.ok) throw new Error('Error');
        if (btn) {
          btn.textContent = 'Agregado!';
          btn.classList.add('added');
          setTimeout(function() {
            btn.disabled = false;
            btn.textContent = btn.getAttribute('data-text') || 'Agregar al carrito';
            btn.classList.remove('added');
          }, 2000);
        }
        self.open();
      }).catch(function() {
        alert('No se pudo agregar. Intenta de nuevo.');
        if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-text') || 'Agregar al carrito'; }
      });
    },
    change: function(key, qty) {
      var self = this;
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: qty })
      }).then(function() { self.refresh(); }).catch(function(e) { console.warn(e); });
    }
  };

  /* Expose globally for onclick handlers */
  window.Cart = Cart;

  /* Cart open/close bindings */
  var cartToggle  = document.getElementById('cart-toggle');
  var cartOverlay = document.getElementById('cart-overlay');
  var cartClose   = document.getElementById('cart-close');
  if (cartToggle)  cartToggle.addEventListener('click',  function() { Cart.open(); });
  if (cartOverlay) cartOverlay.addEventListener('click', function() { Cart.close(); });
  if (cartClose)   cartClose.addEventListener('click',   function() { Cart.close(); });

  /* Init cart count */
  Cart.refresh();

  /* --- Add to cart buttons (delegated) --- */
  document.addEventListener('click', function(e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-add-to-cart]') : null;
    if (!btn) return;
    e.preventDefault();
    var varId = btn.getAttribute('data-variant-id') || (document.getElementById('variant-id') ? document.getElementById('variant-id').value : null);
    if (varId) Cart.add(varId, 1, btn);
  });

  /* --- Quick add on product cards --- */
  document.addEventListener('click', function(e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-quick-add]') : null;
    if (!btn) return;
    e.preventDefault();
    var vid = btn.getAttribute('data-quick-add');
    if (vid) Cart.add(vid, 1, btn);
  });

  /* --- Wishlist toggle --- */
  document.addEventListener('click', function(e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-wishlist]') : null;
    if (!btn) return;
    btn.classList.toggle('active');
  });

  /* --- Card buyers counter --- */
  document.querySelectorAll('.card-buyers-num').forEach(function(el) {
    var base = parseInt(el.textContent, 10) || 8;
    setInterval(function() {
      var delta = Math.floor(Math.random() * 3) - 1;
      base = Math.max(3, Math.min(base + delta, 35));
      el.textContent = base;
    }, Math.floor(Math.random() * 8000) + 6000);
  });

  /* --- Accordion (product description) --- */
  document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var content = trigger.nextElementSibling;
      if (!content) return;
      var isOpen = content.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
    });
  });

  /* --- Variant selector on PDP --- */
  (function() {
    var form = document.getElementById('product-form');
    if (!form) return;

    var variantsEl = document.getElementById('product-variants-json');
    var imagesEl   = document.getElementById('product-images-json');
    var variants   = variantsEl ? JSON.parse(variantsEl.textContent || '[]') : [];
    var mainImg    = document.getElementById('gallery-main-img');
    var thumbsWrap = document.getElementById('gallery-thumbs');

    form.addEventListener('click', function(e) {
      var btn = e.target && e.target.closest ? e.target.closest('.variant-btn, .swatch-btn, .size-pill') : null;
      if (!btn) return;
      var group = btn.closest('.variant-buttons, .swatch-grid, .size-pill-row');
      if (!group) return;
      group.querySelectorAll('.variant-btn, .swatch-btn, .size-pill').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var optWrap = btn.closest('.variant-option');
      if (optWrap) {
        var labelEl = optWrap.querySelector('.variant-selected-value');
        if (labelEl) labelEl.textContent = btn.getAttribute('data-value') || btn.textContent.trim();
      }
      updateSelectedVariant();
    });

    function getSelectedOptions() {
      var opts = [];
      form.querySelectorAll('.variant-option').forEach(function(opt) {
        var activeBtn = opt.querySelector('.variant-btn.active, .swatch-btn.active, .size-pill.active');
        opts.push(activeBtn ? (activeBtn.getAttribute('data-value') || activeBtn.textContent.trim()) : null);
      });
      return opts;
    }

    function updateSelectedVariant() {
      var selected = getSelectedOptions();
      var match = null;
      for (var i = 0; i < variants.length; i++) {
        var v = variants[i];
        if (v.options.every(function(val, idx) { return selected[idx] === null || selected[idx] === val; })) {
          match = v; break;
        }
      }
      if (!match) return;

      var vidEl = document.getElementById('variant-id');
      if (vidEl) vidEl.value = match.id;

      var priceEl   = document.getElementById('product-price');
      var compareEl = document.getElementById('product-compare-price');
      var discBadge = document.getElementById('product-disc-badge');
      if (priceEl) priceEl.textContent = Cart.formatMoney(match.price);
      if (compareEl) {
        if (match.compare_at_price && match.compare_at_price > match.price) {
          compareEl.textContent = Cart.formatMoney(match.compare_at_price);
          compareEl.style.display = '';
          if (discBadge) {
            var pct = Math.round((match.compare_at_price - match.price) * 100 / match.compare_at_price);
            discBadge.textContent = 'Ahorras ' + pct + '%';
            discBadge.style.display = '';
          }
        } else {
          compareEl.style.display = 'none';
          if (discBadge) discBadge.style.display = 'none';
        }
      }

      var addBtn = document.getElementById('add-to-cart-btn');
      if (addBtn) {
        addBtn.disabled = !match.available;
      }

      if (match.featured_image && match.featured_image.src && mainImg) {
        var imgSrc = match.featured_image.src;
        mainImg.style.opacity = '0';
        setTimeout(function() { mainImg.src = imgSrc; mainImg.style.opacity = '1'; }, 200);
      }
    }
  })();

  /* --- Product gallery thumbnails --- */
  (function() {
    var thumbs = document.querySelectorAll('.product-gallery__thumb');
    var main   = document.getElementById('gallery-main-img');
    if (!thumbs.length || !main) return;
    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        thumbs.forEach(function(t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        var src = thumb.getAttribute('data-src') || (thumb.querySelector('img') ? thumb.querySelector('img').src : null);
        if (src) {
          main.style.opacity = '0';
          setTimeout(function() { main.src = src; main.style.opacity = '1'; }, 200);
        }
      });
    });
  })();

  /* --- Quantity buttons on PDP --- */
  var qtyMinus = document.getElementById('qty-minus');
  var qtyPlus  = document.getElementById('qty-plus');
  var qtyInput = document.getElementById('product-qty');
  if (qtyMinus && qtyInput) {
    qtyMinus.addEventListener('click', function() {
      var v = parseInt(qtyInput.value) || 1;
      if (v > 1) qtyInput.value = v - 1;
    });
  }
  if (qtyPlus && qtyInput) {
    qtyPlus.addEventListener('click', function() {
      var v = parseInt(qtyInput.value) || 1;
      qtyInput.value = v + 1;
    });
  }

  /* --- Buy now button --- */
  var buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function() {
      var varEl = document.getElementById('variant-id');
      var qtyEl = document.getElementById('product-qty');
      if (!varEl) return;
      var varId = parseInt(varEl.value);
      var qty   = parseInt((qtyEl && qtyEl.value) || 1);
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: varId, quantity: qty })
      }).then(function() { window.location.href = '/checkout'; });
    });
  }

  /* --- PDP buyers counter --- */
  var pdpBuyersEl = document.getElementById('pdp-buyers-num');
  if (pdpBuyersEl) {
    var base = parseInt(pdpBuyersEl.textContent, 10) || 12;
    setInterval(function() {
      var delta = Math.floor(Math.random() * 3) - 1;
      base = Math.max(5, Math.min(base + delta, 40));
      pdpBuyersEl.textContent = base;
    }, 8000);
  }

  /* --- Cart drawer footer visibility --- */
  var cartFooter = document.getElementById('cart-footer');
  var cartBody   = document.getElementById('cart-body');
  if (cartFooter && cartBody) {
    var obs = new MutationObserver(function() {
      cartFooter.style.display = cartBody.querySelector('.cart-item') ? '' : 'none';
    });
    obs.observe(cartBody, { childList: true, subtree: true });
  }

}); /* end DOMContentLoaded */
