/**
 * DrinkBot3000 Service Worker (Workbox-powered)
 *
 * This service worker is generated using Workbox, which provides:
 * - Automatic cache versioning based on file content hashes
 * - Efficient precaching with intelligent updates
 * - Battle-tested caching strategies
 * - Proper cache management and cleanup
 *
 * The precache manifest is automatically injected during build time.
 */

// Import Workbox from CDN (will be available at runtime)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');

// Check if Workbox loaded successfully
if (workbox) {
  console.log('[Service Worker] Workbox loaded successfully');

  // Configure Workbox
  workbox.setConfig({
    debug: false
  });

  // Precache files (manifest injected by workbox-build at build time)
  // This placeholder will be replaced with the actual file list
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Strategy 1: Cache First for static assets (images, fonts, etc.)
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'image' ||
      request.destination === 'font' ||
      request.destination === 'style' ||
      request.destination === 'script',
    new workbox.strategies.CacheFirst({
      cacheName: 'drinkbot3000-static-assets',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          purgeOnQuotaError: true
        })
      ]
    })
  );

  // Strategy 2: Network First for API requests
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'drinkbot3000-api-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
          purgeOnQuotaError: true
        })
      ],
      networkTimeoutSeconds: 10
    })
  );

  // Strategy 3: Stale While Revalidate for HTML pages
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'drinkbot3000-pages',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );

  // Offline fallback for navigation requests
  const OFFLINE_URL = '/offline.html';

  // Cache the offline page during installation
  self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing with Workbox');

    event.waitUntil(
      caches.open('drinkbot3000-offline')
        .then((cache) => cache.add(OFFLINE_URL))
        .then(() => self.skipWaiting())
        .catch((error) => {
          console.log('[Service Worker] Failed to cache offline page:', error);
        })
    );
  });

  // Clean up old caches on activation
  self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating with Workbox');
    event.waitUntil(self.clients.claim());
  });

  // Set up offline fallback
  workbox.routing.setCatchHandler(async ({ event }) => {
    // Only handle navigation requests
    if (event.request.mode === 'navigate') {
      const cache = await caches.open('drinkbot3000-offline');
      const cachedResponse = await cache.match(OFFLINE_URL);
      return cachedResponse || Response.error();
    }

    return Response.error();
  });

  // Handle background sync (for future features)
  self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
      event.waitUntil(syncData());
    }
  });

  async function syncData() {
    console.log('[Service Worker] Background sync triggered');
    // Placeholder for future background sync functionality
  }

  // Message handler for skip waiting
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  console.log('[Service Worker] Setup complete');

} else {
  console.error('[Service Worker] Workbox failed to load');
}
