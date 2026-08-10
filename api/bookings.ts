import type { VercelRequest, VercelResponse } from '@vercel/node';

const MASTER_CLOUD_URL = "https://jsonblob.com/api/jsonBlob/019fece9-eeaf-75e0-929d-9fcfd0e08c94";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(MASTER_CLOUD_URL, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }
      return res.status(200).json([]);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const response = await fetch(MASTER_CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      if (response.ok) {
        return res.status(200).json({ success: true, data: bodyData });
      }
      return res.status(500).json({ error: 'Failed to update master cloud database' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
