'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES, WHATSAPP_NUMBER, fmt } from '@/lib/shop-data';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import AdminLoginModal from '@/components/AdminLoginModal';
import AdminPanel from '@/components/AdminPanel';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Heart,
  ShoppingBag,
  Home,
  Grid,
  KeyRound,
  Sparkles,
  PhoneCall,
  Trash2,
  Minus,
  Plus,
  Copy,
  CheckCircle2,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  Percent,
  Flame,
  Award,
  Layers,
  User,
} from 'lucide-react';

const EMPTY_CART_MSG = 'Your shopping bag is empty. Explore our pieces.';

const ADVERTS = [
  {
    id: 'sale',
    badge: 'Limited Sale',
    badgeIcon: Percent,
    title: 'Up to 35% Off Caftans',
    desc: 'Signature ready-to-wear tailored silhouettes.',
    img: '/products/476034.jpg',
    metricLabel: 'Special Deal',
    metricValue: 'From ₦18,000',
  },
  {
    id: 'new',
    badge: '2026 Collection',
    badgeIcon: Sparkles,
    title: 'Royal Brocade & Agbada',
    desc: 'Gold embroidery on traditional Guinea brocade.',
    img: '/products/476031.jpg',
    metricLabel: 'Status',
    metricValue: 'New in Studio',
  },
  {
    id: 'promo',
    badge: 'Wedding Entourage',
    badgeIcon: Award,
    title: 'Bespoke Groom & Aṣọ-ẹbí',
    desc: 'Coordinated wedding packages & custom fittings.',
    img: '/products/476085.jpg',
    metricLabel: 'Orders',
    metricValue: 'By Consultation',
  },
  {
    id: 'accessories',
    badge: 'Artisan Essentials',
    badgeIcon: Tag,
    title: 'Leather Shoes & Scent Oils',
    desc: 'Hand-finished footwear & alcohol-free extraits.',
    img: '/products/476058.jpg',
    metricLabel: 'Prices',
    metricValue: 'From ₦8,000',
  },
];

function getImgSrc(p) {
  return p?.cloudinaryUrl || p?.img || '/products/476025.jpg';
}

