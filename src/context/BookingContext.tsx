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

interface BookingContextType {
  villas: Villa[];
  bookings: Booking[];
  addBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  blockDatesManually: (villaId: string, startDate: string, endDate: string, note: string) => void;
  isDateRangeAvailable: (villaId: string, startDateStr: string, endDateStr: string) => boolean;
  getVillaBookedDates: (villaId: string) => string[]; // List of YYYY-MM-DD dates that are booked
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load initial data
  useEffect(() => {
    const storedVillas = localStorage.getItem('jacqueville_villas');
    if (storedVillas) {
      try {
        const parsed = JSON.parse(storedVillas) as Villa[];
        // Sync static fields from mockVillas to ensure edits in mockData.ts are applied instantly
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
      // Mock some initial bookings to make it look active
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
  }, []);

  // Helper helper to get date strings relative to today
  function getOffsetDateString(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  }

  // Save to localStorage when changed
  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('jacqueville_bookings', JSON.stringify(newBookings));
  };

  // Check if a date range is available
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

      // Overlap condition
      // A booking overlaps if the requested start date is before the booking's end date 
      // AND the requested end date is after the booking's start date.
      return start < bEnd && end > bStart;
    });
  };

  // Get array of all YYYY-MM-DD date strings that are blocked for a villa
  const getVillaBookedDates = (villaId: string): string[] => {
    const dates: string[] = [];
    const activeBookings = bookings.filter(b => b.villaId === villaId && b.status !== 'cancelled');

    activeBookings.forEach(b => {
      const current = new Date(b.startDate);
      const end = new Date(b.endDate);

      // Add all dates between start_date and end_date (exclusive of end_date for check-out day, or inclusive depending on model)
      // Usually, check-out day is available for check-in of another client, so we include dates up to end_date - 1.
      while (current < end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    return dates;
  };

  // Add booking
  const addBooking = async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
    // Double check availability
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

    // Simulate sending email to manager
    const targetVilla = villas.find(v => v.id === bookingData.villaId);
    console.log(`[EMAIL MANAGER SYSTEM]
    De: reservations@palmaura.ci
    À: yirekouassi@gmail.com
    Objet: Nouvelle demande de réservation - ${targetVilla?.title}

    Bonjour,
    Une nouvelle demande de réservation a été soumise pour la villa "${targetVilla?.title}".

    Détails du client :
    - Nom : ${bookingData.clientName}
    - Téléphone : ${bookingData.clientPhone}
    - Email : ${bookingData.clientEmail}

    Détails du séjour :
    - Dates : Du ${bookingData.startDate} au ${bookingData.endDate}
    - Prix total : ${bookingData.totalPrice.toLocaleString()} FCFA
    - Message client : ${bookingData.notes || 'Aucun message.'}

    Veuillez vous connecter à l'espace Admin pour valider ou rejeter cette demande.
    `);

    return newBooking;
  };

  // Update status (Confirm, Cancel, etc.)
  const updateBookingStatus = (id: string, status: Booking['status']) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        // Send simulated email on status change
        const villaName = villas.find(v => v.id === b.villaId)?.title || "votre villa";
        if (status === 'confirmed') {
          console.log(`[EMAIL CLIENT SYSTEM]
          À: ${b.clientEmail}
          Objet: Confirmation de votre réservation - ${villaName}

          Bonjour ${b.clientName},
          Nous avons le plaisir de vous informer que votre demande de réservation pour la "${villaName}" du ${b.startDate} au ${b.endDate} a été confirmée par le gestionnaire !
          
          Le gestionnaire prendra contact avec vous sous peu au ${b.clientPhone} pour finaliser les modalités de paiement.
          `);
        } else if (status === 'cancelled') {
          console.log(`[EMAIL CLIENT SYSTEM]
          À: ${b.clientEmail}
          Objet: Annulation de votre demande de réservation - ${villaName}

          Bonjour ${b.clientName},
          Nous regrettons de vous informer que votre demande de réservation pour la "${villaName}" du ${b.startDate} au ${b.endDate} n'a pas pu être validée.
          `);
        }
        return { ...b, status };
      }
      return b;
    });
    saveBookings(updated);
  };

  // Delete booking
  const deleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    saveBookings(updated);
  };

  // Admin manually block dates
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

  return (
    <BookingContext.Provider value={{
      villas,
      bookings,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      blockDatesManually,
      isDateRangeAvailable,
      getVillaBookedDates
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
