import type { VercelRequest, VercelResponse } from '@vercel/node';
import initialData from '../data/bookings.json';

let currentBookings: any[] = [...initialData];

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    if (req.method === 'GET') {
      return res.status(200).json(currentBookings);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (body && body.action === 'add' && body.booking) {
        const newBooking = body.booking;
        const exists = currentBookings.some(b => b.id === newBooking.id);
        if (!exists) {
          currentBookings = [newBooking, ...currentBookings];
        }
        return res.status(200).json({ success: true, count: currentBookings.length, bookings: currentBookings });
      }

      if (body && body.action === 'update' && body.bookingId) {
        currentBookings = currentBookings.map(b => {
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
        return res.status(200).json({ success: true, count: currentBookings.length, bookings: currentBookings });
      }

      if (body && body.action === 'delete' && body.bookingId) {
        currentBookings = currentBookings.filter(b => b.id !== body.bookingId);
        return res.status(200).json({ success: true, count: currentBookings.length, bookings: currentBookings });
      }

      if (Array.isArray(body) && body.length > 0) {
        const map = new Map<string, any>();
        currentBookings.forEach(b => { if (b && b.id) map.set(b.id, b); });
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
        currentBookings = Array.from(map.values());
        return res.status(200).json({ success: true, count: currentBookings.length, bookings: currentBookings });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json(currentBookings);
}
