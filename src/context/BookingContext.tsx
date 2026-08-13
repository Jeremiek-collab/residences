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
  advancePaid?: number; // Advance payment amount in FCFA
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
  updateBookingPricing: (id: string, totalPrice: number, advancePaid: number) => void;
  deleteBooking: (id: string) => void;
  blockDatesManually: (villaId: string, startDate: string, endDate: string, note: string) => void;
  isDateRangeAvailable: (villaId: string, startDateStr: string, endDateStr: string) => boolean;
  getVillaBookedDates: (villaId: string) => string[]; // List of YYYY-MM-DD dates that are booked
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => Review;
  deleteReview: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// MASTER SINGLE CENTRAL DATABASE ENDPOINT shared across all phones, tablets, and computers worldwide
const MASTER_CLOUD_DB_URL = "https://jsonblob.com/api/jsonBlob/019ff313-3e9a-716a-a522-cc225022ab36";

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

  // Helper to save full list to both local storage and cloud database (fallback)
  const saveBookings = async (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('jacqueville_bookings', JSON.stringify(newBookings));
    
    try {
      await fetch('/api/bookings', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBookings)
      });
    } catch (err) {
      try {
        await fetch(MASTER_CLOUD_DB_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBookings)
        });
      } catch (e) {}
    }
  };

  // Helper to fetch live bookings from master central database
  const loadCloudBookings = async () => {
    try {
      let res = await fetch('/api/bookings', { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(MASTER_CLOUD_DB_URL, {
          headers: { "Accept": "application/json" },
          cache: "no-store"
        });
      }

      if (res.ok) {
        const cloudData: Booking[] = await res.json();
        if (Array.isArray(cloudData)) {
          const validCloud = cloudData.filter(b => b && typeof b === 'object' && b.id);

          // Read local cache from localStorage
          const stored = localStorage.getItem('jacqueville_bookings');
          let localList: Booking[] = [];
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                localList = parsed.filter(b => b && typeof b === 'object' && b.id);
              }
            } catch (e) {}
          }

          // Union merge validCloud and localList by unique id
          const map = new Map<string, Booking>();
          validCloud.forEach(b => map.set(b.id, b));
          localList.forEach(b => {
            if (b && b.id) {
              if (!map.has(b.id)) {
                map.set(b.id, b);
              } else {
                const existing = map.get(b.id)!;
                map.set(b.id, { ...existing, ...b });
              }
            }
          });

          const merged = Array.from(map.values());
          setBookings(merged);
          localStorage.setItem('jacqueville_bookings', JSON.stringify(merged));
        }
      }
    } catch (e) {
      console.warn("Erreur d'accès à la base de données cloud centrale (mode hors-ligne):", e);
    }
  };

  // Load initial data & auto-sync from master cloud in real time (every 3 seconds)
  useEffect(() => {
    localStorage.removeItem('jacqueville_blob_url');

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

    // 2. Load Bookings (first local cache, then live master cloud)
    const storedBookings = localStorage.getItem('jacqueville_bookings');
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {}
    }
    loadCloudBookings();

    // Auto-refresh from master cloud every 3 seconds so all devices stay 100% synchronized in real time
    const intervalId = setInterval(loadCloudBookings, 3000);

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
      advancePaid: bookingData.advancePaid ?? 0,
      id: `booking-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('jacqueville_bookings', JSON.stringify(updated));

    // Send ATOMIC POST add request to Vercel serverless API (prevents inter-device overwrites!)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', booking: newBooking })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
          localStorage.setItem('jacqueville_bookings', JSON.stringify(data.bookings));
        }
      } else {
        await saveBookings(updated);
      }
    } catch (e) {
      await saveBookings(updated);
    }

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    const updated = bookings.map(b => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    localStorage.setItem('jacqueville_bookings', JSON.stringify(updated));

    // Send ATOMIC update request to API
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', bookingId: id, status })
    }).catch(() => saveBookings(updated));
  };

  const updateBookingPricing = (id: string, totalPrice: number, advancePaid: number) => {
    const updated = bookings.map(b => (b.id === id ? { ...b, totalPrice, advancePaid } : b));
    setBookings(updated);
    localStorage.setItem('jacqueville_bookings', JSON.stringify(updated));

    // Send ATOMIC update request to API
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', bookingId: id, totalPrice, advancePaid })
    }).catch(() => saveBookings(updated));
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('jacqueville_bookings', JSON.stringify(updated));

    // Send ATOMIC delete request to API
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', bookingId: id })
    }).catch(() => saveBookings(updated));
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
      advancePaid: 0,
      status: 'confirmed',
      notes: note,
      createdAt: new Date().toISOString()
    };
    addBooking(newBlock);
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
      updateBookingPricing,
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
