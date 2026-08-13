import React from 'react';
import { Villa } from '../data/mockData';
import { Bed, Bath, ArrowRight } from 'lucide-react';

interface VillaCardProps {
  villa: Villa;
  onSelect: (id: string) => void;
}

export const VillaCard: React.FC<VillaCardProps> = ({ villa, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full border border-sand-100 group cursor-pointer"
      onClick={() => onSelect(villa.id)}
    >
      {/* Visual Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-85 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {villa.featured && (
          <span className="absolute top-4 left-4 z-20 bg-azure-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
            Favori
          </span>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-sm text-right">
          <span className="text-xs text-navy-500 block uppercase font-medium">Par nuitée</span>
          <span className="font-serif text-lg font-bold text-azure-600">
            {villa.pricePerNight.toLocaleString()} FCFA
          </span>
        </div>

        {/* Villa Image with self-healing cache-bypass onError handler */}
        <img 
          src={villa.imageUrl} 
          alt={villa.title} 
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.retried) {
              target.dataset.retried = 'true';
              target.src = `${villa.imageUrl.split('?')[0]}?cacheBust=${Date.now()}`;
            }
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-azure-500 uppercase tracking-widest mb-1.5">
          {villa.location}
        </span>
        <h3 className="font-serif text-xl font-bold text-navy-900 group-hover:text-azure-600 transition-colors duration-200 mb-2">
          {villa.title}
        </h3>
        <p className="text-sm text-navy-600 line-clamp-2 leading-relaxed mb-4">
          {villa.description}
        </p>

        {/* Bed / Bath specs */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-sand-100 text-navy-500 text-xs font-medium mb-4">
          <div className="flex items-center space-x-1.5">
            <Bed className="w-4 h-4 text-azure-500 shrink-0" />
            <span>{villa.bedrooms} Chambre</span>
          </div>
          <div className="flex items-center space-x-1.5 justify-end">
            <Bath className="w-4 h-4 text-azure-500 shrink-0" />
            <span>{villa.bathrooms} SDB</span>
          </div>
        </div>

        {/* Amenities top list */}
        <div className="flex flex-wrap gap-1.5 mb-6 flex-grow items-start">
          {villa.amenities.slice(0, 3).map((amenity, idx) => (
            <span 
              key={idx} 
              className="text-[10px] bg-sand-50 text-navy-600 px-2.5 py-1 rounded-md border border-sand-100 font-medium"
            >
              {amenity}
            </span>
          ))}
          {villa.amenities.length > 3 && (
            <span className="text-[10px] text-navy-400 px-1 py-1 font-medium">
              +{villa.amenities.length - 3} plus
            </span>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex items-center justify-between text-sm font-semibold text-azure-600 group-hover:text-azure-500 transition-colors mt-auto">
          <span>Découvrir la villa</span>
          <div className="w-8 h-8 rounded-full bg-azure-50 group-hover:bg-azure-600 group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
