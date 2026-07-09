const CACHE_NAME = 'md-preview-v5.0';
const RUNTIME_CACHE = 'md-preview-runtime';

const PRECACHE_URLS = [
  './index.html',
  './manifest.json',
  './iris/styles.css',
  './iris/app.js',
  './iris/vendor/marked.js'
];

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  const results = await Promise.all(
    PRECACHE_URLS.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('[SW] Cached:', url);
          return { url, success: true };
        } else {
          console.warn('[SW] Failed to cache (status):', url, response.status);
          return { url, success: false };
        }
      } catch (err) {
        console.warn('[SW] Failed to cache (error):', url, err.message);
        return { url, success: false };
      }
    })
  );
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.warn('[SW] Some files failed to cache:', failed.map(f => f.url));
  }
  return results;
}

self.addEventListener('install', event => {
  console.log('[SW] Installing v5.0...');
  event.waitUntil(
    precache()
      .then(() => {
        console.log('[SW] Precache done, skipping wait');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Precache error:', err);
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});