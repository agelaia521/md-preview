const CACHE_NAME = 'md-preview-v1.1';
const RUNTIME_CACHE = 'md-preview-runtime';

const PRECACHE_URLS = [
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
  'iris/config.json',
  'iris/icons/icon.svg',
  'iris/icons/icon-maskable.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('[SW] Precache partial failure:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put('./index.html', clone));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request)
        .then(response => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
