import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Phone, Calendar, Settings2, Fuel, X, ChevronDown, ChevronUp, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SiTelegram } from 'react-icons/si';
import * as Dialog from '@radix-ui/react-dialog';
import { useCars, type Car } from '@/data/cars';
import { SEO } from '@/components/SEO';

// ─── Constants ────────────────────────────────────────────────────────────────

const formatPrice = (p: number) => p.toLocaleString('cs-CZ') + ' Kč';
const formatMileage = (m: number) => m.toLocaleString('cs-CZ') + ' km';

const FUELS    = ['Benzín', 'Nafta', 'Hybrid', 'Elektro'] as const;
const BODIES   = ['SUV', 'Sedan', 'Kombi', 'Hatchback', 'Kupé', 'Minivan'] as const;
const TAGS     = ['Doporučujeme', 'Novinka', 'Top Stav', 'Premium'];
const MILEAGE_OPTIONS = [
  { label: 'Libovolný', value: Infinity },
  { label: 'do 30 000 km', value: 30000 },
  { label: 'do 50 000 km', value: 50000 },
  { label: 'do 80 000 km', value: 80000 },
  { label: 'do 120 000 km', value: 120000 },
  { label: 'do 150 000 km', value: 150000 },
];
const YEAR_OPTIONS = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
const SORT_OPTIONS = [
  { value: 'price-asc',     label: 'Cena: od nejlevnějšího' },
  { value: 'price-desc',    label: 'Cena: od nejdražšího' },
  { value: 'year-desc',     label: 'Rok: od nejnovějšího' },
  { value: 'mileage-asc',   label: 'Nájezd: od nejmenšího' },
];

// ─── Initial state ────────────────────────────────────────────────────────────

type Filters = {
  search: string;
  brands: string[];
  priceMin: string;
  priceMax: string;
  yearFrom: string;
  yearTo: string;
  mileageMax: number;
  fuels: string[];
  bodyTypes: string[];
  gearbox: string;
  tags: string[];
};

const DEFAULT_FILTERS: Filters = {
  search: '',
  brands: [],
  priceMin: '',
  priceMax: '',
  yearFrom: '',
  yearTo: '',
  mileageMax: Infinity,
  fuels: [],
  bodyTypes: [],
  gearbox: '',
  tags: [],
};

// ─── Badge color ──────────────────────────────────────────────────────────────

const getBadgeClass = (tag?: string) => {
  switch (tag) {
    case 'Novinka':      return 'bg-blue-600 text-white';
    case 'Top Stav':     return 'bg-emerald-600 text-white';
    case 'Doporučujeme': return 'bg-primary text-white';
    case 'Premium':      return 'bg-[#7c3aed] text-white';
    default:             return 'bg-gray-800 text-white';
  }
};

// ─── Sidebar section wrapper ──────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <span className="text-sm font-bold text-black uppercase tracking-wide">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────

