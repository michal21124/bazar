import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, LogOut, Car, ShieldCheck, Eye, EyeOff,
  RotateCcw, Upload, X, Check, AlertTriangle, ChevronDown,
  BarChart3, Search,
} from 'lucide-react';
import {
  Car as CarType,
  useCars,
  addCar,
  updateCar,
  deleteCar,
  resetToDefaults,
  FUEL_OPTIONS,
  GEARBOX_OPTIONS,
  BODY_OPTIONS,
  TAG_OPTIONS,
} from '@/data/cars';

// ─── Password ─────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? '';
const SESSION_KEY = 'pc_admin_auth';

// ─── Badge colors ──────────────────────────────────────────────────────────────

const tagColor: Record<string, string> = {
  Novinka:      'bg-blue-100 text-blue-700',
  'Top Stav':   'bg-emerald-100 text-emerald-700',
  Doporučujeme: 'bg-indigo-100 text-indigo-700',
  Premium:      'bg-purple-100 text-purple-700',
};

// ─── Empty form ───────────────────────────────────────────────────────────────

const emptyForm = (): Omit<CarType, 'id'> => ({
  brand: '',
  model: '',
  price: 0,
  year: new Date().getFullYear(),
  mileage: 0,
  fuel: 'Nafta',
  gearbox: 'Automat',
  bodyType: 'SUV',
  image: '',
  tag: '',
  power: undefined,
  color: '',
  description: '',
});

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onLogin();
    } else {
      setError('Nesprávné heslo. Zkuste to prosím znovu.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1929] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1B3664] mb-4">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Správa inzerce</h1>
          <p className="text-slate-400 text-sm mt-1">Platinum Cars · Admin Panel</p>
        </div>

        {/* Card */}
        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Heslo
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Zadejte heslo..."
                autoComplete="current-password"
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3664] text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle size={13} /> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1B3664] hover:bg-[#152d52] text-white font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            Přihlásit se
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}

// ─── Car Form Modal ───────────────────────────────────────────────────────────

function CarFormModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: CarType;
  onSave: (data: Omit<CarType, 'id'>) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<Omit<CarType, 'id'>>(
    initial ? { ...initial } : emptyForm()
  );
  const [previewError, setPreviewError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Compress to max 800px wide, quality 0.8
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        const ratio = Math.min(1, MAX / img.width);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        set('image', dataUrl);
        setPreviewError(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.model.trim()) return;
    onSave({
      ...form,
      price: Number(form.price),
      year: Number(form.year),
      mileage: Number(form.mileage),
      power: form.power ? Number(form.power) : undefined,
      tag: form.tag || undefined,
    });
  };

  const Field = ({
    label, required, children,
  }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3664] bg-white text-gray-900';
  const selectCls = inputCls + ' appearance-none pr-8';

  const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
      {children}
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">
            {isEdit ? 'Upravit inzerát' : 'Přidat nový vůz'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5">
          <div className="space-y-5">

            {/* Image */}
            <Field label="Fotografie">
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.image.startsWith('data:') ? '' : form.image}
                    onChange={e => { set('image', e.target.value); setPreviewError(false); }}
                    placeholder="https://... (URL fotografie)"
                    className={inputCls}
                  />
                  <p className="text-xs text-gray-400 mt-1">nebo</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 text-xs text-[#1B3664] border border-[#1B3664] rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors mt-1"
                  >
                    <Upload size={13} /> Nahrát ze zařízení
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>
                {/* Preview */}
                <div className="w-28 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0">
                  {form.image && !previewError ? (
                    <img
                      src={form.image}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car size={24} className="text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            </Field>

            {/* Brand + Model */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Značka" required>
                <input
                  type="text"
                  value={form.brand}
                  onChange={e => set('brand', e.target.value)}
                  placeholder="Škoda, BMW..."
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Model" required>
                <input
                  type="text"
                  value={form.model}
                  onChange={e => set('model', e.target.value)}
                  placeholder="Octavia 2.0 TDI"
                  required
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Price + Year + Mileage */}
            <div className="grid grid-cols-3 gap-4">
              <Field label="Cena (Kč)" required>
                <input
                  type="number" min={0} step={1000}
                  value={form.price || ''}
                  onChange={e => set('price', Number(e.target.value))}
                  placeholder="450 000"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Rok výroby" required>
                <input
                  type="number" min={1990} max={new Date().getFullYear()}
                  value={form.year || ''}
                  onChange={e => set('year', Number(e.target.value))}
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Nájezd (km)" required>
                <input
                  type="number" min={0} step={1000}
                  value={form.mileage || ''}
                  onChange={e => set('mileage', Number(e.target.value))}
                  placeholder="80 000"
                  required
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Fuel + Gearbox + Body */}
            <div className="grid grid-cols-3 gap-4">
              <Field label="Palivo" required>
                <SelectWrapper>
                  <select value={form.fuel} onChange={e => set('fuel', e.target.value as CarType['fuel'])} className={selectCls}>
                    {FUEL_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </SelectWrapper>
              </Field>
              <Field label="Převodovka" required>
                <SelectWrapper>
                  <select value={form.gearbox} onChange={e => set('gearbox', e.target.value as CarType['gearbox'])} className={selectCls}>
                    {GEARBOX_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </SelectWrapper>
              </Field>
              <Field label="Karoserie" required>
                <SelectWrapper>
                  <select value={form.bodyType} onChange={e => set('bodyType', e.target.value as CarType['bodyType'])} className={selectCls}>
                    {BODY_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </SelectWrapper>
              </Field>
            </div>

            {/* Power + Color + Tag */}
            <div className="grid grid-cols-3 gap-4">
              <Field label="Výkon (kW)">
                <input
                  type="number" min={0}
                  value={form.power ?? ''}
                  onChange={e => set('power', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="110"
                  className={inputCls}
                />
              </Field>
              <Field label="Barva">
                <input
                  type="text"
                  value={form.color ?? ''}
                  onChange={e => set('color', e.target.value)}
                  placeholder="Šedá, Černá..."
                  className={inputCls}
                />
              </Field>
              <Field label="Štítek">
                <SelectWrapper>
                  <select
                    value={form.tag ?? ''}
                    onChange={e => set('tag', e.target.value)}
                    className={selectCls}
                  >
                    <option value="">— bez štítku —</option>
                    {TAG_OPTIONS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </SelectWrapper>
              </Field>
            </div>

            {/* Description */}
            <Field label="Popis (volitelné)">
              <textarea
                rows={3}
                value={form.description ?? ''}
                onChange={e => set('description', e.target.value)}
                placeholder="Krátký popis vozu pro zákazníky..."
                className={inputCls + ' resize-none'}
              />
            </Field>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
            Zrušit
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-semibold bg-[#1B3664] hover:bg-[#152d52] text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <Check size={15} />
            {isEdit ? 'Uložit změny' : 'Přidat vůz'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete confirm dialog ────────────────────────────────────────────────────

function DeleteDialog({
  car,
  onConfirm,
  onClose,
}: { car: CarType; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Smazat inzerát</h3>
            <p className="text-sm text-gray-500 mt-1">
              Opravdu chcete smazat <span className="font-semibold text-gray-700">{car.brand} {car.model}</span>? Tato akce je nevratná.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            Smazat
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const cars = useCars();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editCar, setEditCar] = useState<CarType | null>(null);
  const [deletingCar, setDeletingCar] = useState<CarType | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = (data: Omit<CarType, 'id'>) => {
    addCar(data);
    setAddOpen(false);
    showToast('Vůz byl úspěšně přidán ✓');
  };

  const handleUpdate = (data: Omit<CarType, 'id'>) => {
    if (!editCar) return;
    updateCar({ ...data, id: editCar.id });
    setEditCar(null);
    showToast('Inzerát byl aktualizován ✓');
  };

  const handleDelete = () => {
    if (!deletingCar) return;
    deleteCar(deletingCar.id);
    setDeletingCar(null);
    showToast('Inzerát byl smazán');
  };

  const handleReset = () => {
    resetToDefaults();
    setResetConfirm(false);
    showToast('Databáze byla obnovena na výchozí data');
  };

  const filtered = cars.filter(c =>
    `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: cars.length,
    withTag: cars.filter(c => c.tag).length,
    premium: cars.filter(c => c.tag === 'Premium').length,
    avgPrice: cars.length ? Math.round(cars.reduce((s, c) => s + c.price, 0) / cars.length) : 0,
  };

  return (
    <div className="min-h-screen bg-[#f0f4fa] font-sans">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-[#1B3664] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2"
          >
            <Check size={15} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {addOpen && <CarFormModal onSave={handleAdd} onClose={() => setAddOpen(false)} />}
        {editCar && <CarFormModal initial={editCar} onSave={handleUpdate} onClose={() => setEditCar(null)} />}
        {deletingCar && <DeleteDialog car={deletingCar} onConfirm={handleDelete} onClose={() => setDeletingCar(null)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1B3664] rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">Platinum Cars</span>
              <span className="text-gray-400 text-xs ml-2">/ Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-500 hover:text-[#1B3664] flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 hover:border-[#1B3664] transition-colors"
            >
              <Eye size={13} /> Zobrazit web
            </a>
            <button
              onClick={onLogout}
              className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 hover:border-red-300 transition-colors"
            >
              <LogOut size={13} /> Odhlásit se
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">Správa vozidel</h1>
            <p className="text-sm text-gray-500 mt-0.5">Přidávejte, upravujte a mažte inzeráty</p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-[#1B3664] hover:bg-[#152d52] text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors shadow-sm"
          >
            <Plus size={16} /> Přidat vůz
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Celkem vozidel', value: stats.total, icon: Car, color: 'bg-blue-50 text-blue-600' },
            { label: 'Se štítkem', value: stats.withTag, icon: BarChart3, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Premium', value: stats.premium, icon: ShieldCheck, color: 'bg-purple-50 text-purple-600' },
            { label: 'Průměrná cena', value: stats.avgPrice.toLocaleString('cs-CZ') + ' Kč', icon: BarChart3, color: 'bg-emerald-50 text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Hledat značku nebo model..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3664]"
            />
          </div>
          <span className="text-sm text-gray-400">{filtered.length} vozidel</span>
          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-orange-300 transition-colors"
            >
              <RotateCcw size={13} /> Obnovit výchozí
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
              <span className="text-xs text-orange-700">Opravdu obnovit?</span>
              <button onClick={handleReset} className="text-xs font-semibold text-orange-600 hover:text-orange-800">Ano</button>
              <button onClick={() => setResetConfirm(false)} className="text-xs text-gray-500">Ne</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[80px_1fr_90px_110px_100px_90px_120px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Foto</span>
            <span>Vozidlo</span>
            <span>Rok</span>
            <span>Nájezd</span>
            <span>Cena</span>
            <span>Štítek</span>
            <span className="text-right">Akce</span>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <Car size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Žádná vozidla nenalezena</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className={`grid grid-cols-[80px_1fr_90px_110px_100px_90px_120px] gap-4 items-center px-5 py-3.5 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-0`}
              >
                {/* Image */}
                <div className="w-16 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {car.image ? (
                    <img src={car.image} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car size={18} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Brand + model */}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{car.brand}</p>
                  <p className="text-xs text-gray-500 truncate">{car.model}</p>
                </div>

                <span className="text-sm text-gray-700">{car.year}</span>
                <span className="text-sm text-gray-700">{car.mileage.toLocaleString('cs-CZ')} km</span>
                <span className="text-sm font-semibold text-gray-900">{car.price.toLocaleString('cs-CZ')} Kč</span>

                {/* Tag */}
                <div>
                  {car.tag ? (
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${tagColor[car.tag] ?? 'bg-gray-100 text-gray-600'}`}>
                      {car.tag}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditCar(car)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#1B3664] border border-gray-200 hover:border-[#1B3664] rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <Pencil size={12} /> Upravit
                  </button>
                  <button
                    onClick={() => setDeletingCar(car)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 hover:border-red-300 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  return (
    <>
      <Helmet>
        <title>Admin | Platinum Cars</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {!authed
        ? <LoginScreen onLogin={() => setAuthed(true)} />
        : <AdminDashboard onLogout={handleLogout} />
      }
    </>
  );
}
