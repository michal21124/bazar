import { getStore } from '@netlify/blobs';

const ADMIN_TOKEN = process.env.VITE_ADMIN_PASSWORD ?? '';

function imageStore() {
  return getStore({ name: 'platinum-cars-images', consistency: 'strong' });
}

export default async function handler(request) {
  const url = new URL(request.url);

  // ── GET /api/image?id=xxx — serve image binary ────────────────────────────
  if (request.method === 'GET') {
    const id = url.searchParams.get('id');
    if (!id) return new Response('Missing id', { status: 400 });

    try {
      const raw = await imageStore().get(id);
      if (!raw) return new Response('Not found', { status: 404 });

      // raw is the full data URL: "data:image/jpeg;base64,..."
      const match = raw.match(/^data:([^;]+);base64,(.+)$/s);
      if (!match) return new Response('Invalid image data', { status: 500 });

      const bytes = Buffer.from(match[2], 'base64');
      return new Response(bytes, {
        headers: {
          'Content-Type': match[1],
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (e) {
      return new Response('Error: ' + String(e), { status: 500 });
    }
  }

  // ── POST /api/image — upload image (admin only) ───────────────────────────
  if (request.method === 'POST') {
    const token = request.headers.get('x-admin-token');
    if (!token || token !== ADMIN_TOKEN) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { dataUrl } = await request.json();
      if (!dataUrl || !dataUrl.startsWith('data:')) {
        return Response.json({ error: 'Expected dataUrl field' }, { status: 400 });
      }

      const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      await imageStore().set(id, dataUrl);

      return Response.json({ ok: true, url: `/api/image?id=${id}` });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}

// Netlify v2 — map to /api/image
export const config = { path: '/api/image' };