function CheckRow({
  label, checked, count, onChange,
}: { label: string; checked: boolean; count?: number; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1">
      <div
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
          checked ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'
        }`}
        onClick={onChange}
      >
        {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span className="text-sm text-gray-700 group-hover:text-black transition-colors flex-1" onClick={onChange}>{label}</span>
      {count !== undefined && <span className="text-xs text-gray-400">({count})</span>}
    </label>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CarsPage() {
  const allCars = useCars(); // reactive — updates when admin adds/edits/deletes
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('price-asc');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Dynamic brand list derived from current inventory
  const BRANDS = useMemo(() => Array.from(new Set(allCars.map(c => c.brand))).sort(), [allCars]);

  // Reset gallery index when switching between cars
  useEffect(() => { setActiveImgIdx(0); }, [selectedCar?.id]);

  const set = useCallback(<K extends keyof Filters>(key: K, val: Filters[K]) =>
    setFilters(f => ({ ...f, [key]: val })), []);

  const toggleArr = useCallback(<K extends keyof Filters>(key: K, val: string) =>
    setFilters(f => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    }), []);

  const resetFilters = () => { setFilters(DEFAULT_FILTERS); setSortBy('price-asc'); };

  // ── Filtered & sorted cars ────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let r = allCars.filter(car => {
      if (filters.search && !`${car.brand} ${car.model}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.brands.length && !filters.brands.includes(car.brand)) return false;
      if (filters.priceMin && car.price < Number(filters.priceMin.replace(/\s/g, ''))) return false;
      if (filters.priceMax && car.price > Number(filters.priceMax.replace(/\s/g, ''))) return false;
      if (filters.yearFrom && car.year < Number(filters.yearFrom)) return false;
      if (filters.yearTo && car.year > Number(filters.yearTo)) return false;
      if (filters.mileageMax !== Infinity && car.mileage > filters.mileageMax) return false;
      if (filters.fuels.length && !filters.fuels.includes(car.fuel)) return false;
      if (filters.bodyTypes.length && !filters.bodyTypes.includes(car.bodyType)) return false;
      if (filters.gearbox && car.gearbox !== filters.gearbox) return false;
      if (filters.tags.length && (!car.tag || !filters.tags.includes(car.tag))) return false;
      return true;
    });
    r.sort((a, b) => {
      if (sortBy === 'price-asc')   return a.price - b.price;
      if (sortBy === 'price-desc')  return b.price - a.price;
      if (sortBy === 'year-desc')   return b.year - a.year;
      if (sortBy === 'mileage-asc') return a.mileage - b.mileage;
      return 0;
    });
    return r;
  }, [allCars, filters, sortBy]);

  // Count helpers for checkboxes
  const countWith = (key: keyof Car, val: string) =>
    allCars.filter(c => String(c[key]) === val).length;
  const countTag = (tag: string) =>
    allCars.filter(c => c.tag === tag).length;

  // Active filter count (for mobile badge)
  const activeCount = [
    filters.brands.length, filters.fuels.length, filters.bodyTypes.length,
    filters.tags.length, filters.gearbox ? 1 : 0,
    filters.priceMin ? 1 : 0, filters.priceMax ? 1 : 0,
    filters.yearFrom ? 1 : 0, filters.yearTo ? 1 : 0,
    filters.mileageMax !== Infinity ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Active chips for display
  const activeChips: { label: string; clear: () => void }[] = [
    ...filters.brands.map(b => ({ label: b, clear: () => toggleArr('brands', b) })),
    ...filters.fuels.map(f => ({ label: f, clear: () => toggleArr('fuels', f) })),
    ...filters.bodyTypes.map(b => ({ label: b, clear: () => toggleArr('bodyTypes', b) })),
    ...filters.tags.map(t => ({ label: t, clear: () => toggleArr('tags', t) })),
    ...(filters.gearbox ? [{ label: filters.gearbox, clear: () => set('gearbox', '') }] : []),
    ...(filters.priceMin ? [{ label: `od ${Number(filters.priceMin).toLocaleString('cs-CZ')} Kč`, clear: () => set('priceMin', '') }] : []),
    ...(filters.priceMax ? [{ label: `do ${Number(filters.priceMax).toLocaleString('cs-CZ')} Kč`, clear: () => set('priceMax', '') }] : []),
    ...(filters.yearFrom ? [{ label: `rok od ${filters.yearFrom}`, clear: () => set('yearFrom', '') }] : []),
    ...(filters.yearTo ? [{ label: `rok do ${filters.yearTo}`, clear: () => set('yearTo', '') }] : []),
    ...(filters.mileageMax !== Infinity ? [{ label: `do ${filters.mileageMax.toLocaleString('cs-CZ')} km`, clear: () => set('mileageMax', Infinity) }] : []),
  ];

  // ── Sidebar JSX ───────────────────────────────────────────────────────────

  const Sidebar = (
    <aside className="w-full lg:w-[260px] flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

        {/* Search inside sidebar */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Značka nebo model..."
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tags / Nabídka vozů */}
        <Section title="Nabídka vozů">
          {TAGS.map(tag => (
            <CheckRow
              key={tag}
              label={tag}
              checked={filters.tags.includes(tag)}
              count={countTag(tag)}
              onChange={() => toggleArr('tags', tag)}
            />
          ))}
        </Section>

        {/* Brand */}
        <Section title="Značka">
          <div className="space-y-0.5">
            {BRANDS.map(brand => (
              <CheckRow
                key={brand}
                label={brand}
                checked={filters.brands.includes(brand)}
                count={countWith('brand', brand)}
                onChange={() => toggleArr('brands', brand)}
              />
            ))}
          </div>
        </Section>

        {/* Price */}
        <Section title="Cena">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Od Kč"
              value={filters.priceMin}
              onChange={e => set('priceMin', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-gray-400 text-sm flex-shrink-0">—</span>
            <input
              type="number"
              placeholder="Do Kč"
              value={filters.priceMax}
              onChange={e => set('priceMax', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </Section>

        {/* Year */}
        <Section title="Rok výroby">
          <div className="flex gap-2 items-center">
            <select
              value={filters.yearFrom}
              onChange={e => set('yearFrom', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">Od roku</option>
              {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="text-gray-400 flex-shrink-0">—</span>
            <select
              value={filters.yearTo}
              onChange={e => set('yearTo', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">Do roku</option>
              {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </Section>

        {/* Mileage */}
        <Section title="Stav tachometru">
          <div className="flex flex-col gap-1">
            {MILEAGE_OPTIONS.map(opt => (
              <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                <div
                  className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                    filters.mileageMax === opt.value ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'
                  }`}
                  onClick={() => set('mileageMax', opt.value)}
                >
                  {filters.mileageMax === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-black transition-colors" onClick={() => set('mileageMax', opt.value)}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Fuel */}
        <Section title="Palivo">
          {FUELS.map(f => (
            <CheckRow
              key={f}
              label={f}
              checked={filters.fuels.includes(f)}
              count={countWith('fuel', f)}
              onChange={() => toggleArr('fuels', f)}
            />
          ))}
        </Section>

        {/* Body type / Karoserie */}
        <Section title="Karoserie">
          {BODIES.map(b => (
            <CheckRow
              key={b}
              label={b}
              checked={filters.bodyTypes.includes(b)}
              count={countWith('bodyType', b)}
              onChange={() => toggleArr('bodyTypes', b)}
            />
          ))}
        </Section>

        {/* Gearbox */}
        <Section title="Převodovka">
          {['Automat', 'Manuál'].map(g => (
            <label key={g} className="flex items-center gap-2.5 cursor-pointer group py-1">
              <div
                className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                  filters.gearbox === g ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'
                }`}
                onClick={() => set('gearbox', filters.gearbox === g ? '' : g)}
              >
                {filters.gearbox === g && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-black transition-colors" onClick={() => set('gearbox', filters.gearbox === g ? '' : g)}>
                {g}
              </span>
              <span className="text-xs text-gray-400">({countWith('gearbox', g)})</span>
            </label>
          ))}
        </Section>

        {/* Reset */}
        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors mt-2"
          >
            <RotateCcw size={14} />
            Zrušit filtry ({activeCount})
          </button>
        )}
      </div>
    </aside>
  );

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="flex-1 w-full bg-[#F7F7F7] flex flex-col pt-[88px] min-h-screen">
      <SEO
        title="Nabídka vozů"
        description={`Prohlédněte si naši aktuální nabídku ${allCars.length} ojetých vozů. SUV, sedany, kombi a hatchbacky prémiových značek — BMW, Audi, Mercedes, Škoda, Volkswagen a další.`}
        canonical="/vozy"
        breadcrumbs={[{ name: 'Nabídka vozů', item: '/vozy' }]}
      />

      {/* Top banner */}
      <div className="bg-primary text-white py-14">
        <div className="container mx-auto px-6">
          <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">Domů / Vozy na prodej</div>
          <h1 className="font-heading text-6xl md:text-7xl font-black uppercase leading-none">NABÍDKA VOZŮ</h1>
          <p className="text-white/80 mt-2 text-sm">{allCars.length} vozů v nabídce</p>
        </div>
      </div>

      {/* Brand quick-select strip */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => set('brands', [])}
            className={`flex-none px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
              filters.brands.length === 0
                ? 'bg-primary border-primary text-white'
                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary bg-white'
            }`}
          >
            Všechny značky
          </button>
          {BRANDS.map(brand => (
            <button
              key={brand}
              onClick={() => toggleArr('brands', brand)}
              className={`flex-none px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                filters.brands.includes(brand)
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary bg-white'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-6 py-8 flex gap-8 items-start">

        {/* Sidebar desktop */}
        <div className="hidden lg:block sticky top-[88px]">
          {Sidebar}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Toolbar: results count + sort + mobile filter toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filtry
                {activeCount > 0 && (
                  <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
              <p className="text-sm text-gray-500">
                Nalezeno <span className="font-bold text-black">{filtered.length}</span> vozů
              </p>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeChips.map((chip, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20"
                >
                  {chip.label}
                  <button onClick={chip.clear} className="hover:text-primary/60 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-gray-500 hover:text-primary transition-colors"
              >
                <RotateCcw size={12} /> Zrušit vše
              </button>
            </div>
          )}

          {/* Car grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-20 text-center">
              <p className="text-xl font-medium text-gray-500 mb-4">Nenalezeny žádné vozy</p>
              <button onClick={resetFilters} className="text-primary font-bold hover:underline">
                Zrušit filtry
              </button>
            </div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((car, index) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
                    onClick={() => setSelectedCar(car)}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-[200px] bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {car.tag && (
                        <div className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow ${getBadgeClass(car.tag)}`}>
                          {car.tag}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">{car.brand}</div>
                      <h3 className="text-base font-bold text-black leading-snug mb-1 line-clamp-2">{car.model}</h3>

                      {/* Specs row */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar size={12} />{car.year}</span>
                        <span className="flex items-center gap-1"><Settings2 size={12} />{formatMileage(car.mileage)}</span>
                        <span className="flex items-center gap-1"><Fuel size={12} />{car.fuel}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">{car.bodyType}</span>
                        <span className="text-gray-500">{car.gearbox}</span>
                      </div>

                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
                        <div>
                          <div className="text-xl font-black text-black">{formatPrice(car.price)}</div>
                          {car.power && <div className="text-xs text-gray-400">{car.power} kW · {car.color}</div>}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedCar(car); }}
                          className="px-3 py-1.5 bg-primary text-white text-xs font-bold uppercase rounded-lg hover:bg-[#152d52] transition-colors"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[70] lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#F7F7F7] z-[80] overflow-y-auto shadow-2xl p-4 pt-14"
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center"
              >
                <X size={18} />
              </button>
              <h2 className="font-heading text-2xl font-black uppercase text-black mb-4">Filtrovat</h2>
              {Sidebar}
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full mt-2 py-3 bg-primary text-white font-bold rounded-xl uppercase tracking-wide"
              >
                Zobrazit {filtered.length} vozů
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <Dialog.Root open={!!selectedCar} onOpenChange={open => !open && setSelectedCar(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-200" />
          {/* Mobile: full-screen sheet | Desktop: centered modal */}
          <Dialog.Content className="fixed inset-0 z-[60] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl md:p-4 focus:outline-none">
            {selectedCar && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="relative bg-white h-full flex flex-col md:flex-row md:h-auto md:rounded-2xl md:overflow-hidden md:shadow-2xl md:max-h-[90vh]"
              >
                {/* ── Mobile sticky top bar ── */}
                <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
                  <div className="min-w-0 pr-3">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">{selectedCar.brand}</div>
                    <div className="font-heading text-[15px] font-black uppercase leading-tight truncate text-black">{selectedCar.model}</div>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="flex-shrink-0 w-10 h-10 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center text-gray-700 transition-colors"
                      aria-label="Zavřít"
                    >
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>

                {/* ── Image + Gallery ── */}
                {(() => {
                  const gallery = selectedCar.images && selectedCar.images.length > 1
                    ? selectedCar.images
                    : [selectedCar.image];
                  const activeImg = gallery[activeImgIdx] ?? gallery[0];
                  const hasManyPhotos = gallery.length > 1;
                  const goPrev = () => setActiveImgIdx(i => (i - 1 + gallery.length) % gallery.length);
                  const goNext = () => setActiveImgIdx(i => (i + 1) % gallery.length);
                  return (
                    <div className="flex-shrink-0 w-full md:w-[55%] flex flex-col">
                      {/* Main photo — swipeable */}
                      <div
                        className="relative bg-gray-100 h-[240px] md:h-auto md:flex-1 md:min-h-[340px] select-none"
                        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
                        onTouchEnd={e => {
                          if (touchStartX.current === null || !hasManyPhotos) return;
                          const delta = e.changedTouches[0].clientX - touchStartX.current;
                          if (Math.abs(delta) > 40) delta < 0 ? goNext() : goPrev();
                          touchStartX.current = null;
                        }}
                      >
                        <img src={activeImg} alt={selectedCar.model} className="w-full h-full object-cover pointer-events-none" />
                        {selectedCar.tag && (
                          <div className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getBadgeClass(selectedCar.tag)}`}>
                            {selectedCar.tag}
                          </div>
                        )}
                        {hasManyPhotos && (
                          <>
                            <button
                              onClick={goPrev}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition-colors shadow"
                              aria-label="Předchozí fotka"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              onClick={goNext}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition-colors shadow"
                              aria-label="Další fotka"
                            >
                              <ChevronRight size={20} />
                            </button>
                            <div className="absolute bottom-2 right-2 text-[11px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full">
                              {activeImgIdx + 1} / {gallery.length}
                            </div>
                          </>
                        )}
                      </div>
                      {/* Thumbnails */}
                      {hasManyPhotos && (
                        <div className="flex gap-1 p-1.5 bg-gray-900 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
                          {gallery.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImgIdx(i)}
                              className={`flex-none w-14 h-10 rounded overflow-hidden border-2 transition-all ${i === activeImgIdx ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                              <img src={img} alt={`Fotka ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* ── Info panel ── */}
                <div className="flex-1 md:w-[45%] p-5 md:p-7 flex flex-col overflow-y-auto">
                  {/* Desktop title (hidden on mobile — shown in sticky bar) */}
                  <div className="hidden md:block">
                    <div className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{selectedCar.brand}</div>
                    <h3 className="font-heading text-3xl md:text-4xl font-black text-black mb-5 uppercase leading-tight">{selectedCar.model}</h3>
                  </div>

                  <div className="text-2xl md:text-3xl font-black text-black mb-5 pb-5 border-b border-gray-100">
                    {formatPrice(selectedCar.price)}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-5 text-sm">
                    {[
                      { icon: <Calendar size={14} />, label: 'Rok výroby', val: selectedCar.year },
                      { icon: <Settings2 size={14} />, label: 'Nájezd', val: formatMileage(selectedCar.mileage) },
                      { icon: <Fuel size={14} />, label: 'Palivo', val: selectedCar.fuel },
                      { label: 'Převodovka', val: selectedCar.gearbox },
                      { label: 'Karoserie', val: selectedCar.bodyType },
                      ...(selectedCar.power ? [{ label: 'Výkon', val: `${selectedCar.power} kW` }] : []),
                      ...(selectedCar.color ? [{ label: 'Barva', val: selectedCar.color }] : []),
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                          {item.icon}{item.label}
                        </div>
                        <div className="text-sm md:text-base font-bold text-black">{item.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {selectedCar.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-5 pb-5 border-b border-gray-100">
                      {selectedCar.description}
                    </p>
                  )}

                  {/* CTA buttons */}
                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <a
                      href="tel:+420777876406"
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold uppercase tracking-wider rounded-xl hover:bg-[#152d52] transition-colors text-sm"
                    >
                      <Phone size={18} /> Zavolat: +420 777 876 406
                    </a>
                    <a
                      href="https://t.me/autonavse"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white font-bold uppercase tracking-wider rounded-xl transition-colors text-sm"
                    >
                      <SiTelegram size={18} /> Telegram
                    </a>
                  </div>
                </div>

                {/* Desktop close button */}
                <Dialog.Close className="hidden md:flex absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full items-center justify-center text-gray-600 hover:text-black shadow transition-all z-10">
                  <X size={18} />
                </Dialog.Close>
              </motion.div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
