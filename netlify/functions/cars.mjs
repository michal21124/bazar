import { getStore } from '@netlify/blobs';

const ADMIN_TOKEN = process.env.VITE_ADMIN_PASSWORD ?? '';
const BLOB_KEY = 'cars-v1';

export default async function handler(request) {
  // CORS headers (same-origin, but just in case)
  const headers = { 'Content-Type': 'application/json' };

  const store = getStore({ name: 'platinum-cars-inventory', consistency: 'strong' });

  // ── GET — return all cars ─────────────────────────────────────────────────
  if (request.method === 'GET') {
    try {
      const data = await store.get(BLOB_KEY, { type: 'json' });
      return Response.json(Array.isArray(data) && data.length > 0 ? data : [], { headers });
    } catch {
      return Response.json([], { headers });
    }
  }

  // ── POST — save all cars (admin only) ─────────────────────────────────────
  if (request.method === 'POST') {
    const token = request.headers.get('x-admin-token');
    if (!token || token !== ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers,
      });
    }
    try {
      const cars = await request.json();
      if (!Array.isArray(cars)) {
        return new Response(JSON.stringify({ error: 'Expected array' }), { status: 400, headers });
      }
      await store.set(BLOB_KEY, JSON.stringify(cars));
      return Response.json({ ok: true, count: cars.length }, { headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}

// Netlify v2 — map to /api/cars
export const config = { path: '/api/cars' };
