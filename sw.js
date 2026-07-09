const CACHE_NAME = 'md-preview-v4.0';
const RUNTIME_CACHE = 'md-preview-runtime';

// 只预缓存最核心的文件，减少安装时间
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  'iris/styles.css',
  'iris/app.js',
  'iris/vendor/marked.js',
  'iris/vendor/flexsearch.bundle.js'
];

// 后台缓存的文件列表（不阻塞安装）
const BACKGROUND_CACHE_URLS = [
  'iris/css/base.css',
  'iris/css/layout.css',
  'iris/css/markdown.css',
  'iris/css/components.css',
  'iris/css/floating.css',
  'iris/css/responsive.css',
  'iris/css/themes/themes.css',
  'iris/js/config.js',
  'iris/js/dom.js',
  'iris/js/ui.js',
  'iris/js/file-tree.js',
  'iris/js/markdown.js',
  'iris/js/router.js',
  'iris/js/search.js',
  'iris/js/settings.js',
  'iris/js/state.js',
  'iris/icons/icon-192.png',
  'iris/icons/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('[SW] Installing v4.0...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching core files...');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Core files cached, activating...');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Core cache failed:', err);
        return self.skipWaiting();
      })
  );

  // 后台缓存其他文件，不阻塞安装
  event.waitUntil(
    caches.open(RUNTIME_CACHE)
      .then(cache => {
        console.log('[SW] Background caching additional files...');
        return Promise.all(
          BACKGROUND_CACHE_URLS.map(url =>
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(err => console.warn('[SW] Failed to cache:', url, err))
          )
        );
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      console.log('[SW] Existing caches:', keys);
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => {
      console.log('[SW] Activated, claiming clients');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html')
        .then(cached => {
          if (cached) return cached;
          return fetch(request)
            .then(response => {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put('./index.html', clone));
              return response;
            })
            .catch(() => caches.match('./index.html'));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});