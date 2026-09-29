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
    if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) return new Response('Invalid id', { status: 400 });

    try {
      const stored = await imageStore().getWithMetadata(id, { type: 'arrayBuffer' });
      if (!stored) return new Response('Not found', { status: 404 });
      let bytes = Buffer.from(stored.data);
      let contentType = stored.metadata?.contentType;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) {
        // Older photos were saved as base64 data URLs; keep their existing URLs working.
        const match = bytes.toString('utf8').match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s);
        if (!match) return new Response('Invalid image data', { status: 500 });
        contentType = match[1];
        bytes = Buffer.from(match[2], 'base64');
      }
      return new Response(bytes, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Netlify-CDN-Cache-Control': 'public, max-age=31536000, immutable',
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
      const match = typeof dataUrl === 'string'
        ? dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/s)
        : null;
      if (!match) {
        return Response.json({ error: 'Expected JPEG, PNG or WebP dataUrl' }, { status: 400 });
      }
      const bytes = Buffer.from(match[2], 'base64');
      if (!bytes.length || bytes.length > 2 * 1024 * 1024) {
        return Response.json({ error: 'Photo must be under 2 MB' }, { status: 413 });
      }

      const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      await imageStore().set(id, new Blob([bytes], { type: match[1] }), {
        metadata: { contentType: match[1] },
      });

      return Response.json({ ok: true, url: `/api/image?id=${id}` });
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}

// Netlify v2 — map to /api/image
export const config = { path: '/api/image' };
