import React, { createContext, useContext, useState, useEffect } from 'react';
import { Villa, mockVillas } from '../data/mockData';

export interface Booking {
  id: string;
  villaId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  location?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  residenceId?: string;
}

interface BookingContextType {
  villas: Villa[];
  bookings: Booking[];
  reviews: Review[];
  addBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  blockDatesManually: (villaId: string, startDate: string, endDate: string, note: string) => void;
  isDateRangeAvailable: (villaId: string, startDateStr: string, endDateStr: string) => boolean;
  getVillaBookedDates: (villaId: string) => string[]; // List of YYYY-MM-DD dates that are booked
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => Review;
  deleteReview: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Initial mock reviews
  const initialReviews: Review[] = [
    {
      id: "rev-1",
      name: "Franck A.",
      location: "Abidjan",
      rating: 5,
      comment: "Un week-end fantastique en famille. La résidence est magnifique, la propreté est irréprochable et le gestionnaire est extrêmement disponible. Nous reviendrons sans hésiter.",
      createdAt: "2026-07-28T14:32:00.000Z"
    },
    {
      id: "rev-3",
      name: "Yasmine K.",
      location: "Bouaké",
      rating: 5,
      comment: "Le système de réservation par formulaire est simple. Le gestionnaire m'a appelé par WhatsApp 15 minutes après ma soumission pour valider la caution et m'expliquer le chemin.",
      createdAt: "2026-07-30T18:45:00.000Z"
    }
  ];

