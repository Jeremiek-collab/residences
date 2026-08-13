import type { VercelRequest, VercelResponse } from '@vercel/node';

const baseBookings: any[] = [
  {
    id: "mock-b1",
    villaId: "residence-2",
    clientName: "Jean-Pierre Kouadio",
    clientEmail: "jp.kouadio@email.com",
    clientPhone: "+225 0707070707",
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    totalPrice: 90000,
    advancePaid: 20000,
    status: "confirmed",
    notes: "Accueil 19h",
    createdAt: "2026-08-01T10:00:00.000Z"
  },
  {
    id: "mock-b2",
    villaId: "residence-3",
    clientName: "Marie-Claire Diallo",
    clientEmail: "mc.diallo@email.com",
    clientPhone: "+225 0505050505",
    startDate: "2026-08-20",
    endDate: "2026-08-24",
    totalPrice: 120000,
    advancePaid: 20000,
    status: "pending",
    notes: "Besoin de chaises bébé.",
    createdAt: "2026-08-02T14:30:00.000Z"
  },
  {
    id: "booking-1785934641676",
    villaId: "residence-6",
    clientName: "Océane Omlim",
    clientEmail: "ocean@gmail.com",
    clientPhone: "05 03 60 83 63",
    startDate: "2026-08-14",
    endDate: "2026-08-15",
    totalPrice: 30000,
    advancePaid: 0,
    status: "pending",
    notes: "",
    createdAt: "2026-08-05T12:57:21.676Z"
  },
  {
    id: "booking-1786359875104",
    villaId: "residence-4",
    clientName: "Djazo",
    clientEmail: "yirekouassi@gmail.com",
    clientPhone: "0787201019",
    startDate: "2026-08-11",
    endDate: "2026-08-15",
    totalPrice: 140000,
    advancePaid: 0,
    status: "confirmed",
    notes: "5 jours de réservation",
    createdAt: "2026-08-10T11:04:35.104Z"
  },
  {
    id: "booking-1785961528986",
    villaId: "residence-5",
    clientName: "Melissa Dakouri",
    clientEmail: "drkouamemelissa@gmail.com",
    clientPhone: "0748158109",
    startDate: "2026-08-07",
    endDate: "2026-08-08",
    totalPrice: 35000,
    advancePaid: 0,
    status: "pending",
    notes: "",
    createdAt: "2026-08-05T20:25:28.986Z"
  },
  {
    id: "booking-1785961405620",
    villaId: "residence-3",
    clientName: "Mélissa",
    clientEmail: "drkouamemelissa@gmail.com",
    clientPhone: "0748158109",
    startDate: "2026-08-07",
    endDate: "2026-08-08",
    totalPrice: 30000,
    advancePaid: 0,
    status: "pending",
    notes: "",
    createdAt: "2026-08-05T20:23:25.620Z"
  },
  {
    id: "booking-1785950907943",
    villaId: "residence-7",
    clientName: "Georgina AKA",
    clientEmail: "akageorginamarieesther@gmail.com",
    clientPhone: "+2250101235006",
    startDate: "2026-08-07",
    endDate: "2026-08-09",
    totalPrice: 50000,
    advancePaid: 0,
    status: "confirmed",
    notes: "",
    createdAt: "2026-08-05T17:28:27.943Z"
  },
  {
    id: "booking-1785942234798",
    villaId: "residence-2",
    clientName: "Kouakou Serge",
    clientEmail: "sergeakouakou@gmail.com",
    clientPhone: "0747096797",
    startDate: "2026-08-06",
    endDate: "2026-08-08",
    totalPrice: 60000,
    advancePaid: 0,
    status: "confirmed",
    notes: "",
    createdAt: "2026-08-05T15:03:54.798Z"
  },
  {
    id: "booking-1785940426410",
    villaId: "residence-4",
    clientName: "Mr Aby",
    clientEmail: "jere@gmail.com",
    clientPhone: "07 07 07 89 40",
    startDate: "2026-08-06",
    endDate: "2026-08-09",
    totalPrice: 105000,
    advancePaid: 0,
    status: "confirmed",
    notes: "",
    createdAt: "2026-08-05T14:33:46.410Z"
  }
];

let inMemoryBookings: any[] = [...baseBookings];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Return all bookings
    if (req.method === 'GET') {
      return res.status(200).json(inMemoryBookings);
    }

    // POST / PUT: Smart Atomic Updates
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      // Case A: Atomic Add Single Booking
      if (body && body.action === 'add' && body.booking) {
        const newBooking = body.booking;
        const exists = inMemoryBookings.some(b => b.id === newBooking.id);
        if (!exists) {
          inMemoryBookings = [newBooking, ...inMemoryBookings];
        }
        return res.status(200).json({ success: true, count: inMemoryBookings.length, bookings: inMemoryBookings });
      }

      // Case B: Atomic Update Status/Pricing
      if (body && body.action === 'update' && body.bookingId) {
        inMemoryBookings = inMemoryBookings.map(b => {
          if (b.id === body.bookingId) {
            return {
              ...b,
              ...(body.status !== undefined ? { status: body.status } : {}),
              ...(body.totalPrice !== undefined ? { totalPrice: body.totalPrice } : {}),
              ...(body.advancePaid !== undefined ? { advancePaid: body.advancePaid } : {})
            };
          }
          return b;
        });
        return res.status(200).json({ success: true, count: inMemoryBookings.length, bookings: inMemoryBookings });
      }

      // Case C: Atomic Delete
      if (body && body.action === 'delete' && body.bookingId) {
        inMemoryBookings = inMemoryBookings.filter(b => b.id !== body.bookingId);
        return res.status(200).json({ success: true, count: inMemoryBookings.length, bookings: inMemoryBookings });
      }

      // Case D: Full Array Sync
      if (Array.isArray(body) && body.length > 0) {
        const map = new Map<string, any>();
        inMemoryBookings.forEach(b => { if (b && b.id) map.set(b.id, b); });
        body.forEach(b => {
          if (b && b.id) {
            if (!map.has(b.id)) {
              map.set(b.id, b);
            } else {
              const existing = map.get(b.id);
              map.set(b.id, { ...existing, ...b });
            }
          }
        });
        inMemoryBookings = Array.from(map.values());
        return res.status(200).json({ success: true, count: inMemoryBookings.length, bookings: inMemoryBookings });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json(inMemoryBookings);
}
