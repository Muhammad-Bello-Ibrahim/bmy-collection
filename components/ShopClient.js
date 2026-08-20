'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES, WHATSAPP_NUMBER, fmt } from '@/lib/shop-data';

const EMPTY_CART_MSG = 'Your bag is empty. Browse the collection to add pieces.';

export default function ShopClient() {
  const [activeCat, setActiveCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('default');
  const [wishlist, setWishlist] = useState(() => new Set());
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  /* ---------- derived data ---------- */
  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (activeCat === 'all' || p.cat === activeCat) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortMode === 'price-asc') list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sortMode === 'price-desc') list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sortMode === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCat, searchTerm, sortMode]);

  const cartEntries = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty })),
    [cart]
  );
  const cartSubtotal = cartEntries.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
  const cartCount = cartEntries.reduce((a, b) => a + b.qty, 0);

  const orderMessage = useMemo(() => {
    if (!cartEntries.length) return '';
    let msg = "Hello BMY Collection, I'd like to order:\n";
    cartEntries.forEach((item) => {
      msg += `- ${item.name} x${item.qty} — ${fmt(item.price)}\n`;
    });
    msg += `Subtotal: ${fmt(cartSubtotal)}`;
    return msg;
  }, [cartEntries, cartSubtotal]);

  const waHref = cartEntries.length ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}` : '#';

  /* ---------- actions ---------- */
  const toggleWish = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addToCart = (id, qty) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + qty }));
  const setQty = (id, qty) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };
  const removeFromCart = (id) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const copyOrder = async () => {
    if (!cartEntries.length) { showToast('Your bag is empty'); return; }
    try {
      await navigator.clipboard.writeText(orderMessage);
      showToast('Order summary copied');
    } catch {
      showToast('Could not copy — select the text manually');
    }
  };

  const modalProduct = modalId ? PRODUCTS.find((p) => p.id === modalId) : null;

  return (
    <>
      <SiteNav cartCount={cartCount} onWishInfo={() => showToast('Wishlist is saved per session')} onOpenCart={() => setCartOpen(true)} />

      <section className="shop-hero">
        <div className="wrap reveal in">
          <p className="eyebrow">Shop the Atelier</p>
          <h1>The full <em>wardrobe.</em></h1>
          <p>Bespoke and ready-to-wear, fabric to fragrance — browse the complete BMY Collection catalogue. Ready-to-wear and accessories ship as shown; bespoke pieces begin with an enquiry.</p>
        </div>
      </section>

      <div className="toolbar">
        <div className="wrap toolbar-inner">
          <div className="chip-row" id="chipRow">
            {CATEGORIES.map((c) => (
              <button
                key={c.cat}
                className={activeCat === c.cat ? 'chip active' : 'chip'}
                onClick={() => setActiveCat(c.cat)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="toolbar-right">
            <div className="search-box">
              <svg><use href="#ic-search" /></svg>
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="sort-select"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>
        </div>
      </div>

      <section className="shop-section">
        <div className="wrap">
          <p className="result-count">{filtered.length} piece{filtered.length !== 1 ? 's' : ''}</p>
          <div className="product-grid" id="productGrid">
            {filtered.map((p) => (
              <article className="product-card" key={p.id}>
                <div className="p-media" data-open={p.id} onClick={() => setModalId(p.id)}>
                  <span className="p-tag">{p.tag}</span>
                  <button
                    className={wishlist.has(p.id) ? 'p-wish active' : 'p-wish'}
                    aria-label="Toggle wishlist"
                    onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
                  >
                    <svg><use href="#ic-heart" /></svg>
                  </button>
                  <div className="pf-content"><img className="pf-img" src={p.img} alt={p.name} loading="lazy" /></div>
                  <span className="p-quick">Quick View</span>
                </div>
                <div className="p-body">
                  <h3 className="p-name" onClick={() => setModalId(p.id)}>{p.name}</h3>
                  <p className="p-mat">{p.mat}</p>
                  <div className="p-price-row">
                    <span className={p.price == null ? 'p-price poa' : 'p-price'}>{fmt(p.price)}</span>
                  </div>
                  {p.price == null ? (
                    <Link href="/#contact" className="btn btn-line btn-full">Enquire</Link>
                  ) : (
                    <button className="btn btn-solid btn-full" onClick={() => { addToCart(p.id, 1); showToast('Added to bag'); }}>
                      Add to Bag
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="shop-cta reveal">
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Can&apos;t find it here</p>
          <h2>Every piece can be made bespoke.</h2>
          <p>If you don&apos;t see your size, colourway or fabric — the atelier can cut it for you from scratch.</p>
          <Link href="/#contact" className="btn btn-line">Start a Bespoke Enquiry</Link>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p>© {new Date().getFullYear()} BMY Collection · Sample pricing shown for template purposes</p>
          <Link href="/">Back to main site →</Link>
        </div>
      </footer>

      <div className={cartOpen ? 'overlay show' : 'overlay'} onClick={() => setCartOpen(false)} />

      <aside className={cartOpen ? 'cart-drawer open' : 'cart-drawer'} aria-label="Shopping cart">
        <div className="cart-head">
          <h3>Your Bag</h3>
          <button className="cart-close" aria-label="Close cart" onClick={() => setCartOpen(false)}>
            <svg><use href="#ic-close" /></svg>
          </button>
        </div>
        <div className="cart-body" id="cartBody">
          {cartEntries.length === 0 ? (
            <p className="cart-empty">{EMPTY_CART_MSG}</p>
          ) : (
            cartEntries.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="ci-thumb"><img className="pf-img" src={item.img} alt={item.name} /></div>
                <div className="ci-info">
                  <span className="ci-name">{item.name}</span>
                  <span className="ci-price">{fmt(item.price)}</span>
                  <div className="ci-qty">
                    <button aria-label="Decrease quantity" onClick={() => setQty(item.id, (cart[item.id] || 0) - 1)}>
                      <svg width="10" height="10"><use href="#ic-minus" /></svg>
                    </button>
                    <span>{item.qty}</span>
                    <button aria-label="Increase quantity" onClick={() => setQty(item.id, (cart[item.id] || 0) + 1)}>
                      <svg width="10" height="10"><use href="#ic-plus" /></svg>
                    </button>
                  </div>
                </div>
                <button className="ci-remove" aria-label="Remove item" onClick={() => removeFromCart(item.id)}>
                  <svg><use href="#ic-trash" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-foot">
          <div className="cart-sub-row"><span>Subtotal</span><span>{fmt(cartSubtotal)}</span></div>
          <a href={waHref} className="btn btn-solid btn-full" target="_blank" rel="noopener">
            <svg width="15" height="15"><use href="#ic-whatsapp" /></svg> Checkout via WhatsApp
          </a>
          <button className="btn btn-line btn-full" style={{ marginTop: 10 }} onClick={copyOrder}>
            <svg width="14" height="14"><use href="#ic-copy" /></svg> Copy Order Summary
          </button>
          <p className="cart-note">Fabric is sold by the yard, quantity reflects number of yards. Bespoke and group orders are handled by enquiry, not checkout. Prices shown are sample placeholders — connect this to a real payment gateway or WhatsApp number to go live.</p>
        </div>
      </aside>

      <div className={modalProduct ? 'modal show' : 'modal'}>
        {modalProduct && (
          <div className="modal-card">
            <div className="modal-media">
              <button className="modal-close" aria-label="Close" onClick={() => setModalId(null)}>
                <svg><use href="#ic-close" /></svg>
              </button>
              <img className="pf-img" src={modalProduct.img} alt={modalProduct.name} />
            </div>
            <div className="modal-body">
              <span className="modal-tag">{modalProduct.tag}</span>
              <h3>{modalProduct.name}</h3>
              <p className="modal-price">{fmt(modalProduct.price)}</p>
              <p className="modal-desc">
                {modalProduct.desc}
                <br /><br />
                <em style={{ color: 'var(--ivory-50)', fontSize: '.85rem' }}>{modalProduct.mat}</em>
              </p>
              {modalProduct.price == null ? (
                <Link href="/#contact" className="btn btn-solid btn-full" onClick={() => setModalId(null)}>
                  Enquire About This Piece
                </Link>
              ) : (
                <>
                  <div className="modal-row">
                    <div className="qty-stepper">
                      <button aria-label="Decrease quantity" onClick={() => setModalQty((q) => Math.max(1, q - 1))}>
                        <svg width="11" height="11"><use href="#ic-minus" /></svg>
                      </button>
                      <span>{modalQty}</span>
                      <button aria-label="Increase quantity" onClick={() => setModalQty((q) => q + 1)}>
                        <svg width="11" height="11"><use href="#ic-plus" /></svg>
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn btn-solid btn-full"
                    onClick={() => { addToCart(modalProduct.id, modalQty); showToast('Added to bag'); setModalId(null); }}
                  >
                    Add to Bag
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={toast ? 'toast show' : 'toast'}>{toast}</div>
    </>
  );
}

function SiteNav({ cartCount, onWishInfo, onOpenCart }) {
  return (
    <header className="site-nav">
      <div className="wrap">
        <Link href="/" className="brandmark">
          <svg><use href="#ic-logo" /></svg>
          <span className="word">BMY</span>
          <span className="sub">menswear atelier</span>
        </Link>
        <nav className="nav-links">
          <span className="nav-text-links" style={{ display: 'flex', gap: 32 }}>
            <Link href="/">Home</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </span>
          <button className="icon-btn" aria-label="Wishlist" title="Wishlist is saved per session" onClick={onWishInfo}>
            <svg><use href="#ic-heart" /></svg>
          </button>
          <button className="icon-btn" aria-label="Open cart" onClick={onOpenCart}>
            <svg><use href="#ic-bag" /></svg>
            <span className="cart-count">{cartCount}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