  // Load initial data
  useEffect(() => {
    const storedVillas = localStorage.getItem('jacqueville_villas');
    if (storedVillas) {
      try {
        const parsed = JSON.parse(storedVillas) as Villa[];
        const synced = mockVillas.map(mockVilla => {
          const stored = parsed.find(v => v.id === mockVilla.id);
          if (stored) {
            return {
              ...stored,
              title: mockVilla.title,
              subtitle: mockVilla.subtitle,
              description: mockVilla.description,
              pricePerNight: mockVilla.pricePerNight,
              capacity: mockVilla.capacity,
              bedrooms: mockVilla.bedrooms,
              bathrooms: mockVilla.bathrooms,
              location: mockVilla.location,
              imageUrl: mockVilla.imageUrl,
              videoUrl: mockVilla.videoUrl,
              amenities: mockVilla.amenities,
              featured: mockVilla.featured,
              images: mockVilla.images
            };
          }
          return mockVilla;
        });
        setVillas(synced);
        localStorage.setItem('jacqueville_villas', JSON.stringify(synced));
      } catch (e) {
        setVillas(mockVillas);
        localStorage.setItem('jacqueville_villas', JSON.stringify(mockVillas));
      }
    } else {
      setVillas(mockVillas);
      localStorage.setItem('jacqueville_villas', JSON.stringify(mockVillas));
    }

    const storedBookings = localStorage.getItem('jacqueville_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      const initialBookings: Booking[] = [
        {
          id: "mock-b1",
          villaId: "residence-2",
          clientName: "Jean-Pierre Kouadio",
          clientEmail: "jp.kouadio@email.com",
          clientPhone: "+225 0707070707",
          startDate: getOffsetDateString(2),
          endDate: getOffsetDateString(5),
          totalPrice: 750000,
          status: 'confirmed',
          notes: "Souhaite un accueil tardif à 19h.",
          createdAt: new Date().toISOString()
        },
        {
          id: "mock-b2",
          villaId: "residence-3",
          clientName: "Marie-Claire Diallo",
          clientEmail: "mc.diallo@email.com",
          clientPhone: "+225 0505050505",
          startDate: getOffsetDateString(8),
          endDate: getOffsetDateString(12),
          totalPrice: 1120000,
          status: 'pending',
          notes: "Besoin de chaises bébé.",
          createdAt: new Date().toISOString()
        }
      ];
      setBookings(initialBookings);
      localStorage.setItem('jacqueville_bookings', JSON.stringify(initialBookings));
    }

    const storedReviews = localStorage.getItem('jacqueville_reviews');
    if (storedReviews) {
      try {
        const parsedReviews = JSON.parse(storedReviews) as Review[];
        const filtered = parsedReviews.filter(r => r.id !== 'rev-2' && !r.name.includes('Amélie C'));
        setReviews(filtered);
        localStorage.setItem('jacqueville_reviews', JSON.stringify(filtered));
      } catch (e) {
        setReviews(initialReviews);
        localStorage.setItem('jacqueville_reviews', JSON.stringify(initialReviews));
      }
    } else {
      setReviews(initialReviews);
      localStorage.setItem('jacqueville_reviews', JSON.stringify(initialReviews));
    }
  }, []);

  function getOffsetDateString(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  }

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('jacqueville_bookings', JSON.stringify(newBookings));
  };

  const isDateRangeAvailable = (villaId: string, startDateStr: string, endDateStr: string): boolean => {
    if (!startDateStr || !endDateStr) return false;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    if (start >= end) return false;

    return !bookings.some(b => {
      if (b.villaId !== villaId) return false;
      if (b.status === 'cancelled') return false;

      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);

      return start < bEnd && end > bStart;
    });
  };

  const getVillaBookedDates = (villaId: string): string[] => {
    const dates: string[] = [];
    const activeBookings = bookings.filter(b => b.villaId === villaId && b.status !== 'cancelled');

    activeBookings.forEach(b => {
      const current = new Date(b.startDate);
      const end = new Date(b.endDate);

      while (current < end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    return dates;
  };

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
    const isAvailable = isDateRangeAvailable(bookingData.villaId, bookingData.startDate, bookingData.endDate);
    if (!isAvailable) {
      throw new Error("Désolé, cette villa n'est plus disponible pour les dates sélectionnées.");
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    saveBookings(updated);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    const targetBooking = bookings.find(b => b.id === id);
    const targetVilla = targetBooking ? villas.find(v => v.id === targetBooking.villaId) : null;

    if (status === 'confirmed' && targetBooking && targetVilla) {
      console.log(`[SERVICE ENVOI EMAIL CONFIRMATION CLIENT]
      À: ${targetBooking.clientEmail}
      Objet: Confirmation de votre réservation - ${targetVilla.title} | Palm aura Jacqueville

      Bonjour ${targetBooking.clientName},

      Nous avons le plaisir de vous informer que votre demande de réservation pour la résidence "${targetVilla.title}" à Jacqueville a été CONFIRMÉE avec succès par le gestionnaire !

      Détails de votre séjour :
      - Résidence : ${targetVilla.title}
      - Dates : Du ${targetBooking.startDate} au ${targetBooking.endDate}
      - Montant total : ${targetBooking.totalPrice.toLocaleString()} FCFA
      - Emplacement : ${targetVilla.location}

      Le gestionnaire prendra contact avec vous incessamment au ${targetBooking.clientPhone} ou via WhatsApp au +225 01 72 70 70 00 pour finaliser le dépôt de garantie et préparer votre arrivée.

      Cordialement,
      L'équipe Palm aura Jacqueville
      yirekouassi@gmail.com
      `);
    }

    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status };
      }
      return b;
    });
    saveBookings(updated);
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    saveBookings(updated);
  };

  const blockDatesManually = (villaId: string, startDate: string, endDate: string, note: string) => {
    const newBlock: Booking = {
      id: `block-${Date.now()}`,
      villaId,
      clientName: "Maintenance / Blocage Admin",
      clientEmail: "admin@residences.com",
      clientPhone: "N/A",
      startDate,
      endDate,
      totalPrice: 0,
      status: 'confirmed',
      notes: note,
      createdAt: new Date().toISOString()
    };
    saveBookings([newBlock, ...bookings]);
  };

  // Add a review
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>): Review => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('jacqueville_reviews', JSON.stringify(updated));
    return newReview;
  };

  // Delete a review
  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem('jacqueville_reviews', JSON.stringify(updated));
  };

  return (
    <BookingContext.Provider value={{
      villas,
      bookings,
      reviews,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      blockDatesManually,
      isDateRangeAvailable,
      getVillaBookedDates,
      addReview,
      deleteReview
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
