import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Fuel, Settings2 } from 'lucide-react';
import { Link } from 'wouter';
import { getCarPath, getListingId, type Car } from '@/data/cars';

const formatPrice = (price: number) => price.toLocaleString('cs-CZ') + ' Kč';

const getBadgeColor = (tag?: string) => {
  switch (tag) {
    case 'Novinka': return 'bg-blue-600 text-white';
    case 'Top Stav': return 'bg-emerald-600 text-white';
    case 'Doporučujeme': return 'bg-primary text-white';
    default: return 'bg-gray-800 text-white';
  }
};

export function CarCard({ car, index }: { car: Car, index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden"
    >
      {/* Image Area */}
      <Link href={getCarPath(car)} className="relative h-[220px] overflow-hidden bg-gray-100 flex-shrink-0 block" aria-label={`Detail vozu ${car.brand} ${car.model}`}>
        <img 
          src={car.image} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Badge */}
        {car.tag && (
          <div className={`absolute top-4 left-4 z-10 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${getBadgeColor(car.tag)}`}>
            {car.tag}
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col bg-white">
        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{car.brand}</div>
        <h4 className="text-xl font-semibold text-black leading-tight mb-1 line-clamp-1"><Link href={getCarPath(car)} className="hover:text-primary">{car.model}</Link></h4>
        <p className="text-xs text-gray-500 mb-3">ID inzerátu: <span className="font-semibold text-gray-700">{getListingId(car)}</span></p>
        
        <div className="mb-5">
          <div className="text-2xl font-bold text-primary tracking-tight">{formatPrice(car.price)}</div>
        </div>
        
        {/* Specs Row */}
        <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400" size={16} />
            <span className="text-sm font-medium text-gray-600">{car.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings2 className="text-gray-400" size={16} />
            <span className="text-sm font-medium text-gray-600">{car.mileage.toLocaleString('cs-CZ')} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="text-gray-400" size={16} />
            <span className="text-sm font-medium text-gray-600">{car.fuel}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={getCarPath(car)} className="w-full flex items-center justify-center py-3 bg-primary text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[#152d52] transition-colors">
          Detail vozu
        </Link>
      </div>
    </motion.div>
  );
}
