import { useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Calendar, Check, ChevronLeft, ChevronRight, Copy, Fuel, Gauge, Phone } from 'lucide-react';
import { SiTelegram } from 'react-icons/si';
import { SEO } from '@/components/SEO';
import { useCars, useCarsReady } from '@/data/cars';

const formatPrice = (price: number) => `${price.toLocaleString('cs-CZ')} Kč`;
const formatMileage = (mileage: number) => `${mileage.toLocaleString('cs-CZ')} km`;

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const cars = useCars();
  const ready = useCarsReady();
  const car = cars.find(item => String(item.id) === id);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const photos = car ? [...new Set([car.image, ...(car.images ?? [])].filter(Boolean))] : [];
  const photo = photos[photoIndex] ?? photos[0];
  const path = `/vozy/${id}`;

  useEffect(() => {
    setPhotoIndex(0);
    setCopyState('idle');
  }, [id]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  }

  if (!ready) {
    return (
      <div className="flex-1 min-h-[70vh] pt-36 text-center text-gray-600" role="status">
        Načítáme nabídku vozů…
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center px-6 text-center pt-24">
        <SEO title="Vůz nenalezen" description="Tento vůz již není v nabídce Platinum Cars." canonical={path} noIndex />
        <h1 className="font-heading text-4xl md:text-6xl text-black mb-4">Vůz již není v nabídce</h1>
        <p className="text-gray-600 mb-8">Odkaz možná není aktuální. Podívejte se na ostatní vozy.</p>
        <Link href="/vozy" className="rounded-lg bg-primary px-6 py-3 font-bold text-white hover:bg-[#152d52]">
          Zobrazit nabídku vozů
        </Link>
      </div>
    );
  }

  const title = `${car.brand} ${car.model}`;
  const details = [
    { label: 'Rok výroby', value: car.year, icon: <Calendar size={18} /> },
    { label: 'Nájezd', value: formatMileage(car.mileage), icon: <Gauge size={18} /> },
    { label: 'Palivo', value: car.fuel, icon: <Fuel size={18} /> },
    { label: 'Převodovka', value: car.gearbox },
    { label: 'Karoserie', value: car.bodyType },
    ...(car.power ? [{ label: 'Výkon', value: `${car.power} kW` }] : []),
    ...(car.color ? [{ label: 'Barva', value: car.color }] : []),
  ];

  return (
    <div className="flex-1 bg-[#F7F7F7] pt-[100px] pb-20">
      <SEO
        title={title}
        description={`${title} (${car.year}) – ${formatPrice(car.price)}. ${formatMileage(car.mileage)}, ${car.fuel}, ${car.gearbox}. Auta na všechny prachy – Platinum Cars, Praha-Čakovice.`}
        canonical={`${window.location.origin}${path}`}
        image={car.image && !car.image.startsWith('data:') ? new URL(car.image, window.location.origin).href : undefined}
        breadcrumbs={[{ name: 'Nabídka vozů', item: '/vozy' }, { name: title, item: path }]}
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <Link href="/vozy" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-5">
          <ArrowLeft size={18} /> Zpět na nabídku vozů
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">{car.brand} · {car.year}</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-none text-black">{title}</h1>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-primary whitespace-nowrap">{formatPrice(car.price)}</p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] gap-6">
          <div className="min-w-0">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-gray-200 rounded-xl overflow-hidden">
              {photo ? (
                <img src={photo} alt={`${title} – fotografie ${photoIndex + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">Fotografie není k dispozici</div>
              )}
              {car.tag && <span className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-xs font-bold text-white uppercase">{car.tag}</span>}
              {photos.length > 1 && (
                <>
                  <button type="button" onClick={() => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)} aria-label="Předchozí fotka" className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"><ChevronLeft size={22} /></button>
                  <button type="button" onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)} aria-label="Další fotka" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"><ChevronRight size={22} /></button>
                  <span className="absolute right-4 bottom-4 rounded-full bg-black/65 px-3 py-1 text-xs text-white">{photoIndex + 1} / {photos.length}</span>
                </>
              )}
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {photos.map((src, index) => (
                  <button type="button" key={src} onClick={() => setPhotoIndex(index)} aria-label={`Zobrazit fotku ${index + 1}`} className={`w-20 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${index === photoIndex ? 'border-primary' : 'border-transparent'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {car.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mt-5">
                <h2 className="font-heading text-2xl mb-3 text-black">O VOZE</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{car.description}</p>
              </div>
            )}
          </div>

          <aside className="min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
              <h2 className="font-heading text-2xl text-black mb-5">PARAMETRY VOZU</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                {details.map(({ label, value, icon }) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs text-gray-500 flex gap-1.5 items-center mb-1">{icon}{label}</dt>
                    <dd className="font-bold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-gray-100 mt-6 pt-6 grid gap-3">
                <a href="tel:+420777876406" className="w-full py-3.5 rounded-lg bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-[#152d52]"><Phone size={18} /> Zavolat: +420 777 876 406</a>
                <a href="https://t.me/autonavse" target="_blank" rel="noreferrer" className="w-full py-3.5 rounded-lg bg-[#0088cc]/10 text-[#0088cc] font-bold flex items-center justify-center gap-2 hover:bg-[#0088cc]/20"><SiTelegram size={18} /> Telegram</a>
                <button type="button" onClick={copyLink} className="w-full py-3.5 rounded-lg border border-gray-200 text-primary font-bold flex items-center justify-center gap-2 hover:bg-gray-50">
                  {copyState === 'copied' ? <Check size={18} /> : <Copy size={18} />}
                  {copyState === 'copied' ? 'Odkaz zkopírován' : 'Kopírovat odkaz na vůz'}
                </button>
                {copyState === 'error' && (
                  <label className="text-sm text-gray-600">
                    Kopírování se nezdařilo. Zkopírujte odkaz ručně:
                    <input readOnly onFocus={e => e.target.select()} value={window.location.href} className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-xs text-black" />
                  </label>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}