export default function ShopClient() {
  /* ---------- products state ---------- */
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.products && d.products.length > 0) {
          setProducts(d.products);
        } else {
          fetch('/api/seed')
            .then((r) => r.json())
            .then(() => fetch('/api/products').then((r) => r.json()))
            .then((d2) => setProducts(d2.products || []))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  /* ---------- auto-scrolling adverts banner state ---------- */
  const [adverts, setAdverts] = useState(ADVERTS);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch('/api/adverts')
      .then((r) => r.json())
      .then((d) => {
        if (d.adverts && d.adverts.length > 0) {
          setAdverts(d.adverts);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isPaused || adverts.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % adverts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, adverts.length]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? ADVERTS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % ADVERTS.length);
  };

  /* ---------- filters & search ---------- */
  const [activeCat, setActiveCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('featured');
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  /* ---------- wishlist ---------- */
  const [wishlist, setWishlist] = useState(() => new Set());
  const toggleWish = (id, name) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Removed from saved pieces`);
      } else {
        next.add(id);
        showToast(`Saved to wishlist`);
      }
      return next;
    });
  };

  /* ---------- cart ---------- */
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product, qty = 1, selectedSize = null) => {
    const key = selectedSize ? `${product.id}__${selectedSize}` : product.id;
    setCart((prev) => ({
      ...prev,
      [key]: {
        productId: product.id,
        qty: (prev[key]?.qty || 0) + qty,
        size: selectedSize || (product.sizes?.[0] || null),
      },
    }));
    showToast(`Added to bag`);
  };

  const setItemQty = (cartKey, qty) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[cartKey];
      } else {
        next[cartKey] = { ...next[cartKey], qty };
      }
      return next;
    });
  };

  const removeFromCart = (cartKey) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[cartKey];
      return next;
    });
  };

  const cartEntries = useMemo(() => {
    return Object.entries(cart)
      .map(([cartKey, item]) => {
        const prod = products.find((p) => p.id === item.productId);
        if (!prod) return null;
        return {
          cartKey,
          product: prod,
          qty: item.qty,
          size: item.size,
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartSubtotal = useMemo(() => {
    return cartEntries.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.qty,
      0
    );
  }, [cartEntries]);

  const cartCount = useMemo(() => {
    return cartEntries.reduce((a, b) => a + b.qty, 0);
  }, [cartEntries]);

  /* ---------- filtered products ---------- */
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCat = activeCat === 'all' || p.cat === activeCat;
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.mat && p.mat.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.tag && p.tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesWishlist = !onlyWishlist || wishlist.has(p.id);
      return matchesCat && matchesSearch && matchesWishlist;
    });

    if (sortMode === 'price-asc') {
      list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    } else if (sortMode === 'price-desc') {
      list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    } else if (sortMode === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'featured') {
      list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [products, activeCat, searchTerm, sortMode, onlyWishlist, wishlist]);

  /* ---------- WhatsApp order message ---------- */
  const orderMessage = useMemo(() => {
    if (!cartEntries.length) return '';
    let msg = `✨ *BMY COLLECTION & KAFTAN — ORDER INQUIRY* ✨\n\n`;
    msg += `Hello BMY Atelier, I would like to place an order for the following items:\n\n`;
    cartEntries.forEach((item, index) => {
      const sizeStr = item.size ? ` (Size: ${item.size})` : '';
      msg += `${index + 1}. *${item.product.name}*${sizeStr}\n`;
      msg += `   Quantity: ${item.qty} | Price: ${fmt(item.product.price)}\n\n`;
    });
    msg += `---------------------------------\n`;
    msg += `*Estimated Subtotal:* ${fmt(cartSubtotal)}\n`;
    msg += `---------------------------------\n\n`;
    msg += `Please confirm stock availability and delivery guidance. Thank you!`;
    return msg;
  }, [cartEntries, cartSubtotal]);

  const waHref = cartEntries.length
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`
    : '#';

  const copyOrder = async () => {
    if (!cartEntries.length) {
      showToast('Your bag is empty');
      return;
    }
    try {
      await navigator.clipboard.writeText(orderMessage);
      showToast('Order summary copied to clipboard');
    } catch {
      showToast('Please copy summary manually');
    }
  };

  /* ---------- active product details modal ---------- */
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ---------- toast state ---------- */
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3000);
  };

  /* ---------- admin auth state ---------- */
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.isAdmin) setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowLogin(false);
    setAdminPanelOpen(true);
    showToast('Welcome, Atelier Admin');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAdmin(false);
    setAdminPanelOpen(false);
    showToast('Signed out of admin console');
  };

  const currentAdv = (adverts && adverts.length > 0)
    ? adverts[activeSlide % adverts.length]
    : ADVERTS[0];
  const BadgeIcon = typeof currentAdv.badgeIcon === 'function' ? currentAdv.badgeIcon : Sparkles;

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#111111] font-body relative pb-32 selection:bg-[#FFCB74] selection:text-[#111111]">
      {/* ─────────────────────────────────────────────────────────
          1. TOP HEADER (#FFFFFF surface with #E5E5E5 border)
          ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E5E5] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Brand Avatar & Greeting */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#F6F6F6] flex items-center justify-center p-1">
              <img
                src="/assets/logo.png"
                alt="BMY Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#6F6F6F] block leading-tight">
                Atelier Catalog
              </span>
              <h3 className="font-heading text-base font-bold text-[#111111] leading-tight tracking-tight">
                BMY Collection &amp; Kaftan
              </h3>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {/* Wishlist Bell */}
            <button
              onClick={() => {
                setOnlyWishlist(!onlyWishlist);
                showToast(
                  !onlyWishlist
                    ? `Showing ${wishlist.size} saved pieces`
                    : 'Showing full collection'
                );
              }}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                onlyWishlist
                  ? 'bg-[#FFCB74] text-[#111111] border-[#FFCB74] shadow-sm font-bold'
                  : 'bg-[#FFFFFF] border-[#E5E5E5] text-[#2F2F2F] hover:bg-[#F6F6F6] hover:text-[#111111]'
              }`}
              title="Saved Items"
              aria-label="Wishlist Filter"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Link back to Main Site */}
            <Link
              href="/"
              className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-[11px] font-mono uppercase tracking-wider bg-[#F6F6F6] hover:bg-[#EEEEEE] text-[#2F2F2F] border border-[#E5E5E5] transition-colors font-medium"
            >
              Showcase
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────
          2. MAIN FEED
          ───────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-5 space-y-6">
        {/* ─────────────────── SEARCH & FILTER BAR ─────────────────── */}
        <div className="relative flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6F6F6F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by silhouette, weave, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-11 pr-10 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-xs sm:text-sm font-body text-[#111111] placeholder:text-[#6F6F6F] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] shadow-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F6F6F] hover:text-[#111111]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm transition-all ${
              showSortMenu
                ? 'bg-[#111111] text-[#FFCB74] border-[#111111]'
                : 'bg-[#FFCB74] border-[#FFCB74] text-[#111111] hover:bg-[#E6B35C]'
            }`}
            aria-label="Filter Options"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Sort Menu Dropdown */}
        {showSortMenu && (
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-lg space-y-3 animate-scale-in">
            <div className="flex items-center justify-between text-xs font-mono text-[#6F6F6F]">
              <span className="font-bold uppercase tracking-wider text-[#111111]">Sort Catalog</span>
              <button
                onClick={() => setShowSortMenu(false)}
                className="text-[#6F6F6F] hover:text-[#111111]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'featured', label: 'Featured Curations' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
                { id: 'name-asc', label: 'Name: A to Z' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSortMode(s.id);
                    setShowSortMenu(false);
                  }}
                  className={`p-2.5 rounded-xl border text-[11px] font-mono text-center transition-all ${
                    sortMode === s.id
                      ? 'bg-[#111111] text-[#FFCB74] border-[#111111] font-bold'
                      : 'bg-[#F6F6F6] border-[#E5E5E5] text-[#2F2F2F] hover:bg-[#EEEEEE]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────
            AUTO-SCROLLING ATELIER ADVERT BANNER (LOW PROFILE / COMPACT)
            Automatic seamless cycle every 4s, no arrow/number clutter
            ───────────────────────────────────────────────────────── */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full rounded-2xl bg-[#111111] text-[#FFFFFF] border border-[#2F2F2F] p-3.5 sm:p-4 overflow-hidden shadow-md flex items-center justify-between gap-3 transition-all"
        >
          {/* Left Copy */}
          <div className="max-w-[70%] sm:max-w-[72%] space-y-1.5 text-left z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2F2F2F] border border-white/10 text-[9px] font-mono text-[#FFCB74] uppercase tracking-wider">
                <BadgeIcon className="w-2.5 h-2.5" />
                <span>{currentAdv.badge}</span>
              </div>
              <span className="text-[10px] font-mono text-[#FFCB74] font-semibold bg-[#2F2F2F]/80 px-2 py-0.5 rounded border border-white/5">
                {currentAdv.metricValue}
              </span>
            </div>

            <h2 className="font-heading text-sm sm:text-base font-bold leading-snug text-[#FFFFFF] truncate">
              {currentAdv.title}
            </h2>

            <p className="text-[10px] sm:text-xs text-[#A0A0A0] font-body leading-tight truncate">
              {currentAdv.desc}
            </p>

            {/* Subtle Progress Dots */}
            <div className="flex items-center gap-1 pt-1">
              {adverts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeSlide === idx
                      ? 'w-4 bg-[#FFCB74]'
                      : 'w-1 bg-[#6F6F6F]/60 hover:bg-[#A0A0A0]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Media Preview */}
          <div className="relative w-20 sm:w-24 h-20 sm:h-24 shrink-0 z-10">
            <div className="w-full h-full rounded-xl overflow-hidden border border-[#2F2F2F] bg-[#1a1a1a] shadow">
              <img
                src={currentAdv.img}
                alt={currentAdv.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* ─────────────────── CATEGORIES ROW ─────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#111111]">
              Garment Categories
            </h3>
            <button
              onClick={() => setActiveCat('all')}
              className="text-xs font-mono text-[#111111] hover:text-[#FFCB74] font-semibold transition-colors"
            >
              View All ({products.length})
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((c) => {
              const isActive = activeCat === c.cat;
              return (
                <button
                  key={c.cat}
                  onClick={() => setActiveCat(c.cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-medium tracking-wide transition-all whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-[#111111] text-[#FFCB74] border-[#111111] shadow-sm font-bold'
                      : 'bg-[#FFFFFF] border-[#E5E5E5] text-[#2F2F2F] hover:bg-[#F6F6F6] hover:border-[#111111]'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────── POPULAR PRODUCTS SECTION ─────────────────── */}
        <div id="products-section" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg font-bold text-[#111111]">
                Wardrobe Pieces
              </h3>
              <span className="text-xs font-mono text-[#6F6F6F]">
                ({filtered.length})
              </span>
            </div>
            <button
              onClick={() => {
                setActiveCat('all');
                setSearchTerm('');
                setOnlyWishlist(false);
              }}
              className="text-xs font-mono text-[#6F6F6F] hover:text-[#111111] transition-colors"
            >
              Reset Filter
            </button>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#FFFFFF] p-3 space-y-3 border border-[#E5E5E5] shadow-sm animate-pulse"
                >
                  <div className="aspect-[4/5] bg-[#F6F6F6] rounded-xl" />
                  <div className="h-4 bg-[#F6F6F6] rounded w-3/4" />
                  <div className="h-3 bg-[#F6F6F6] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5] p-6 space-y-3 shadow-sm">
              <Search className="w-8 h-8 text-[#A0A0A0] mx-auto" />
              <h4 className="font-heading text-lg text-[#111111] font-bold">
                No matching pieces found
              </h4>
              <p className="text-xs font-body text-[#6F6F6F]">
                Try adjusting your search keywords or active category.
              </p>
              <button
                onClick={() => {
                  setActiveCat('all');
                  setSearchTerm('');
                  setOnlyWishlist(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#111111] text-[#FFFFFF] text-xs font-mono uppercase font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
              {filtered.map((p) => {
                const isWish = wishlist.has(p.id);
                return (
                  <article
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] p-2.5 sm:p-3 hover:border-[#111111] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
                  >
                    {/* Media Container */}
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F6F6F6] border border-[#EEEEEE]">
                      <img
                        src={getImgSrc(p)}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/products/476025.jpg';
                        }}
                      />

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWish(p.id, p.name);
                        }}
                        className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isWish
                            ? 'bg-[#FFCB74] text-[#111111] shadow'
                            : 'bg-white/80 backdrop-blur-sm text-[#6F6F6F] hover:text-[#111111]'
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isWish ? 'fill-[#111111]' : ''}`}
                        />
                      </button>

                      {p.tag && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#111111]/80 backdrop-blur-sm text-[#FFCB74] text-[9px] font-mono uppercase tracking-wider font-semibold">
                          {p.tag}
                        </span>
                      )}
                    </div>

                    {/* Card Meta */}
                    <div className="pt-2.5 pb-1 px-1 space-y-1 text-left">
                      <h4 className="font-heading text-sm font-semibold text-[#111111] group-hover:text-[#2F2F2F] transition-colors truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs sm:text-sm font-bold text-[#111111]">
                          {fmt(p.price)}
                        </span>
                        {p.price === null && (
                          <span className="text-[9px] font-mono uppercase bg-[#F6F6F6] border border-[#E5E5E5] text-[#111111] px-1.5 py-0.5 rounded font-bold">
                            Bespoke
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────
          3. FLOATING BOTTOM DOCK (#111111 dark dock with #FFCB74 accents)
          ───────────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-5 inset-x-4 max-w-sm sm:max-w-md mx-auto z-40 bg-[#111111] text-[#FFFFFF] rounded-2xl p-1.5 shadow-2xl border border-[#2F2F2F] flex items-center justify-between"
        aria-label="Bottom Navigation"
      >
        {/* 1. Home Button */}
        <button
          onClick={() => {
            setActiveCat('all');
            setOnlyWishlist(false);
            setSearchTerm('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1.5 bg-[#FFCB74] text-[#111111] px-4 py-2 rounded-xl font-heading text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* 2. Catalog */}
        <button
          onClick={() => {
            const el = document.getElementById('products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#2F2F2F] transition-colors"
          title="Catalog"
        >
          <Grid className="w-5 h-5" />
        </button>

        {/* 3. Wishlist */}
        <button
          onClick={() => {
            setOnlyWishlist(!onlyWishlist);
            showToast(
              !onlyWishlist
                ? `Showing ${wishlist.size} saved pieces`
                : 'Showing full collection'
            );
          }}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#2F2F2F] transition-colors"
          title="Wishlist"
        >
          <Heart className={`w-5 h-5 ${onlyWishlist ? 'fill-[#FFCB74] text-[#FFCB74]' : ''}`} />
          {wishlist.size > 0 && (
            <span className="absolute top-1 right-1 bg-[#FFCB74] text-[#111111] text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
              {wishlist.size}
            </span>
          )}
        </button>

        {/* 4. Shopping Bag */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#2F2F2F] transition-colors"
          title="Shopping Bag"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 bg-[#FFCB74] text-[#111111] text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
              {cartCount}
            </span>
          )}
        </button>

        {/* 5. Admin Portal */}
        <Link
          href="/admin"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#A0A0A0] hover:text-[#FFCB74] hover:bg-[#2F2F2F] transition-colors"
          title="Atelier Admin Portal"
          aria-label="Admin Portal"
        >
          <User className="w-5 h-5" />
        </Link>
      </nav>

      {/* ─────────────────────────────────────────────────────────
          4. DETAILS MODAL
          ───────────────────────────────────────────────────────── */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isWishlisted={wishlist.has(selectedProduct.id)}
          onToggleWishlist={toggleWish}
          onAddToCart={addToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* ─────────────────────────────────────────────────────────
          5. SHOPPING BAG DRAWER
          ───────────────────────────────────────────────────────── */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-[#FFFFFF] text-[#111111] p-0 flex flex-col h-full border-l border-[#E5E5E5]">
          {/* Header */}
          <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F6F6F6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#FFCB74] flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <SheetTitle className="text-xl font-heading font-bold text-[#111111]">
                  Atelier Bag
                </SheetTitle>
                <SheetDescription className="text-xs font-mono text-[#6F6F6F]">
                  {cartCount} item{cartCount !== 1 ? 's' : ''} selected
                </SheetDescription>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FFFFFF]">
            {cartEntries.length === 0 ? (
              <div className="text-center py-16 space-y-4 text-[#A0A0A0]">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#E5E5E5]" />
                <p className="text-xs font-mono">{EMPTY_CART_MSG}</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#111111] text-[#FFFFFF] text-xs font-heading uppercase font-bold"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartEntries.map(({ cartKey, product, qty, size }) => (
                <div
                  key={cartKey}
                  className="p-3.5 rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] flex items-center gap-3.5 group shadow-sm"
                >
                  <div className="w-16 h-20 rounded-lg bg-[#FFFFFF] overflow-hidden shrink-0 border border-[#E5E5E5]">
                    <img
                      src={getImgSrc(product)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/products/476025.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm font-heading font-semibold text-[#111111] truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#6F6F6F]">
                      <span className="font-bold text-[#111111]">
                        {fmt(product.price)}
                      </span>
                      {size && (
                        <span className="px-1.5 py-0.2 rounded border border-[#E5E5E5] text-[10px] text-[#2F2F2F] bg-[#FFFFFF]">
                          {size}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-[#E5E5E5] rounded-lg bg-[#FFFFFF] px-2 py-0.5 gap-2">
                        <button
                          onClick={() => setItemQty(cartKey, qty - 1)}
                          className="text-[#6F6F6F] hover:text-[#111111]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold w-4 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => setItemQty(cartKey, qty + 1)}
                          className="text-[#6F6F6F] hover:text-[#111111]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(cartKey)}
                        className="text-[#A0A0A0] hover:text-red-500 p-1 transition-colors ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cartEntries.length > 0 && (
            <div className="p-6 border-t border-[#E5E5E5] bg-[#F6F6F6] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-heading uppercase tracking-widest text-[#6F6F6F] text-xs font-bold">
                  Estimated Subtotal
                </span>
                <span className="font-mono text-lg text-[#111111] font-bold">
                  {fmt(cartSubtotal)}
                </span>
              </div>

              <div className="space-y-2">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#FFCB74] hover:bg-[#E6B35C] text-[#111111] font-heading text-xs uppercase tracking-widest font-bold shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4" /> Checkout via WhatsApp
                </a>

                <button
                  onClick={copyOrder}
                  className="w-full py-3 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#EEEEEE] text-[#2F2F2F] text-xs font-mono uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Order Summary
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ─────────────────────────────────────────────────────────
          6. ADMIN LOGIN & PANEL
          ───────────────────────────────────────────────────────── */}
      {showLogin && (
        <AdminLoginModal
          open={showLogin}
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}

      {adminPanelOpen && (
        <AdminPanel
          open={adminPanelOpen}
          products={products}
          onClose={() => setAdminPanelOpen(false)}
          onProductsChange={setProducts}
          onLogout={handleLogout}
        />
      )}

      {/* ─────────────────────────────────────────────────────────
          7. TOAST NOTIFICATION
          ───────────────────────────────────────────────────────── */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div className="py-2.5 px-5 rounded-xl bg-[#111111] text-[#FFFFFF] text-xs font-mono uppercase tracking-wider font-bold shadow-2xl flex items-center gap-2 border border-[#2F2F2F]">
            <CheckCircle2 className="w-4 h-4 text-[#FFCB74]" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
