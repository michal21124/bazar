import React, { useState, useRef } from 'react';
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
  images: [],
  tag: '',
  power: undefined,
  color: '',
  description: '',
});

// ─── Image compression ────────────────────────────────────────────────────────

function compressFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // 800px max — fits car cards well, keeps base64 ~60-100KB per photo
        const MAX = 800;
        const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject;
      img.src = src;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Image upload to Netlify Blobs (production only) ─────────────────────────

async function uploadToStorage(dataUrl: string): Promise<string> {
  if (import.meta.env.DEV) return dataUrl; // dev: keep base64 locally
  const token = import.meta.env.VITE_ADMIN_PASSWORD ?? '';
  try {
    const res = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ dataUrl }),
    });
    if (!res.ok) return dataUrl; // fallback: keep base64 if upload failed
    const { url } = await res.json() as { url: string };
    return url;
  } catch {
    return dataUrl; // fallback
  }
}

// ─── Autocomplete data ────────────────────────────────────────────────────────

const CAR_BRANDS = [
  'Alfa Romeo','Audi','BMW','Citroën','Dacia','Fiat','Ford','Honda',
  'Hyundai','Infiniti','Jaguar','Jeep','Kia','Land Rover','Lexus',
  'Mazda','Mercedes-Benz','Mitsubishi','Nissan','Opel','Peugeot',
  'Porsche','Renault','Saab','Seat','Škoda','Subaru','Suzuki',
  'Toyota','Volkswagen','Volvo',
];

const CAR_MODELS: Record<string, string[]> = {
  'Škoda':        ['Octavia','Fabia','Superb','Kodiaq','Karoq','Kamiq','Scala','Enyaq'],
  'Volkswagen':   ['Golf','Passat','Tiguan','Polo','T-Roc','T-Cross','Touareg','Arteon','ID.4'],
  'BMW':          ['Řada 1','Řada 2','Řada 3','Řada 4','Řada 5','X1','X3','X5','iX3'],
  'Audi':         ['A3','A4','A5','A6','Q3','Q5','Q7','e-tron'],
  'Mercedes-Benz':['A-Class','C-Class','E-Class','GLA','GLC','GLE'],
  'Ford':         ['Focus','Fiesta','Mondeo','Kuga','Puma','EcoSport','Mustang','Mustang Mach-E'],
  'Toyota':       ['Yaris','Corolla','RAV4','C-HR','Camry','Hilux','Aygo'],
  'Hyundai':      ['i20','i30','Tucson','Santa Fe','Kona','i10'],
  'Kia':          ['Ceed','Sportage','Sorento','Stonic','Niro','EV6'],
  'Peugeot':      ['208','308','508','2008','3008','5008'],
  'Renault':      ['Clio','Megane','Kadjar','Captur','Duster','Zoe'],
  'Opel':         ['Astra','Corsa','Insignia','Crossland','Grandland'],
  'Seat':         ['Ibiza','Leon','Ateca','Arona','Tarraco'],
  'Dacia':        ['Sandero','Duster','Logan','Jogger'],
  'Volvo':        ['V40','V60','V90','XC40','XC60','XC90'],
  'Mazda':        ['Mazda2','Mazda3','Mazda6','CX-3','CX-5','CX-30','MX-5'],
  'Honda':        ['Civic','Jazz','CR-V','HR-V','e'],
  'Nissan':       ['Micra','Juke','Qashqai','X-Trail','Leaf','Navara'],
  'Subaru':       ['Impreza','Outback','Forester','XV','BRZ'],
  'Mitsubishi':   ['ASX','Outlander','Eclipse Cross','L200'],
  'Fiat':         ['500','Punto','Tipo','Panda','Bravo'],
  'Citroën':      ['C3','C4','C5 Aircross','Berlingo'],
  'Jeep':         ['Renegade','Compass','Cherokee','Wrangler'],
  'Land Rover':   ['Discovery','Defender','Range Rover','Freelander'],
  'Porsche':      ['Cayenne','Macan','Panamera','911','Taycan'],
};

