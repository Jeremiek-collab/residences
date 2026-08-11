import type { VercelRequest, VercelResponse } from '@vercel/node';

let activeCloudUrl = "https://jsonblob.com/api/jsonBlob/019ff313-3e9a-716a-a522-cc225022ab36";

const createNewMasterBlob = async (initialData: any[]) => {
  try {
    const res = await fetch("https://jsonblob.com/api/jsonBlob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initialData)
    });
    if (res.ok) {
      const loc = res.headers.get("Location");
      if (loc) {
        activeCloudUrl = loc.startsWith("http") ? loc : `https://jsonblob.com${loc}`;
        return activeCloudUrl;
      }
    }
  } catch (e) {}
  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
      let response = await fetch(activeCloudUrl, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) return res.status(200).json(data);
      }
      return res.status(200).json([]);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      let response = await fetch(activeCloudUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        // Self-heal: Recreate blob if expired
        await createNewMasterBlob(Array.isArray(bodyData) ? bodyData : []);
      }

      return res.status(200).json({ success: true, count: Array.isArray(bodyData) ? bodyData.length : 0 });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
