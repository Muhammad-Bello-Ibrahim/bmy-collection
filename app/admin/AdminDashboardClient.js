'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { fmt, WHATSAPP_NUMBER, CATEGORIES } from '@/lib/shop-data';
import {
  LayoutDashboard,
  Package,
  Megaphone,
  MessageSquare,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Image as ImageIcon,
  KeyRound,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
  Check,
  X,
  Menu,
  SlidersHorizontal,
  ChevronRight,
  Percent,
  Award,
  Tag,
  LayoutGrid,
  List,
  Table as TableIcon,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const EMPTY_PRODUCT_FORM = {
  id: '',
  name: '',
  cat: 'rtw',
  tag: '',
  price: '',
  mat: '',
  desc: '',
  img: '',
  cloudinaryUrl: '',
  cloudinaryId: '',
  stock: 10,
  sizes: '',
  inStock: true,
  featured: false,
};

const EMPTY_ADVERT_FORM = {
  id: '',
  badge: 'Special Offer',
  title: '',
  desc: '',
  img: '/products/476031.jpg',
  cloudinaryUrl: '',
  cloudinaryId: '',
  metricLabel: 'Highlight',
  metricValue: 'Exclusive',
  active: true,
  order: 1,
};

export default function AdminDashboardClient() {
  /* ---------- Authentication State ---------- */
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login Form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin User info
  const [adminUsername, setAdminUsername] = useState('admin');

  // Credential change state
  const [credCurrentPassword, setCredCurrentPassword] = useState('');
  const [credNewUsername, setCredNewUsername] = useState('');
  const [credNewPassword, setCredNewPassword] = useState('');
  const [credConfirmPassword, setCredConfirmPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');
  const [savingCreds, setSavingCreds] = useState(false);
  const [showCredPasswords, setShowCredPasswords] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.isAdmin) {
          setIsAdmin(true);
          if (d.username) {
            setAdminUsername(d.username);
            setCredNewUsername(d.username);
          }
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials');
        return;
      }
      setIsAdmin(true);
      if (data.username) {
        setAdminUsername(data.username);
        setCredNewUsername(data.username);
      } else {
        setAdminUsername(loginUsername);
        setCredNewUsername(loginUsername);
      }
      showToast('Welcome, Atelier Admin');
    } catch {
      setLoginError('Connection error — please check network');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAdmin(false);
    showToast('Signed out of admin console');
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (!credCurrentPassword) {
      setCredError('Current password is required for security verification.');
      return;
    }

    if (!credNewUsername.trim() && !credNewPassword) {
      setCredError('Please enter a new username or a new password.');
      return;
    }

    if (credNewPassword && credNewPassword.length < 6) {
      setCredError('New password must be at least 6 characters long.');
      return;
    }

    if (credNewPassword && credNewPassword !== credConfirmPassword) {
      setCredError('New password and confirmation do not match.');
      return;
    }

    setSavingCreds(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: credCurrentPassword,
          newUsername: credNewUsername.trim() || undefined,
          newPassword: credNewPassword || undefined,
          confirmNewPassword: credConfirmPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCredError(data.error || 'Failed to update credentials');
        return;
      }

      setCredSuccess(data.message || 'Admin credentials updated successfully.');
      showToast('Admin credentials updated successfully');
      if (data.username) {
        setAdminUsername(data.username);
        setCredNewUsername(data.username);
      }
      setCredCurrentPassword('');
      setCredNewPassword('');
      setCredConfirmPassword('');
    } catch {
      setCredError('Connection error — please check network');
    } finally {
      setSavingCreds(false);
    }
  };

  /* ---------- Dashboard Navigation ---------- */
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, adverts, whatsapp, settings
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ---------- Toast Notification ---------- */
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3000);
  };

  /* ---------- Data: Products ---------- */
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [prodSearch, setProdSearch] = useState('');
  const [prodCatFilter, setProdCatFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'table'

  const fetchProducts = () => {
    setLoadingProducts(true);
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.products && d.products.length > 0) {
          setProducts(d.products);
        } else {
          fetch('/api/seed')
            .then((r) => r.json())
            .then(() => fetch('/api/products').then((r) => r.json()))
            .then((d2) => setProducts(d2.products || []));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  /* ---------- Data: Adverts ---------- */
  const [adverts, setAdverts] = useState([]);
  const [loadingAdverts, setLoadingAdverts] = useState(true);

  const fetchAdverts = () => {
    setLoadingAdverts(true);
    fetch('/api/adverts')
      .then((r) => r.json())
      .then((d) => {
        if (d.adverts) setAdverts(d.adverts);
      })
      .catch(() => {})
      .finally(() => setLoadingAdverts(false));
  };

  /* ---------- Data: Settings & Maintenance Mode ---------- */
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState(
    'We are currently refining our catalog and updating our atelier inventory. We sincerely apologize for any inconvenience. For urgent orders or bespoke commissions, please reach out directly to our concierge.'
  );
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = () => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) {
          setMaintenanceMode(!!d.settings.maintenanceMode);
          if (d.settings.maintenanceMessage) {
            setMaintenanceMsg(d.settings.maintenanceMessage);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const handleToggleMaintenance = async (newVal) => {
    setMaintenanceMode(newVal);
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenanceMode: newVal,
          maintenanceMessage: maintenanceMsg,
        }),
      });
      if (res.ok) {
        showToast(newVal ? '⚠️ Maintenance Mode Activated' : '✅ Store is now LIVE');
      } else {
        showToast('Failed to update maintenance mode');
      }
    } catch {
      showToast('Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveMaintenanceMsg = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenanceMode,
          maintenanceMessage: maintenanceMsg,
        }),
      });
      if (res.ok) {
        showToast('Apology message updated');
      } else {
        showToast('Failed to save message');
      }
    } catch {
      showToast('Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  /* ---------- Product Modal / Form State ---------- */
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState(EMPTY_PRODUCT_FORM);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingProdImg, setUploadingProdImg] = useState(false);
  const prodFileRef = useRef(null);

  const openAddProduct = () => {
    setEditingProduct(null);
    setProdForm(EMPTY_PRODUCT_FORM);
    setProductModalOpen(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProdForm({
      ...p,
      price: p.price ?? '',
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
    });
    setProductModalOpen(true);
  };

  const handleProductUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProdImg(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setProdForm((f) => ({
          ...f,
          cloudinaryUrl: data.url,
          cloudinaryId: data.cloudinaryId,
        }));
        showToast('Image uploaded to Cloudinary');
      } else {
        showToast('Image upload failed — using local path fallback');
      }
    } catch {
      showToast('Upload error');
    } finally {
      setUploadingProdImg(false);
    }
  };

  const saveProduct = async () => {
    if (!prodForm.name.trim()) {
      showToast('Please provide a garment name');
      return;
    }
    setSavingProduct(true);
    try {
      const payload = {
        ...prodForm,
        price: prodForm.price === '' || prodForm.price === null ? null : Number(prodForm.price),
        stock: Number(prodForm.stock) || 0,
        sizes: prodForm.sizes
          ? prodForm.sizes.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
          setProductModalOpen(false);
          showToast(`Updated "${data.product.name}"`);
        } else {
          showToast(data.error || 'Failed to update');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: `p${Date.now()}` }),
        });
        const data = await res.json();
        if (res.ok) {
          setProducts((prev) => [...prev, data.product]);
          setProductModalOpen(false);
          showToast(`Created "${data.product.name}"`);
        } else {
          showToast(data.error || 'Failed to create');
        }
      }
    } catch {
      showToast('Network error while saving product');
    } finally {
      setSavingProduct(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from inventory?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Deleted "${name}"`);
      }
    } catch {
      showToast('Failed to delete product');
    }
  };

  /* ---------- Advert Modal / Form State ---------- */
  const [advertModalOpen, setAdvertModalOpen] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState(null);
  const [advForm, setAdvForm] = useState(EMPTY_ADVERT_FORM);
  const [savingAdvert, setSavingAdvert] = useState(false);
  const [uploadingAdvImg, setUploadingAdvImg] = useState(false);
  const advFileRef = useRef(null);

  const openAddAdvert = () => {
    setEditingAdvert(null);
    setAdvForm({
      ...EMPTY_ADVERT_FORM,
      order: adverts.length + 1,
    });
    setAdvertModalOpen(true);
  };

  const openEditAdvert = (adv) => {
    setEditingAdvert(adv);
    setAdvForm(adv);
    setAdvertModalOpen(true);
  };

  const handleAdvertUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAdvImg(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setAdvForm((f) => ({
          ...f,
          cloudinaryUrl: data.url,
          cloudinaryId: data.cloudinaryId,
        }));
        showToast('Advert image uploaded');
      } else {
        showToast('Upload failed — using local path');
      }
    } catch {
      showToast('Upload error');
    } finally {
      setUploadingAdvImg(false);
    }
  };

  const saveAdvert = async () => {
    if (!advForm.title.trim()) {
      showToast('Please enter an advert headline');
      return;
    }
    setSavingAdvert(true);
    try {
      const payload = {
        ...advForm,
        order: Number(advForm.order) || 1,
      };

      if (editingAdvert) {
        const res = await fetch(`/api/adverts/${editingAdvert.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setAdverts((prev) =>
            prev.map((a) => (a.id === editingAdvert.id ? data.advert : a))
          );
          setAdvertModalOpen(false);
          showToast(`Updated advert "${data.advert.title}"`);
        } else {
          showToast(data.error || 'Failed to update advert');
        }
      } else {
        const res = await fetch('/api/adverts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: `adv-${Date.now()}` }),
        });
        const data = await res.json();
        if (res.ok) {
          setAdverts((prev) => [...prev, data.advert]);
          setAdvertModalOpen(false);
          showToast(`Created new advert`);
        } else {
          showToast(data.error || 'Failed to create advert');
        }
      }
    } catch {
      showToast('Network error while saving advert');
    } finally {
      setSavingAdvert(false);
    }
  };

  const deleteAdvert = async (id, title) => {
    if (!window.confirm(`Delete advert "${title}"?`)) return;
    try {
      const res = await fetch(`/api/adverts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAdverts((prev) => prev.filter((a) => a.id !== id));
        showToast('Advert deleted');
      }
    } catch {
      showToast('Failed to delete advert');
    }
  };

  const toggleAdvertActive = async (adv) => {
    try {
      const res = await fetch(`/api/adverts/${adv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !adv.active }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdverts((prev) =>
          prev.map((a) => (a.id === adv.id ? data.advert : a))
        );
        showToast(
          !adv.active ? 'Advert activated on store' : 'Advert deactivated'
        );
      }
    } catch {
      showToast('Error toggling status');
    }
  };

  /* ---------- Filtered Products ---------- */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
        (p.mat && p.mat.toLowerCase().includes(prodSearch.toLowerCase())) ||
        (p.tag && p.tag.toLowerCase().includes(prodSearch.toLowerCase()));
      const matchCat = prodCatFilter === 'all' || p.cat === prodCatFilter;
      return matchSearch && matchCat;
    });
  }, [products, prodSearch, prodCatFilter]);

  /* ---------- Analytics & Metrics ---------- */
  const totalValuation = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.price !== null && p.stock > 0 && p.stock <= 3).length;
  }, [products]);

  const soldOutCount = useMemo(() => {
    return products.filter((p) => p.price !== null && (!p.inStock || p.stock === 0)).length;
  }, [products]);

  const bespokeCount = useMemo(() => {
    return products.filter((p) => p.price === null).length;
  }, [products]);

  /* ---------- Loading Screen ---------- */
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFCB74]" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#A0A0A0]">
          Verifying Atelier Access...
        </span>
      </div>
    );
  }

  /* ---------- Unauthenticated Portal Screen ---------- */
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 selection:bg-[#FFCB74] selection:text-[#111111]">
        <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#FFCB74] border border-[#2F2F2F] flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6F6F6F] block font-semibold">
                Atelier Control Suite
              </span>
              <h1 className="font-heading text-2xl font-bold text-[#111111]">
                BMY Admin Console
              </h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#111111]" /> Username
              </label>
              <Input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. admin"
                required
                className="bg-[#F6F6F6] border-[#E5E5E5] focus:border-[#111111] text-[#111111] rounded-xl h-12"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#111111]" /> Password
              </label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#F6F6F6] border-[#E5E5E5] focus:border-[#111111] text-[#111111] rounded-xl h-12"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-widest font-bold shadow-lg rounded-xl"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Authenticating...
                </>
              ) : (
                'Access Atelier Dashboard'
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-[#E5E5E5] text-center">
            <Link
              href="/shop"
              className="text-xs font-mono text-[#6F6F6F] hover:text-[#111111] transition-colors"
            >
              ← Return to Online Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
      AUTHENTICATED DEDICATED ADMIN DASHBOARD
      ───────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#111111] font-body flex flex-col md:flex-row selection:bg-[#FFCB74] selection:text-[#111111]">
      {/* ─────────────────── SIDEBAR NAVIGATION ─────────────────── */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-[#111111] text-[#FFFFFF] border-r border-[#2F2F2F] flex flex-col justify-between transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Block */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2F2F2F] border border-white/10 p-1 flex items-center justify-center">
                <img
                  src="/assets/logo.png"
                  alt="BMY Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-heading text-sm font-bold text-[#FFFFFF] leading-tight">
                  BMY Atelier
                </h2>
                <span className="text-[10px] font-mono text-[#FFCB74] uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-[#A0A0A0] hover:text-[#FFFFFF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Inventory', icon: Package, badge: products.length },
              { id: 'new_piece', label: 'New Piece', icon: Plus, isAction: true },
              { id: 'adverts', label: 'Adverts', icon: Megaphone, badge: adverts.length },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isAction) {
                      openAddProduct();
                    } else {
                      setActiveTab(item.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-heading text-xs uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#FFCB74] text-[#111111] font-bold shadow-md'
                      : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#2F2F2F]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.isAction ? (
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#2F2F2F] text-[#FFCB74]">
                      +
                    </span>
                  ) : item.badge !== undefined ? (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#111111] text-[#FFCB74]'
                          : 'bg-[#2F2F2F] text-[#FFFFFF]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-6 border-t border-[#2F2F2F] space-y-3">
          <Link
            href="/shop"
            target="_blank"
            className="w-full py-2.5 px-3 rounded-xl bg-[#2F2F2F] hover:bg-[#3D3D3D] text-[#FFFFFF] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFCB74]" />
            <span>View Live Store</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl border border-white/10 hover:border-red-500 hover:text-red-400 text-[#A0A0A0] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* ─────────────────── MAIN WORKSPACE ─────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Maintenance Mode Top Warning Banner */}
        {maintenanceMode && (
          <div className="bg-[#FFCB74] text-[#111111] px-4 sm:px-6 py-2.5 text-xs font-mono font-bold flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-[#E6B35C]">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#111111] shrink-0" />
              <span className="truncate">
                MAINTENANCE MODE ACTIVE — Public shop is closed &amp; displaying under-maintenance apology
              </span>
            </div>
            <button
              onClick={() => handleToggleMaintenance(false)}
              className="underline hover:opacity-80 transition-opacity uppercase text-[11px] tracking-wider shrink-0 ml-4"
            >
              Turn Off &amp; Make Store Live
            </button>
          </div>
        )}

        {/* Top Action Bar (Clean & Minimalist) */}
        <header className="sticky top-0 z-20 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E5E5] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg bg-[#111111] p-1 flex items-center justify-center border border-[#2F2F2F]">
              <img
                src="/assets/logo.png"
                alt="BMY Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-heading text-base sm:text-xl font-bold text-[#111111] leading-tight">
                {activeTab === 'overview' && 'Atelier Overview'}
                {activeTab === 'products' && 'Inventory Management'}
                {activeTab === 'adverts' && 'Adverts & Promo Carousel'}
                {activeTab === 'whatsapp' && 'WhatsApp Concierge & Orders'}
                {activeTab === 'settings' && 'Settings & Session'}
              </h1>
              <p className="text-[10px] font-mono text-[#6F6F6F] hidden sm:block">
                BMY Collection &amp; Kaftan Atelier — Gombe Headquarters
              </p>
            </div>
          </div>
        </header>

        {/* Content Body with pb-28 on mobile for floating dock */}
        <main className="flex-1 p-4 sm:p-8 pb-28 md:pb-8 space-y-8 max-w-6xl w-full mx-auto">
          {/* ─────────────────────────────────────────────────────────
              TAB 1: OVERVIEW & ANALYTICS
              ───────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Metric Cards Grid (2 Columns on Mobile) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-[#6F6F6F]">
                    <span className="uppercase font-semibold truncate">Total Catalog</span>
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#111111] shrink-0" />
                  </div>
                  <div className="font-mono text-xl sm:text-3xl font-bold text-[#111111]">
                    {products.length}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#6F6F6F] font-body truncate">
                    {bespokeCount} bespoke · {products.length - bespokeCount} RTW
                  </p>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-[#6F6F6F]">
                    <span className="uppercase font-semibold truncate">Stock Value</span>
                    <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#111111] shrink-0" />
                  </div>
                  <div className="font-mono text-lg sm:text-3xl font-bold text-[#111111] truncate">
                    {fmt(totalValuation)}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#6F6F6F] font-body truncate">
                    Ready-to-wear value
                  </p>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-[#6F6F6F]">
                    <span className="uppercase font-semibold truncate">Stock Alerts</span>
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                  </div>
                  <div className="font-mono text-xl sm:text-3xl font-bold text-amber-600">
                    {lowStockCount + soldOutCount}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#6F6F6F] font-body truncate">
                    {lowStockCount} low · {soldOutCount} out
                  </p>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-[#6F6F6F]">
                    <span className="uppercase font-semibold truncate">Live Adverts</span>
                    <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#111111] shrink-0" />
                  </div>
                  <div className="font-mono text-xl sm:text-3xl font-bold text-[#111111]">
                    {adverts.filter((a) => a.active).length} / {adverts.length}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#6F6F6F] font-body truncate">
                    Live rotating banner
                  </p>
                </div>
              </div>

              {/* Quick Actions & Recent Inventory */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-base font-bold text-[#111111]">
                      Latest Garment Additions
                    </h3>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-mono text-[#111111] hover:text-[#FFCB74] font-bold"
                    >
                      View All ({products.length}) →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {products.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-[#F6F6F6] border border-[#E5E5E5] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.cloudinaryUrl || p.img || '/products/476025.jpg'}
                            alt={p.name}
                            className="w-10 h-12 rounded-lg object-cover border border-[#E5E5E5]"
                          />
                          <div className="truncate">
                            <h4 className="font-heading text-xs font-bold text-[#111111] truncate">
                              {p.name}
                            </h4>
                            <span className="font-mono text-[10px] text-[#6F6F6F]">
                              {p.tag || p.cat} · {fmt(p.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              p.price === null
                                ? 'bg-white text-[#111111] border border-[#E5E5E5]'
                                : p.stock <= 3
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.price === null ? 'Bespoke' : `Stock: ${p.stock}`}
                          </span>
                          <Button
                            size="iconSm"
                            variant="ghost"
                            onClick={() => openEditProduct(p)}
                            className="h-8 w-8 text-[#6F6F6F] hover:text-[#111111]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advert Carousel Summary */}
                <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-base font-bold text-[#111111]">
                      Live Store Adverts
                    </h3>
                    <button
                      onClick={() => setActiveTab('adverts')}
                      className="text-xs font-mono text-[#111111] hover:text-[#FFCB74] font-bold"
                    >
                      Manage ({adverts.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {adverts.map((adv) => (
                      <div
                        key={adv.id}
                        className="p-3 rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#111111] text-[#FFCB74] uppercase">
                            {adv.badge}
                          </span>
                          <span
                            className={`text-[9px] font-mono ${
                              adv.active ? 'text-emerald-700 font-bold' : 'text-[#A0A0A0]'
                            }`}
                          >
                            {adv.active ? '● Active' : '○ Paused'}
                          </span>
                        </div>
                        <h4 className="font-heading text-xs font-bold text-[#111111] truncate">
                          {adv.title}
                        </h4>
                        <p className="text-[10px] text-[#6F6F6F] font-body truncate">
                          {adv.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 2: PRODUCTS & INVENTORY CRUD
              ───────────────────────────────────────────────────────── */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Search & Filter & View Mode Strip */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E5E5E5] shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6F6F6F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search by name, fabric weave, tag..."
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    className="pl-10 bg-[#F6F6F6] border-[#E5E5E5] text-xs font-mono rounded-xl h-11"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <select
                    value={prodCatFilter}
                    onChange={(e) => setProdCatFilter(e.target.value)}
                    className="h-11 px-3 rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] text-xs font-mono text-[#111111] flex-1 sm:flex-initial"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.cat} value={c.cat}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  {/* Flexible View Switcher Buttons */}
                  <div className="flex items-center bg-[#F6F6F6] border border-[#E5E5E5] rounded-xl p-1 gap-0.5 shrink-0">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'grid'
                          ? 'bg-[#111111] text-[#FFCB74] shadow-sm'
                          : 'text-[#6F6F6F] hover:text-[#111111]'
                      }`}
                      title="2-Column Grid View"
                      aria-label="2-Column Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'list'
                          ? 'bg-[#111111] text-[#FFCB74] shadow-sm'
                          : 'text-[#6F6F6F] hover:text-[#111111]'
                      }`}
                      title="Compact List View"
                      aria-label="Compact List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'table'
                          ? 'bg-[#111111] text-[#FFCB74] shadow-sm'
                          : 'text-[#6F6F6F] hover:text-[#111111]'
                      }`}
                      title="Data Table View"
                      aria-label="Data Table View"
                    >
                      <TableIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* No items found empty state */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5] p-6 space-y-2 text-[#A0A0A0] shadow-sm">
                  <Package className="w-10 h-10 mx-auto text-[#E5E5E5]" />
                  <p className="text-sm font-mono text-[#111111] font-bold">No matching garments found</p>
                  <p className="text-xs font-body text-[#6F6F6F]">Try clearing search keywords or category filters.</p>
                </div>
              ) : viewMode === 'grid' ? (
                /* ─── 1. TWO-COLUMN GRID VIEW ─── */
                <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-[#111111] transition-all flex flex-col justify-between"
                    >
                      {/* Top Media Frame */}
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F6F6F6] border border-[#EEEEEE] mb-3">
                        <img
                          src={p.cloudinaryUrl || p.img || '/products/476025.jpg'}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/products/476025.jpg';
                          }}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-[#111111]/80 backdrop-blur-sm text-[#FFCB74] text-[9px] font-mono uppercase font-bold truncate">
                            {p.tag || p.cat}
                          </span>

                          {p.featured && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#FFCB74] text-[#111111] text-[8px] font-mono font-bold uppercase shadow">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Stock Badge Overlay */}
                        <div className="absolute bottom-2 left-2">
                          {p.price === null ? (
                            <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[#111111] font-mono text-[9px] font-bold shadow-sm">
                              Bespoke
                            </span>
                          ) : p.stock <= 0 || !p.inStock ? (
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-bold shadow-sm">
                              Sold Out
                            </span>
                          ) : p.stock <= 3 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-mono text-[9px] font-bold shadow-sm">
                              Low Stock ({p.stock})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[9px] font-bold shadow-sm">
                              {p.stock} units
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info & Price */}
                      <div className="space-y-1 text-left px-0.5">
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-[#111111] truncate">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-[#6F6F6F] font-body truncate">
                          {p.mat || 'Heritage weave'}
                        </p>
                        <div className="font-mono text-xs sm:text-sm font-bold text-[#111111] pt-0.5">
                          {fmt(p.price)}
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="pt-3 mt-2 border-t border-[#E5E5E5] flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditProduct(p)}
                          className="flex-1 h-8 rounded-lg text-xs font-mono border-[#E5E5E5] hover:border-[#111111] hover:text-[#111111]"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(p.id, p.name)}
                          className="h-8 w-8 p-0 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shrink-0"
                          title="Delete piece"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewMode === 'list' ? (
                /* ─── 2. COMPACT LIST VIEW ─── */
                <div className="space-y-3">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] shadow-sm transition-all flex items-center gap-3.5 justify-between"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={p.cloudinaryUrl || p.img || '/products/476025.jpg'}
                          alt={p.name}
                          className="w-14 h-16 rounded-xl object-cover border border-[#E5E5E5] shrink-0 bg-[#F6F6F6]"
                          onError={(e) => {
                            e.currentTarget.src = '/products/476025.jpg';
                          }}
                        />

                        <div className="min-w-0 space-y-1 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-heading text-xs sm:text-sm font-bold text-[#111111] truncate">
                              {p.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-[#F6F6F6] text-[#2F2F2F] text-[9px] font-mono border border-[#E5E5E5] uppercase">
                              {p.tag || p.cat}
                            </span>
                            {p.featured && (
                              <span className="px-1.5 py-0.2 rounded bg-[#111111] text-[#FFCB74] text-[8px] font-mono font-bold uppercase">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#6F6F6F] font-body truncate">{p.mat}</p>
                          <div className="flex items-center gap-3 text-xs font-mono">
                            <span className="font-bold text-[#111111]">{fmt(p.price)}</span>
                            <span>•</span>
                            {p.price === null ? (
                              <span className="text-[10px] text-[#6F6F6F]">Bespoke Commission</span>
                            ) : (
                              <span
                                className={`text-[10px] font-bold ${
                                  p.stock <= 3 ? 'text-amber-600' : 'text-emerald-600'
                                }`}
                              >
                                {p.stock} in stock
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          size="iconSm"
                          variant="outline"
                          onClick={() => openEditProduct(p)}
                          className="h-8 w-8 hover:border-[#111111]"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="iconSm"
                          variant="destructive"
                          onClick={() => deleteProduct(p.id, p.name)}
                          className="h-8 w-8 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ─── 3. TECHNICAL TABLE VIEW ─── */
                <div className="rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-body">
                      <thead className="bg-[#F6F6F6] border-b border-[#E5E5E5] font-mono text-[10px] uppercase text-[#6F6F6F]">
                        <tr>
                          <th className="py-3.5 px-4">Garment</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Price</th>
                          <th className="py-3.5 px-4">Stock</th>
                          <th className="py-3.5 px-4">Featured</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#F9F9F9] transition-colors">
                            <td className="py-3.5 px-4 flex items-center gap-3">
                              <img
                                src={p.cloudinaryUrl || p.img || '/products/476025.jpg'}
                                alt={p.name}
                                className="w-10 h-12 rounded-lg object-cover border border-[#E5E5E5]"
                              />
                              <div>
                                <h4 className="font-heading text-xs font-bold text-[#111111]">
                                  {p.name}
                                </h4>
                                <p className="text-[10px] text-[#6F6F6F] font-mono">{p.mat}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono uppercase text-[11px] text-[#2F2F2F]">
                              {p.tag || p.cat}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-[#111111]">
                              {fmt(p.price)}
                            </td>
                            <td className="py-3.5 px-4">
                              {p.price === null ? (
                                <span className="px-2 py-0.5 rounded bg-[#F6F6F6] text-[#111111] font-mono text-[10px] border border-[#E5E5E5]">
                                  Bespoke
                                </span>
                              ) : (
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                                    p.stock <= 3
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  }`}
                                >
                                  {p.stock} units
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {p.featured ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#111111] text-[#FFCB74] font-mono text-[9px] uppercase font-bold">
                                  Featured
                                </span>
                              ) : (
                                <span className="text-[#A0A0A0] text-[10px] font-mono">—</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              <Button
                                size="iconSm"
                                variant="outline"
                                onClick={() => openEditProduct(p)}
                                className="h-8 w-8 hover:border-[#111111] hover:text-[#111111]"
                                title="Edit Garment"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="iconSm"
                                variant="destructive"
                                onClick={() => deleteProduct(p.id, p.name)}
                                className="h-8 w-8 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                title="Delete Garment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 3: ADVERTS & BANNERS CRUD
              ───────────────────────────────────────────────────────── */}
          {activeTab === 'adverts' && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex items-center justify-between bg-[#FFFFFF] p-4 rounded-2xl border border-[#E5E5E5] shadow-sm">
                <div>
                  <h3 className="font-heading text-base font-bold text-[#111111]">
                    Store Banner Adverts ({adverts.length})
                  </h3>
                  <p className="text-xs font-mono text-[#6F6F6F]">
                    These slides auto-rotate in the low-profile shop advert carousel.
                  </p>
                </div>

                <Button
                  onClick={openAddAdvert}
                  className="bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-wider font-bold rounded-xl h-11 px-4"
                >
                  <Plus className="w-4 h-4 mr-1 text-[#FFCB74]" /> New Advert
                </Button>
              </div>

              {/* Advert Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adverts.map((adv, idx) => (
                  <div
                    key={adv.id}
                    className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm hover:border-[#111111] transition-all space-y-4 flex flex-col justify-between"
                  >
                    {/* Visual Live Preview Box */}
                    <div className="rounded-xl bg-[#111111] text-[#FFFFFF] p-3.5 border border-[#2F2F2F] flex items-center justify-between gap-3 shadow-md">
                      <div className="space-y-1 max-w-[65%]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#2F2F2F] text-[#FFCB74] uppercase border border-white/10">
                            {adv.badge}
                          </span>
                          <span className="text-[9px] font-mono text-[#FFCB74] font-bold bg-[#2F2F2F] px-1.5 py-0.5 rounded border border-white/5">
                            {adv.metricValue}
                          </span>
                        </div>
                        <h4 className="font-heading text-xs font-bold text-white truncate">
                          {adv.title}
                        </h4>
                        <p className="text-[10px] text-[#A0A0A0] font-body truncate">
                          {adv.desc}
                        </p>
                      </div>

                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#2F2F2F] bg-[#1a1a1a] shrink-0">
                        <img
                          src={adv.cloudinaryUrl || adv.img || '/products/476031.jpg'}
                          alt={adv.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Advert Meta & Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5] text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAdvertActive(adv)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${
                            adv.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {adv.active ? '● Active' : '○ Paused'}
                        </button>
                        <span className="font-mono text-[10px] text-[#6F6F6F]">
                          Order: #{adv.order || idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="iconSm"
                          variant="outline"
                          onClick={() => openEditAdvert(adv)}
                          className="h-8 w-8 hover:border-[#111111]"
                          title="Edit Advert"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="iconSm"
                          variant="destructive"
                          onClick={() => deleteAdvert(adv.id, adv.title)}
                          className="h-8 w-8 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          title="Delete Advert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 4: WHATSAPP CONCIERGE & ORDERS
              ───────────────────────────────────────────────────────── */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#111111]">
                      Atelier WhatsApp Concierge
                    </h3>
                    <p className="text-xs font-mono text-[#6F6F6F]">
                      Hotline: +234 814 333 9349 · Gombe Atelier
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-body text-[#6F6F6F] leading-relaxed">
                  All customer garment orders, custom sizing measurements, and wedding entourage consultations are routed directly to your WhatsApp concierge hotline.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 text-[#FFCB74]" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 5: DATABASE & SETTINGS & SESSION (MINIMALIST REDESIGN)
              ───────────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              {/* 1. Master Admin Identity & Session Hero */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-[#FFFFFF] border border-[#2F2F2F] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl bg-[#2F2F2F] border border-white/10 flex items-center justify-center text-[#FFCB74] font-heading font-bold text-xl shadow-inner shrink-0">
                    {adminUsername.slice(0, 2).toUpperCase()}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#111111]" title="Session Active" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-lg sm:text-xl font-bold text-[#FFFFFF]">
                        @{adminUsername}
                      </h2>
                      <span className="text-[10px] font-mono font-bold bg-[#FFCB74] text-[#111111] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Master Admin
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#A0A0A0] mt-0.5">
                      BMY Atelier Management · Gombe, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Link
                    href="/shop"
                    target="_blank"
                    className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-[#2F2F2F] hover:bg-[#FFCB74] hover:text-[#111111] text-[#FFFFFF] text-xs font-heading uppercase tracking-wider font-bold flex items-center justify-center gap-2 border border-white/10 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Store</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-600 hover:text-white border border-red-800/40 text-red-400 text-xs font-heading uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* 2. Store Availability & Maintenance Mode */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#FFCB74] flex items-center justify-center border border-[#2F2F2F] shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-base font-bold text-[#111111]">
                          Store Maintenance Mode
                        </h3>
                        <Badge
                          variant="outline"
                          className={
                            maintenanceMode
                              ? 'bg-amber-50 text-amber-800 border-amber-300 font-mono text-[10px] font-bold'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 font-mono text-[10px] font-bold'
                          }
                        >
                          {maintenanceMode ? '⚠️ MAINTENANCE ACTIVE' : '● STORE IS LIVE'}
                        </Badge>
                      </div>
                      <p className="text-xs font-body text-[#6F6F6F] mt-0.5">
                        Controls public accessibility of the shop catalog.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs font-mono font-bold uppercase text-[#6F6F6F]">
                      {maintenanceMode ? 'Maintenance On' : 'Store Live'}
                    </span>
                    <button
                      onClick={() => handleToggleMaintenance(!maintenanceMode)}
                      disabled={savingSettings}
                      className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        maintenanceMode ? 'bg-[#FFCB74]' : 'bg-[#E5E5E5]'
                      }`}
                      role="switch"
                      aria-checked={maintenanceMode}
                      title={maintenanceMode ? 'Turn maintenance off' : 'Turn maintenance on'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-[#FFFFFF] shadow-md ring-0 transition duration-200 ease-in-out ${
                          maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Apology Notice Box */}
                <div className="space-y-2 pt-3 border-t border-[#E5E5E5]">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#111111]" />
                    Customer Apology &amp; Downtime Notice Message
                  </label>
                  <Textarea
                    rows={2}
                    value={maintenanceMsg}
                    onChange={(e) => setMaintenanceMsg(e.target.value)}
                    placeholder="Enter the message displayed to users when shop is in maintenance mode..."
                    className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl text-xs font-body leading-relaxed"
                  />
                  <div className="flex justify-end pt-1">
                    <Button
                      onClick={handleSaveMaintenanceMsg}
                      disabled={savingSettings}
                      className="bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-wider font-bold rounded-xl h-10 px-5 shadow-sm"
                    >
                      {savingSettings ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Saving...
                        </>
                      ) : (
                        'Save Notice'
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 3. Admin Security & Account Credentials */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#FFCB74] flex items-center justify-center border border-[#2F2F2F] shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#111111]">
                        Admin Security &amp; Credentials
                      </h3>
                      <p className="text-xs font-mono text-[#6F6F6F]">
                        Update administrator username and access password
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCredPasswords(!showCredPasswords)}
                    className="text-xs font-mono text-[#6F6F6F] hover:text-[#111111] flex items-center gap-1.5 transition-colors"
                  >
                    {showCredPasswords ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>

                <form onSubmit={handleUpdateCredentials} className="space-y-4 pt-1">
                  {/* Current Password Field */}
                  <div className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E5E5E5] space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#111111] font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#111111]" /> Current Password * (Verification)
                    </label>
                    <Input
                      type={showCredPasswords ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={credCurrentPassword}
                      onChange={(e) => setCredCurrentPassword(e.target.value)}
                      placeholder="Enter current password to authorize changes"
                      required
                      className="bg-[#FFFFFF] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-mono"
                    />
                  </div>

                  {/* New Credentials Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#111111]" /> New Username
                      </label>
                      <Input
                        type="text"
                        autoComplete="username"
                        value={credNewUsername}
                        onChange={(e) => setCredNewUsername(e.target.value)}
                        placeholder="e.g. admin"
                        className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#111111]" /> New Password
                      </label>
                      <Input
                        type={showCredPasswords ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={credNewPassword}
                        onChange={(e) => setCredNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#111111]" /> Confirm Password
                      </label>
                      <Input
                        type={showCredPasswords ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={credConfirmPassword}
                        onChange={(e) => setCredConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* Feedback Messages */}
                  {credError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{credError}</span>
                    </div>
                  )}

                  {credSuccess && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{credSuccess}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <Button
                      type="submit"
                      disabled={savingCreds}
                      className="bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-wider font-bold rounded-xl h-11 px-6 shadow-sm"
                    >
                      {savingCreds ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...
                        </>
                      ) : (
                        'Save Credentials'
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* 4. Atelier Database & Maintenance Tools */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F6F6F6] text-[#111111] flex items-center justify-center border border-[#E5E5E5] shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#111111]">
                        Database &amp; Catalog Tools
                      </h3>
                      <p className="text-xs font-body text-[#6F6F6F]">
                        Synchronize catalog products and standard promotional banners.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/seed');
                        const data = await res.json();
                        if (res.ok) {
                          showToast('Catalog seeded successfully');
                          fetchProducts();
                        }
                      } catch {
                        showToast('Error seeding database');
                      }
                    }}
                    className="bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-mono text-xs uppercase rounded-xl h-11 px-5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-2 text-[#FFCB74]" /> Re-Seed 18 Garments
                  </Button>

                  <Button
                    onClick={fetchAdverts}
                    variant="outline"
                    className="border-[#E5E5E5] text-[#111111] font-mono text-xs uppercase rounded-xl h-11 px-5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-2" /> Sync Adverts
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────
          PRODUCT EDIT / CREATE MODAL
          ───────────────────────────────────────────────────────── */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="space-y-2 border-b border-[#E5E5E5] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#FFCB74] flex items-center justify-center border border-[#2F2F2F] shadow-sm shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg sm:text-xl font-bold text-[#111111]">
                  {editingProduct ? `Edit Garment: ${editingProduct.name}` : 'New Atelier Garment'}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-[#6F6F6F]">
                  {editingProduct ? `Garment ID: ${editingProduct.id}` : 'Add a bespoke commission or ready-to-wear piece to your collection'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Image Preview & Uploader */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#111111]" /> Product Media
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="aspect-[4/5] max-h-52 sm:max-h-none rounded-2xl overflow-hidden border border-[#E5E5E5] bg-[#F6F6F6] relative shadow-inner">
                  <img
                    src={
                      prodForm.cloudinaryUrl ||
                      prodForm.img ||
                      '/products/476025.jpg'
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2.5">
                  <div
                    onClick={() => prodFileRef.current?.click()}
                    className="border border-dashed border-[#E5E5E5] hover:border-[#111111] rounded-2xl p-4 text-center cursor-pointer bg-[#F6F6F6] hover:bg-[#EEEEEE] transition-all"
                  >
                    <input
                      ref={prodFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProductUpload}
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 mx-auto text-[#111111] mb-1.5" />
                    <p className="text-xs font-heading font-bold text-[#111111]">
                      {uploadingProdImg ? 'Uploading to Cloudinary...' : 'Upload Garment Photo'}
                    </p>
                    <p className="text-[10px] text-[#6F6F6F] font-mono mt-0.5">
                      JPG, PNG, WebP up to 10MB
                    </p>
                  </div>

                  <Input
                    type="text"
                    value={prodForm.img || ''}
                    onChange={(e) =>
                      setProdForm((f) => ({ ...f, img: e.target.value }))
                    }
                    placeholder="Or local path e.g. /products/476025.jpg"
                    className="text-xs font-mono h-9 bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Name & Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Garment Name *
                </label>
                <Input
                  type="text"
                  value={prodForm.name}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Royal Agbada — Indigo"
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-body"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Badge / Tag Label
                </label>
                <Input
                  type="text"
                  value={prodForm.tag || ''}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, tag: e.target.value }))
                  }
                  placeholder="e.g. Ceremonial Bespoke"
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-body"
                />
              </div>
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Category
                </label>
                <select
                  value={prodForm.cat}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, cat: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] px-3 text-xs font-mono text-[#111111]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.cat} value={c.cat}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Price in ₦ (Leave empty for Bespoke)
                </label>
                <Input
                  type="number"
                  value={prodForm.price ?? ''}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="e.g. 35000"
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-mono font-bold"
                />
              </div>
            </div>

            {/* Fabric Material */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                Fabric &amp; Weave Specification
              </label>
              <Input
                type="text"
                value={prodForm.mat || ''}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, mat: e.target.value }))
                }
                placeholder="e.g. Shadda weave · Gold hand embroidery"
                className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-body"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                Garment Description
              </label>
              <Textarea
                rows={2}
                value={prodForm.desc || ''}
                onChange={(e) =>
                  setProdForm((f) => ({ ...f, desc: e.target.value }))
                }
                placeholder="Details on cut, fittings, and occasion..."
                className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl text-xs font-body"
              />
            </div>

            {/* Stock & Sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Stock Units
                </label>
                <Input
                  type="number"
                  min="0"
                  value={prodForm.stock}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Sizes (comma separated)
                </label>
                <Input
                  type="text"
                  value={prodForm.sizes || ''}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, sizes: e.target.value }))
                  }
                  placeholder="S, M, L, XL, XXL"
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs font-mono"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-[#E5E5E5] bg-[#F6F6F6] cursor-pointer hover:bg-[#EEEEEE] transition-colors">
                <input
                  type="checkbox"
                  checked={prodForm.inStock}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, inStock: e.target.checked }))
                  }
                  className="rounded accent-[#111111] w-4 h-4"
                />
                <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  In Stock
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-[#E5E5E5] bg-[#F6F6F6] cursor-pointer hover:bg-[#EEEEEE] transition-colors">
                <input
                  type="checkbox"
                  checked={prodForm.featured}
                  onChange={(e) =>
                    setProdForm((f) => ({ ...f, featured: e.target.checked }))
                  }
                  className="rounded accent-[#111111] w-4 h-4"
                />
                <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Featured
                </span>
              </label>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => setProductModalOpen(false)}
                className="w-1/3 h-12 border-[#E5E5E5] text-[#2F2F2F] font-heading text-xs uppercase tracking-wider rounded-xl"
              >
                Cancel
              </Button>

              <Button
                onClick={saveProduct}
                disabled={savingProduct}
                className="flex-1 h-12 bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-wider font-bold rounded-xl shadow-md"
              >
                {savingProduct ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving Garment...
                  </>
                ) : editingProduct ? (
                  'Save Changes'
                ) : (
                  'Create Garment'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────────────────
          ADVERT EDIT / CREATE MODAL
          ───────────────────────────────────────────────────────── */}
      <Dialog open={advertModalOpen} onOpenChange={setAdvertModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="space-y-2 border-b border-[#E5E5E5] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#FFCB74] flex items-center justify-center border border-[#2F2F2F] shadow-sm shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg sm:text-xl font-bold text-[#111111]">
                  {editingAdvert ? `Edit Advert: ${editingAdvert.title}` : 'New Advert Banner'}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono text-[#6F6F6F]">
                  Configure carousel slide headlines, badges, metrics and photo for the store banner.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Live Banner Preview Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                Live Banner Preview
              </label>
              <div className="rounded-2xl bg-[#111111] text-[#FFFFFF] p-4 border border-[#2F2F2F] flex items-center justify-between gap-3 shadow-md">
                <div className="space-y-1 max-w-[65%]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#2F2F2F] text-[#FFCB74] uppercase border border-white/10">
                      {advForm.badge || 'PROMO'}
                    </span>
                    <span className="text-[9px] font-mono text-[#FFCB74] font-bold bg-[#2F2F2F] px-1.5 py-0.5 rounded border border-white/5">
                      {advForm.metricValue || 'FEATURED'}
                    </span>
                  </div>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-white truncate">
                    {advForm.title || 'Advert Headline'}
                  </h4>
                  <p className="text-[10px] text-[#A0A0A0] font-body truncate">
                    {advForm.desc || 'Advert description and highlight text.'}
                  </p>
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#2F2F2F] bg-[#1a1a1a] shrink-0 shadow">
                  <img
                    src={advForm.cloudinaryUrl || advForm.img || '/products/476031.jpg'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#111111]" /> Banner Image
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div
                  onClick={() => advFileRef.current?.click()}
                  className="border border-dashed border-[#E5E5E5] hover:border-[#111111] rounded-2xl p-4 text-center cursor-pointer bg-[#F6F6F6] hover:bg-[#EEEEEE] transition-all"
                >
                  <input
                    ref={advFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAdvertUpload}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4 mx-auto text-[#111111] mb-1" />
                  <p className="text-xs font-heading font-bold text-[#111111]">
                    {uploadingAdvImg ? 'Uploading...' : 'Upload Image'}
                  </p>
                </div>

                <Input
                  type="text"
                  value={advForm.img || ''}
                  onChange={(e) =>
                    setAdvForm((f) => ({ ...f, img: e.target.value }))
                  }
                  placeholder="Or local path e.g. /products/476031.jpg"
                  className="text-xs font-mono h-11 bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                />
              </div>
            </div>

            {/* Badge & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Badge Tag
                </label>
                <Input
                  type="text"
                  value={advForm.badge}
                  onChange={(e) =>
                    setAdvForm((f) => ({ ...f, badge: e.target.value }))
                  }
                  placeholder="e.g. Limited Sale"
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Headline Title *
                </label>
                <Input
                  type="text"
                  value={advForm.title}
                  onChange={(e) =>
                    setAdvForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Up to 35% Off Caftans"
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs sm:text-sm font-heading font-bold"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                Sub-Headline / Description
              </label>
              <Input
                type="text"
                value={advForm.desc}
                onChange={(e) =>
                  setAdvForm((f) => ({ ...f, desc: e.target.value }))
                }
                placeholder="e.g. Signature ready-to-wear tailored silhouettes."
                className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs font-body"
              />
            </div>

            {/* Metric Label & Metric Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Metric Label
                </label>
                <Input
                  type="text"
                  value={advForm.metricLabel}
                  onChange={(e) =>
                    setAdvForm((f) => ({ ...f, metricLabel: e.target.value }))
                  }
                  placeholder="e.g. Special Deal"
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                  Metric Value
                </label>
                <Input
                  type="text"
                  value={advForm.metricValue}
                  onChange={(e) =>
                    setAdvForm((f) => ({ ...f, metricValue: e.target.value }))
                  }
                  placeholder="e.g. From ₦18,000"
                  className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl h-11 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Active Toggle & Order */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-[#E5E5E5] bg-[#F6F6F6] cursor-pointer hover:bg-[#EEEEEE] transition-colors">
                <input
                  type="checkbox"
                  checked={advForm.active}
                  onChange={(e) =>
                    setAdvForm((f) => ({ ...f, active: e.target.checked }))
                  }
                  className="rounded accent-[#111111] w-4 h-4"
                />
                <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Active on Store
                </span>
              </label>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-[#6F6F6F]">
                  Display Order
                </label>
                <Input
                  type="number"
                  min="1"
                  value={advForm.order}
                  onChange={(e) =>
                    setAdvForm((f) => ({ ...f, order: e.target.value }))
                  }
                  className="h-11 bg-[#F6F6F6] border-[#E5E5E5] rounded-2xl text-xs font-mono"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => setAdvertModalOpen(false)}
                className="w-1/3 h-12 border-[#E5E5E5] text-[#2F2F2F] font-heading text-xs uppercase tracking-wider rounded-xl"
              >
                Cancel
              </Button>

              <Button
                onClick={saveAdvert}
                disabled={savingAdvert}
                className="flex-1 h-12 bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-wider font-bold rounded-xl shadow-md"
              >
                {savingAdvert ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving Advert...
                  </>
                ) : editingAdvert ? (
                  'Save Changes'
                ) : (
                  'Publish Advert'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────────────────
          MOBILE FLOATING BOTTOM DOCK NAVIGATION (< md screens)
          Features #111111 dark dock, #FFCB74 active pill,
          badge counts and clean icons
          ───────────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-4 inset-x-3 max-w-sm sm:max-w-md mx-auto z-30 md:hidden bg-[#111111] text-[#FFFFFF] rounded-2xl p-1.5 shadow-2xl border border-[#2F2F2F] flex items-center justify-between"
        aria-label="Admin Mobile Navigation"
      >
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'products', label: 'Inventory', icon: Package, badge: products.length },
          { id: 'new_piece', label: 'New Piece', icon: Plus, isAction: true },
          { id: 'adverts', label: 'Adverts', icon: Megaphone, badge: adverts.length },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction) {
                  openAddProduct();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#FFCB74] text-[#111111] font-bold shadow-sm'
                  : 'text-[#A0A0A0] hover:text-[#FFFFFF]'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {isActive && (
                <span className="font-heading text-[10px] uppercase tracking-wider font-bold">
                  {item.label}
                </span>
              )}
              {!isActive && item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-[#2F2F2F] text-[#FFCB74] border border-white/10 text-[8px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ─────────────────── TOAST ─────────────────── */}
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