const CAR_COLORS = [
  'Černá','Bílá','Šedá','Stříbrná','Modrá','Tmavě modrá','Červená',
  'Zelená','Béžová','Hnědá','Zlatá','Oranžová','Žlutá','Fialová','Granátová',
];

// ─── Shared form UI (MUST be module-level — not inside a component) ────────────

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3664] bg-white text-gray-900';
const selectCls = inputCls + ' appearance-none pr-8';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1B3664] mb-4">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Správa inzerce</h1>
          <p className="text-slate-400 text-sm mt-1"><span className="font-brand text-xs tracking-[0.04em]">Platinum Cars</span> · Admin Panel</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heslo</label>
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
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  // All images as array (merge image + images, deduplicate)
  const allImages: string[] = (() => {
    const imgs = form.images && form.images.length > 0 ? form.images : [];
    if (form.image && !imgs.includes(form.image)) return [form.image, ...imgs];
    return imgs;
  })();

  const setImages = (imgs: string[]) => {
    setForm(f => ({ ...f, image: imgs[0] ?? '', images: imgs }));
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      // 1. Compress locally for preview
      const compressed = await Promise.all(files.map(compressFile));
      // 2. Show thumbnails immediately (base64 preview)
      setImages([...allImages, ...compressed].slice(0, 10));
      // 3. In production: upload each to Netlify Blobs → replace base64 with URL
      if (!import.meta.env.DEV) {
        const urls = await Promise.all(compressed.map(uploadToStorage));
        // Replace the just-added base64 entries with their server URLs
        setForm(f => {
          const current = f.images ?? [];
          const kept = current.slice(0, current.length - compressed.length);
          const next = [...kept, ...urls].slice(0, 10);
          return { ...f, image: next[0] ?? '', images: next };
        });
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setImages(allImages.filter((_, i) => i !== idx));
  };

  const moveFirst = (idx: number) => {
    if (idx === 0) return;
    const next = [...allImages];
    next.splice(0, 0, next.splice(idx, 1)[0]);
    setImages(next);
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

  const modelSuggestions = CAR_MODELS[form.brand] ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — full-screen sheet on mobile, centered card on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white w-full sm:rounded-2xl sm:max-w-2xl sm:max-h-[90vh] max-h-[92vh] flex flex-col rounded-t-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900 text-base">
            {isEdit ? 'Upravit inzerát' : 'Přidat nový vůz'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-5">
          <div className="space-y-4">

            {/* Images */}
            <Field label={`Fotografie (${allImages.length}/10)`}>
              {/* URL input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={allImages.length === 0 ? (form.image.startsWith('data:') ? '' : form.image) : ''}
                  onChange={e => {
                    const val = e.target.value.trim();
                    if (val) setImages([val]);
                    else setImages([]);
                  }}
                  placeholder="https://... (URL fotografie)"
                  className={inputCls}
                  disabled={allImages.length >= 10}
                />
              </div>

              {/* Upload button */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading || allImages.length >= 10}
                  className="flex items-center gap-2 text-xs text-[#1B3664] border border-[#1B3664] rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={13} />
                  {uploading ? 'Nahrávání…' : 'Nahrát fotky'}
                </button>
                <span className="text-xs text-gray-400">lze vybrat více najednou (max 10)</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

              {/* Thumbnails */}
              {allImages.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {allImages.map((src, idx) => (
                    <div key={idx} className="relative group flex-shrink-0">
                      <img
                        src={src}
                        alt={`foto ${idx + 1}`}
                        className={`w-20 h-14 object-cover rounded-lg border-2 transition-all ${idx === 0 ? 'border-[#1B3664]' : 'border-gray-200 opacity-80 group-hover:opacity-100'}`}
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-0.5 left-0.5 text-[9px] font-bold bg-[#1B3664] text-white px-1 rounded leading-tight">
                          COVER
                        </span>
                      )}
                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      >
                        <X size={10} />
                      </button>
                      {/* Set as cover */}
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveFirst(idx)}
                          className="absolute bottom-0.5 left-0.5 text-[9px] font-semibold bg-black/60 hover:bg-[#1B3664] text-white px-1 rounded leading-tight opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          cover
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Add more slot */}
                  {allImages.length < 10 && (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-20 h-14 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#1B3664] flex items-center justify-center text-gray-400 hover:text-[#1B3664] transition-colors flex-shrink-0"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              )}
            </Field>

            {/* Brand + Model */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Značka" required>
                <input
                  type="text" value={form.brand}
                  onChange={e => set('brand', e.target.value)}
                  placeholder="Škoda, BMW..."
                  list="dl-brands"
                  required className={inputCls}
                />
              </Field>
              <Field label="Model" required>
                <input
                  type="text" value={form.model}
                  onChange={e => set('model', e.target.value)}
                  placeholder="Octavia 2.0 TDI"
                  list="dl-models"
                  required className={inputCls}
                />
              </Field>
            </div>

            {/* Datalists */}
            <datalist id="dl-brands">
              {CAR_BRANDS.map(b => <option key={b} value={b} />)}
            </datalist>
            <datalist id="dl-models">
              {modelSuggestions.length > 0
                ? modelSuggestions.map(m => <option key={m} value={m} />)
                : Object.values(CAR_MODELS).flat().map((m, i) => <option key={i} value={m} />)
              }
            </datalist>
            <datalist id="dl-colors">
              {CAR_COLORS.map(c => <option key={c} value={c} />)}
            </datalist>

            {/* Price + Year */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cena (Kč)" required>
                <input
                  type="number" min={0} step={1000}
                  value={form.price || ''}
                  onChange={e => set('price', Number(e.target.value))}
                  placeholder="450 000"
                  required className={inputCls}
                />
              </Field>
              <Field label="Rok výroby" required>
                <input
                  type="number" min={1990} max={new Date().getFullYear()}
                  value={form.year || ''}
                  onChange={e => set('year', Number(e.target.value))}
                  required className={inputCls}
                />
              </Field>
            </div>

            {/* Mileage + Power */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nájezd (km)" required>
                <input
                  type="number" min={0} step={1000}
                  value={form.mileage || ''}
                  onChange={e => set('mileage', Number(e.target.value))}
                  placeholder="80 000"
                  required className={inputCls}
                />
              </Field>
              <Field label="Výkon (kW)">
                <input
                  type="number" min={0}
                  value={form.power ?? ''}
                  onChange={e => set('power', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="110"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Fuel + Gearbox */}
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Body + Color */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Karoserie" required>
                <SelectWrapper>
                  <select value={form.bodyType} onChange={e => set('bodyType', e.target.value as CarType['bodyType'])} className={selectCls}>
                    {BODY_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </SelectWrapper>
              </Field>
              <Field label="Barva">
                <input
                  type="text"
                  value={form.color ?? ''}
                  onChange={e => set('color', e.target.value)}
                  placeholder="Šedá, Černá..."
                  list="dl-colors"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Tag */}
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
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-2xl flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Zrušit
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-2.5 text-sm font-semibold bg-[#1B3664] hover:bg-[#152d52] text-white rounded-xl transition-colors flex items-center justify-center gap-2"
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl p-6 w-full sm:max-w-sm"
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
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            Smazat
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Car card (mobile) ────────────────────────────────────────────────────────

function CarCard({
  car,
  onEdit,
  onDelete,
}: { car: CarType; onEdit: () => void; onDelete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex"
    >
      {/* Photo */}
      <div className="w-24 h-full min-h-[80px] flex-shrink-0 bg-gray-100">
        {car.image ? (
          <img src={car.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={22} className="text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 px-3 py-2.5 flex flex-col justify-between gap-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {car.brand} {car.model}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {car.year} · {car.mileage.toLocaleString('cs-CZ')} km
              </p>
            </div>
            {car.tag && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${tagColor[car.tag] ?? 'bg-gray-100 text-gray-600'}`}>
                {car.tag}
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-[#1B3664] mt-1">
            {car.price.toLocaleString('cs-CZ')} Kč
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#1B3664] border border-gray-200 hover:border-[#1B3664] rounded-lg px-3 py-1.5 transition-colors"
          >
            <Pencil size={12} /> Upravit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 hover:border-red-300 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Car row (desktop table) ──────────────────────────────────────────────────

function CarRow({
  car,
  index,
  onEdit,
  onDelete,
}: { car: CarType; index: number; onEdit: () => void; onDelete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.15 }}
      className={`grid grid-cols-[72px_1fr_80px_110px_110px_90px_120px] gap-3 items-center px-5 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-0`}
    >
      <div className="w-16 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {car.image ? (
          <img src={car.image} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={18} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{car.brand}</p>
        <p className="text-xs text-gray-500 truncate">{car.model}</p>
      </div>

      <span className="text-sm text-gray-700">{car.year}</span>
      <span className="text-sm text-gray-700">{car.mileage.toLocaleString('cs-CZ')} km</span>
      <span className="text-sm font-semibold text-gray-900">{car.price.toLocaleString('cs-CZ')} Kč</span>

      <div>
        {car.tag ? (
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${tagColor[car.tag] ?? 'bg-gray-100 text-gray-600'}`}>
            {car.tag}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#1B3664] border border-gray-200 hover:border-[#1B3664] rounded-lg px-3 py-1.5 transition-colors"
        >
          <Pencil size={12} /> Upravit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 hover:border-red-300 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
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
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 bg-[#1B3664] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1B3664] rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-brand text-[11px] tracking-[0.02em] text-gray-900 leading-tight truncate">Platinum Cars</p>
              <p className="text-gray-400 text-xs hidden sm:block">Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-[#1B3664] border border-gray-200 rounded-lg p-2 hover:border-[#1B3664] transition-colors"
              title="Zobrazit web"
            >
              <Eye size={15} />
            </a>
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg p-2 hover:border-red-300 transition-colors"
              title="Odhlásit se"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

        {/* Page title + Add button */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">Správa vozidel</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Přidávejte, upravujte a mažte inzeráty</p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-[#1B3664] hover:bg-[#152d52] text-white font-semibold rounded-xl px-4 sm:px-5 py-2.5 text-sm transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Přidat vůz</span>
            <span className="sm:hidden">Přidat</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {[
            { label: 'Celkem vozidel', value: stats.total, icon: Car, color: 'bg-blue-50 text-blue-600' },
            { label: 'Se štítkem', value: stats.withTag, icon: BarChart3, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Premium', value: stats.premium, icon: ShieldCheck, color: 'bg-purple-50 text-purple-600' },
            { label: 'Průměrná cena', value: stats.avgPrice.toLocaleString('cs-CZ') + ' Kč', icon: BarChart3, color: 'bg-emerald-50 text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 truncate">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Hledat značku nebo model..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3664]"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-sm text-gray-400">{filtered.length} vozidel</span>
              {!resetConfirm ? (
                <button
                  onClick={() => setResetConfirm(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-orange-300 transition-colors whitespace-nowrap"
                >
                  <RotateCcw size={13} /> Obnovit výchozí
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                  <span className="text-xs text-orange-700">Opravdu?</span>
                  <button onClick={handleReset} className="text-xs font-semibold text-orange-600 hover:text-orange-800">Ano</button>
                  <button onClick={() => setResetConfirm(false)} className="text-xs text-gray-500">Ne</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Car size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Žádná vozidla nenalezena</p>
          </div>
        )}

        {/* Mobile: cards */}
        <div className="flex flex-col gap-3 sm:hidden">
          <AnimatePresence initial={false}>
            {filtered.map(car => (
              <CarCard
                key={car.id}
                car={car}
                onEdit={() => setEditCar(car)}
                onDelete={() => setDeletingCar(car)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length > 0 && (
            <div className="grid grid-cols-[72px_1fr_80px_110px_110px_90px_120px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Foto</span>
              <span>Vozidlo</span>
              <span>Rok</span>
              <span>Nájezd</span>
              <span>Cena</span>
              <span>Štítek</span>
              <span className="text-right">Akce</span>
            </div>
          )}
          <AnimatePresence initial={false}>
            {filtered.map((car, i) => (
              <CarRow
                key={car.id}
                car={car}
                index={i}
                onEdit={() => setEditCar(car)}
                onDelete={() => setDeletingCar(car)}
              />
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
