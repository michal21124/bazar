import { useState, useEffect } from 'react';

// ─── Type ──────────────────────────────────────────────────────────────────────

export type Car = {
  id: number;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel: 'Benzín' | 'Nafta' | 'Hybrid' | 'Elektro';
  gearbox: 'Automat' | 'Manuál';
  bodyType: 'SUV' | 'Sedan' | 'Kombi' | 'Hatchback' | 'Kupé' | 'Minivan';
  image: string;
  images?: string[];   // optional gallery (multiple photos)
  tag?: string;
  power?: number; // kW
  color?: string;
  description?: string;
};

// ─── Default seed data ────────────────────────────────────────────────────────

export const DEFAULT_CARS: Car[] = [
  {
    id: 1, brand: 'Volkswagen', model: 'Passat B7 2.0 TDI DSG', price: 175000,
    year: 2011, mileage: 238000, fuel: 'Nafta', gearbox: 'Automat', bodyType: 'Kombi',
    image: '/passat-b7-1.jpg',
    images: [
      '/passat-b7-1.jpg',
      '/passat-b7-2.jpg',
      '/passat-b7-3.jpg',
      '/passat-b7-4.jpg',
      '/passat-b7-5.jpg',
      '/passat-b7-6.jpg',
      '/passat-b7-7.jpg',
      '/passat-b7-8.jpg',
      '/passat-b7-9.jpg',
      '/passat-b7-10.jpg',
    ],
    power: 103, color: 'Hnědá',
    description: 'Velmi zachovalý a komfortní Volkswagen Passat B7 Variant s spolehlivým 2.0 TDI motorem (103 kW / 140 k.s.) a automatickou převodovkou DSG. Bohatá výbava: panoramatická střecha, kamera couvaní, parktronik 360°, koženo-alcantarový interiér, vyhřívaná přední sedadla, dvouzónová klimatizace, multivolant, bixenónové světlomety, LED denní světla, originální alu kola R17, elektrická okna a zrcátka. Ideální pro každodenní provoz i dálkové cesty.',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

export const FUEL_OPTIONS    = ['Benzín', 'Nafta', 'Hybrid', 'Elektro'] as const;
export const GEARBOX_OPTIONS = ['Automat', 'Manuál'] as const;
export const BODY_OPTIONS    = ['SUV', 'Sedan', 'Kombi', 'Hatchback', 'Kupé', 'Minivan'] as const;
export const TAG_OPTIONS     = ['', 'Doporučujeme', 'Novinka', 'Top Stav', 'Premium'] as const;

// ─── Environment ──────────────────────────────────────────────────────────────

// In dev (Replit), use localStorage only.
// In production (Netlify), sync with /api/cars serverless function.
const IS_DEV = import.meta.env.DEV;
const API_URL = '/api/cars';
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_PASSWORD ?? '';

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = 'platinum_cars_v4'; // bumped: removed all old placeholder images

function loadFromStorage(): Car[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Car[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_CARS;
}

function saveToStorage(cars: Car[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  } catch { /* storage quota exceeded */ }
}

// ─── API helpers (production only) ───────────────────────────────────────────

/** Fire-and-forget: push current cars array to Netlify Blobs via serverless fn */
function syncToAPI(cars: Car[]): void {
  if (IS_DEV) return;
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': ADMIN_TOKEN,
    },
    body: JSON.stringify(cars),
  }).catch(() => {/* silent fail — localStorage still holds data */});
}

let _apiInitialized = false;

/** On first mount in production: fetch from API and overwrite localStorage */
async function initFromAPI(): Promise<void> {
  if (IS_DEV || _apiInitialized) return;
  _apiInitialized = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return;
    const apiCars: Car[] = await res.json();
    if (Array.isArray(apiCars) && apiCars.length > 0) {
      _cars = apiCars;
      saveToStorage(_cars);
      broadcast();
    }
  } catch { /* fallback to localStorage */ }
}

// ─── Singleton store ──────────────────────────────────────────────────────────

let _cars: Car[] = loadFromStorage();
const _listeners = new Set<() => void>();

function broadcast() {
  _listeners.forEach(fn => fn());
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function addCar(car: Omit<Car, 'id'>): Car {
  const newCar: Car = { ...car, id: Date.now() };
  _cars = [newCar, ..._cars];
  saveToStorage(_cars);
  broadcast();
  syncToAPI(_cars);
  return newCar;
}

export function updateCar(car: Car): void {
  _cars = _cars.map(c => (c.id === car.id ? car : c));
  saveToStorage(_cars);
  broadcast();
  syncToAPI(_cars);
}

export function deleteCar(id: number): void {
  _cars = _cars.filter(c => c.id !== id);
  saveToStorage(_cars);
  broadcast();
  syncToAPI(_cars);
}

export function resetToDefaults(): void {
  _cars = [...DEFAULT_CARS];
  saveToStorage(_cars);
  broadcast();
  syncToAPI(_cars);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

let _initPromise: Promise<void> | null = null;

export function useCars(): Car[] {
  const [cars, setCars] = useState<Car[]>(() => _cars);

  useEffect(() => {
    // On production: load from Netlify Blobs once (shared across all visitors)
    if (!_initPromise) {
      _initPromise = initFromAPI();
    }

    // Cross-tab sync (localStorage events from other tabs)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        _cars = loadFromStorage();
        setCars([..._cars]);
      }
    };
    window.addEventListener('storage', onStorage);

    const fn = () => setCars([..._cars]);
    _listeners.add(fn);

    return () => {
      _listeners.delete(fn);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return cars;
}
