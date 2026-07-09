const CACHE_NAME = 'md-preview-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'iris/styles.css',
  'iris/css/themes/themes.css',
  'iris/css/base.css',
  'iris/css/components.css',
  'iris/css/floating.css',
  'iris/css/layout.css',
  'iris/css/markdown.css',
  'iris/css/responsive.css',
  'iris/app.js',
  'iris/js/config.js',
  'iris/js/debug.js',
  'iris/js/dom.js',
  'iris/js/file-tree.js',
  'iris/js/markdown.js',
  'iris/js/router.js',
  'iris/js/search.js',
  'iris/js/settings.js',
  'iris/js/state.js',
  'iris/js/ui.js',
  'iris/js/plugins/loader.js',
  'iris/js/renderers/apexcharts.js',
  'iris/js/renderers/diff.js',
  'iris/js/renderers/embedded.js',
  'iris/js/renderers/geo.js',
  'iris/js/renderers/katex.js',
  'iris/js/renderers/mermaid.js',
  'iris/js/renderers/plantuml.js',
  'iris/js/themes/theme-manager.js',
  'iris/plugins/qrcode.js',
  'iris/vendor/marked.js',
  'iris/vendor/flexsearch.bundle.js',
  'iris/vendor/mermaid.min.js',
  'iris/vendor/pako.min.js',
  'iris/vendor/leaflet/leaflet.js',
  'iris/vendor/leaflet/leaflet.css',
  'iris/vendor/apexcharts.min.js',
  'iris/vendor/diff2html/css/diff2html.min.css',
  'iris/vendor/diff2html/js/diff2html.min.js',
  'iris/vendor/diff2html/js/diff2html-ui.min.js',
  'iris/vendor/katex/katex.min.js',
  'iris/vendor/katex/katex.min.css',
  'iris/vendor/katex/auto-render.min.js',
  'iris/data/file-tree.json',
  'iris/data/search-index.json',
  'iris/config.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          if (cached) return cached;
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });

      return cached || networkFetch;
    })
  );
});
