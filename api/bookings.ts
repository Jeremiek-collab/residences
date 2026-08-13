import type { VercelRequest, VercelResponse } from '@vercel/node';

const MASTER_CLOUD_URL = "https://jsonblob.com/api/jsonBlob/019ff313-3e9a-716a-a522-cc225022ab36";

// Fetch current cloud list
const getCloudBookings = async (): Promise<any[]> => {
  try {
    const res = await fetch(MASTER_CLOUD_URL, {
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {}
  return [];
};

// Save updated cloud list
const saveCloudBookings = async (data: any[]): Promise<boolean> => {
  try {
    const res = await fetch(MASTER_CLOUD_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

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
      const currentList = await getCloudBookings();
      return res.status(200).json(currentList);
    }

    // POST / PUT: Smart Atomic Updates
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const currentList = await getCloudBookings();

      // Case A: Atomic Add Single Booking ({ action: 'add', booking: newBooking })
      if (body && body.action === 'add' && body.booking) {
        const newBooking = body.booking;
        const exists = currentList.some(b => b.id === newBooking.id);
        const updatedList = exists ? currentList : [newBooking, ...currentList];
        await saveCloudBookings(updatedList);
        return res.status(200).json({ success: true, count: updatedList.length, bookings: updatedList });
      }

      // Case B: Atomic Update Status/Pricing ({ action: 'update', bookingId, status, totalPrice, advancePaid })
      if (body && body.action === 'update' && body.bookingId) {
        const updatedList = currentList.map(b => {
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
        await saveCloudBookings(updatedList);
        return res.status(200).json({ success: true, count: updatedList.length, bookings: updatedList });
      }

      // Case C: Atomic Delete ({ action: 'delete', bookingId })
      if (body && body.action === 'delete' && body.bookingId) {
        const updatedList = currentList.filter(b => b.id !== body.bookingId);
        await saveCloudBookings(updatedList);
        return res.status(200).json({ success: true, count: updatedList.length, bookings: updatedList });
      }

      // Case D: Full Array Union Merge (Array of bookings)
      if (Array.isArray(body)) {
        const map = new Map<string, any>();
        currentList.forEach(b => { if (b && b.id) map.set(b.id, b); });
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

        const mergedList = Array.from(map.values());
        await saveCloudBookings(mergedList);
        return res.status(200).json({ success: true, count: mergedList.length, bookings: mergedList });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
