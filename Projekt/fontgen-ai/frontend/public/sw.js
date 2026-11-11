/**
 * FontGen AI Service Worker
 * Precaches app shell & static assets, implements network-first for API, cache-first for fonts
 */

const CACHE_NAME = 'fontgen-ai-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json'
];

const API_ENDPOINTS = [
  'https://api.openai.com',
  'https://api.anthropic.com'
];

/**
 * Install event: precache app shell
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell');
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Precache failed (some URLs may be unavailable):', err);
      });
    })
  );
  self.skipWaiting();
});

/**
 * Activate event: clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch event: implement caching strategies
 * - API calls: network-first with fallback to cache
 * - Fonts: cache-first with fallback to network
 * - HTML: network-first for SPA routing
 * - Static assets: cache-first with fallback to network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls: network-first strategy
  if (API_ENDPOINTS.some((endpoint) => url.href.startsWith(endpoint))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Font files: cache-first strategy
  if (/\.(woff2?|ttf|otf)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML files (SPA routing): network-first
  if (request.mode === 'navigate' || /\.html?$/.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // CSS, JS, images: cache-first
  if (/\.(js|css|svg|png|jpg|jpeg|gif|webp|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: cache-first
  event.respondWith(cacheFirst(request));
});

/**
 * Network-first strategy
 * Try network first, fall back to cache
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed for', request.url, '- trying cache');
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return createOfflinePage();
  }
}

/**
 * Cache-first strategy
 * Try cache first, fall back to network
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed for', request.url);
    return createOfflinePage();
  }
}

/**
 * Create offline fallback page
 */
function createOfflinePage() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Offline – FontGen AI</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: #f3f4f6;
        }
        .container {
          text-align: center;
          max-width: 400px;
          padding: 2rem;
        }
        h1 {
          font-size: 1.875rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        a {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 0.375rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        a:hover {
          background: #2563eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>You're Offline</h1>
        <p>You're currently offline. Some features may be limited, but cached content is available.</p>
        <a href="./">← Return to FontGen AI</a>
      </div>
    </body>
    </html>`,
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      })
    }
  );
}

/**
 * Handle messages from clients (e.g., skip-waiting for SW updates)
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
