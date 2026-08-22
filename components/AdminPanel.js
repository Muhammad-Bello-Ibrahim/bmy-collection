'use client';

import { useState, useRef } from 'react';
import { fmt } from '@/lib/shop-data';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  KeyRound,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ArrowLeft,
  Loader2,
  Package,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ImageIcon,
} from 'lucide-react';

const CATEGORIES = [
  { cat: 'all', label: 'All' },
  { cat: 'bespoke', label: 'Bespoke' },
  { cat: 'rtw', label: 'Ready-to-Wear' },
  { cat: 'fabric', label: 'Fabric' },
  { cat: 'accessory', label: 'Accessories' },
  { cat: 'group', label: 'Group Orders' },
];

const EMPTY_FORM = {
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

function getStockBadge(product) {
  if (product.price === null) {
    return <Badge variant="outline" className="bg-[#F6F6F6] text-[#111111] border-[#E5E5E5] font-mono">Bespoke</Badge>;
  }
  if (!product.inStock || product.stock === 0) {
    return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 font-mono">Sold Out</Badge>;
  }
  if (product.stock <= 3) {
    return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-mono">Low stock ({product.stock})</Badge>;
  }
  return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-mono">In stock ({product.stock})</Badge>;
}

export default function AdminPanel({ open, products, onClose, onProductsChange, onLogout }) {
  const [tab, setTab] = useState('products');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const fileRef = useRef(null);

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      ...p,
      price: p.price ?? '',
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
    });
    setUploadPreview(null);
    setTab('edit');
    setSaveError('');
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setUploadPreview(null);
    setTab('add');
    setSaveError('');
  };

  const field = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadPreview(URL.createObjectURL(file));
    setUploading(true);
    setSaveError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        field('cloudinaryUrl', data.url);
        field('cloudinaryId', data.cloudinaryId);
      } else {
        setSaveError('Cloudinary inactive. Image falls back to local path.');
      }
    } catch {
      setSaveError('Upload failed. Check network or credentials.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.name.trim()) {
      setSaveError('Please enter a product name');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        ...form,
        price: form.price === '' || form.price === null ? null : Number(form.price),
        stock: Number(form.stock) || 0,
        sizes: form.sizes
          ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (tab === 'edit') {
        const res = await fetch(`/api/products/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          onProductsChange(products.map((p) => (p.id === editing.id ? data.product : p)));
          setTab('products');
        } else {
          setSaveError(data.error || 'Failed to update piece');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: `p${Date.now()}` }),
        });
        const data = await res.json();
        if (res.ok) {
          onProductsChange([...products, data.product]);
          setTab('products');
        } else {
          setSaveError(data.error || 'Failed to create piece');
        }
      }
    } catch {
      setSaveError('Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onProductsChange(products.filter((p) => p.id !== id));
      }
    } catch {
      alert('Failed to delete product');
    }
  };

  const imgSrc = (p) => p.cloudinaryUrl || p.img || '/products/476025.jpg';

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.tag && p.tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl bg-[#FFFFFF] text-[#111111] border-l border-[#E5E5E5] p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F6F6F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#FFCB74] flex items-center justify-center shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-xl font-heading font-bold text-[#111111]">
                Atelier Inventory
              </SheetTitle>
              <SheetDescription className="text-xs text-[#6F6F6F] font-mono">
                Catalog &amp; stock management
              </SheetDescription>
            </div>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-[#E5E5E5] bg-[#F6F6F6] px-6">
          <button
            onClick={() => setTab('products')}
            className={`py-3 px-4 text-xs font-mono tracking-wider uppercase border-b-2 transition-all ${
              tab === 'products'
                ? 'border-[#111111] text-[#111111] font-bold'
                : 'border-transparent text-[#6F6F6F] hover:text-[#111111]'
            }`}
          >
            Catalog ({products.length})
          </button>
          <button
            onClick={openAdd}
            className={`py-3 px-4 text-xs font-mono tracking-wider uppercase border-b-2 transition-all flex items-center gap-1.5 ${
              tab === 'add'
                ? 'border-[#111111] text-[#111111] font-bold'
                : 'border-transparent text-[#6F6F6F] hover:text-[#111111]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Add Piece
          </button>
          {tab === 'edit' && (
            <button
              className="py-3 px-4 text-xs font-mono tracking-wider uppercase border-b-2 border-[#111111] text-[#111111] font-bold flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Piece
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FFFFFF]">
          {tab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Input
                  type="text"
                  placeholder="Search pieces in inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#F6F6F6] border-[#E5E5E5] text-xs font-mono rounded-xl h-11"
                />
                <Button
                  onClick={openAdd}
                  size="sm"
                  className="bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] shrink-0 shadow-sm rounded-xl h-11 px-4 font-heading text-xs uppercase font-bold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> New
                </Button>
              </div>

              <div className="space-y-2.5">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] hover:border-[#111111] transition-all flex items-center gap-3.5 group shadow-sm"
                  >
                    <div className="w-14 h-16 rounded-lg bg-[#FFFFFF] overflow-hidden shrink-0 border border-[#E5E5E5]">
                      <img
                        src={imgSrc(p)}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/products/476025.jpg';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-sm font-heading font-semibold text-[#111111] truncate group-hover:text-[#2F2F2F] transition-colors">
                          {p.name}
                        </h4>
                        {p.featured && (
                          <Badge className="bg-[#111111] text-[#FFCB74] border-none text-[9px] px-1.5 py-0">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6F6F6F] font-mono">
                        <span className="font-bold text-[#111111]">{fmt(p.price)}</span>
                        <span>•</span>
                        {getStockBadge(p)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="iconSm"
                        variant="outline"
                        onClick={() => openEdit(p)}
                        title="Edit piece"
                        className="h-8 w-8 hover:border-[#111111] hover:text-[#111111] rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="iconSm"
                        variant="destructive"
                        onClick={() => deleteProduct(p.id, p.name)}
                        title="Delete piece"
                        className="h-8 w-8 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 text-[#A0A0A0] space-y-2">
                    <Package className="w-8 h-8 mx-auto text-[#E5E5E5]" />
                    <p className="text-sm font-mono">No matching pieces found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(tab === 'edit' || tab === 'add') && (
            <div className="space-y-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTab('products')}
                className="text-[#6F6F6F] hover:text-[#111111] p-0 h-auto font-mono text-[11px]"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Catalog
              </Button>

              <div className="space-y-4">
                <h3 className="font-heading text-xl text-[#111111] font-bold">
                  {tab === 'edit' ? `Editing: ${editing?.name}` : 'New Atelier Creation'}
                </h3>

                {/* Image Upload Box */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#111111]" /> Product Image
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    {(uploadPreview || form.cloudinaryUrl || form.img) ? (
                      <div className="aspect-[4/5] rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#F6F6F6] relative group shadow-sm">
                        <img
                          src={uploadPreview || form.cloudinaryUrl || form.img}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/5] rounded-xl border border-dashed border-[#E5E5E5] bg-[#F6F6F6] flex flex-col items-center justify-center p-4 text-center text-[#A0A0A0]">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs font-mono">No image chosen</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="border border-dashed border-[#E5E5E5] hover:border-[#111111] rounded-xl p-5 text-center cursor-pointer bg-[#F6F6F6] hover:bg-[#EEEEEE] transition-all"
                      >
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleUpload}
                          className="hidden"
                        />
                        <Upload className="w-6 h-6 mx-auto text-[#111111] mb-2" />
                        <p className="text-xs font-heading font-bold text-[#111111]">
                          {uploading ? 'Uploading to Cloudinary...' : 'Upload Image'}
                        </p>
                        <p className="text-[10px] text-[#6F6F6F] font-mono mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[#6F6F6F] uppercase">
                          Or local / static path
                        </label>
                        <Input
                          type="text"
                          value={form.img || ''}
                          onChange={(e) => field('img', e.target.value)}
                          placeholder="/products/476025.jpg"
                          className="text-xs font-mono h-9 bg-[#F6F6F6] border-[#E5E5E5] rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name & Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                      Product Name *
                    </label>
                    <Input
                      type="text"
                      value={form.name}
                      onChange={(e) => field('name', e.target.value)}
                      placeholder="e.g. Royal Agbada — Obsidian"
                      className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                      Tag / Badge Label
                    </label>
                    <Input
                      type="text"
                      value={form.tag || ''}
                      onChange={(e) => field('tag', e.target.value)}
                      placeholder="e.g. Bespoke Ceremonial"
                      className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                    />
                  </div>
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                      Category
                    </label>
                    <select
                      value={form.cat}
                      onChange={(e) => field('cat', e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] px-4 py-2 text-sm text-[#111111] focus:border-[#111111] focus:outline-none"
                    >
                      {CATEGORIES.filter((c) => c.cat !== 'all').map((c) => (
                        <option key={c.cat} value={c.cat}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                      Price in ₦ (Empty for Bespoke)
                    </label>
                    <Input
                      type="number"
                      value={form.price ?? ''}
                      onChange={(e) => field('price', e.target.value)}
                      placeholder="e.g. 45000"
                      className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                    />
                  </div>
                </div>

                {/* Material */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                    Material / Weave Description
                  </label>
                  <Input
                    type="text"
                    value={form.mat || ''}
                    onChange={(e) => field('mat', e.target.value)}
                    placeholder="e.g. Premium Shadda weave · Hand embroidery"
                    className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                    Full Description
                  </label>
                  <Textarea
                    value={form.desc || ''}
                    onChange={(e) => field('desc', e.target.value)}
                    placeholder="Describe tailoring details, cuts, and fittings..."
                    rows={3}
                    className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                  />
                </div>

                {/* Stock & Sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                      Stock Count
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => field('stock', e.target.value)}
                      className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] font-semibold">
                      Sizes (comma-separated)
                    </label>
                    <Input
                      type="text"
                      value={form.sizes || ''}
                      onChange={(e) => field('sizes', e.target.value)}
                      placeholder="S, M, L, XL, XXL"
                      className="bg-[#F6F6F6] border-[#E5E5E5] rounded-xl"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] cursor-pointer hover:border-[#111111]">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => field('inStock', e.target.checked)}
                      className="rounded accent-[#111111] w-4 h-4"
                    />
                    <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                      Mark In Stock
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] cursor-pointer hover:border-[#111111]">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => field('featured', e.target.checked)}
                      className="rounded accent-[#111111] w-4 h-4"
                    />
                    <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                      Feature on Store
                    </span>
                  </label>
                </div>

                {saveError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    onClick={save}
                    disabled={saving}
                    className="w-full h-12 bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] shadow-md font-heading text-xs uppercase tracking-wider font-bold rounded-xl"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Saving Piece...
                      </>
                    ) : tab === 'edit' ? (
                      'Save Changes'
                    ) : (
                      'Create New Piece'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E5E5] bg-[#F6F6F6] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#6F6F6F]">
            BMY Collection &amp; Kaftan Atelier Console
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-[#6F6F6F] hover:text-red-600 font-mono text-[11px]"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
