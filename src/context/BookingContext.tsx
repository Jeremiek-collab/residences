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

const CLOUD_DB_URL = "https://jsonblob.com/api/jsonBlob/019fd1bb-06cd-709d-994e-711dccb80e79";

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

  // Helper to fetch live cloud bookings
  const loadCloudBookings = async () => {
    try {
      const res = await fetch(CLOUD_DB_URL, {
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData)) {
          setBookings(cloudData);
          localStorage.setItem('jacqueville_bookings', JSON.stringify(cloudData));
        }
      }
    } catch (e) {
      console.warn("Utilisation des données locales pour les réservations (hors-ligne).", e);
    }
  };

  // Helper to save bookings to both local storage and cloud database
  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('jacqueville_bookings', JSON.stringify(newBookings));
    
    // Sync to cloud asynchronously
    fetch(CLOUD_DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBookings)
    }).catch(err => console.warn("Erreur de sauvegarde cloud:", err));
  };

  // Load initial data & auto-sync from cloud in real time
  useEffect(() => {
    // 1. Load Villas
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

    // 2. Load Bookings (first local cache, then live cloud)
    const storedBookings = localStorage.getItem('jacqueville_bookings');
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {}
    }
    loadCloudBookings();

    // Auto-refresh from cloud every 10 seconds so new bookings from clients appear live
    const intervalId = setInterval(loadCloudBookings, 10000);

    // 3. Load Reviews
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

    return () => clearInterval(intervalId);
  }, []);

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
