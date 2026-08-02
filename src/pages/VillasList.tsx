import React from 'react';
import { useBookings } from '../context/BookingContext';
import { VillaCard } from '../components/VillaCard';

interface VillasListProps {
  setCurrentPage: (page: string) => void;
  setSelectedVillaId: (id: string | null) => void;
}

export const VillasList: React.FC<VillasListProps> = ({ setCurrentPage, setSelectedVillaId }) => {
  const { villas } = useBookings();

  const selectVilla = (id: string) => {
    setSelectedVillaId(id);
    setCurrentPage('details');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Header */}
      <div className="mb-16 text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-[#c5a880] uppercase tracking-widest block font-sans">Notre Catalogue</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy-950 leading-tight">Nos Demeures d'Exception</h1>
        <div className="w-16 h-[1px] bg-[#c5a880] mx-auto mt-4"></div>
        <p className="text-navy-600 text-sm sm:text-base font-light font-sans pt-2">
          Découvrez notre collection exclusive de résidences d'exception pour un séjour inoubliable à Jacqueville.
        </p>
      </div>

      {/* Villas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {villas.map((villa) => (
          <VillaCard
            key={villa.id}
            villa={villa}
            onSelect={selectVilla}
          />
        ))}
      </div>
    </div>
  );
};
