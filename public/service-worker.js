// DrinkBot3000 Service Worker
// Version 1.0.1 - Fixed storage access issues

const CACHE_NAME = 'drinkbot3000-v1';
const RUNTIME_CACHE = 'drinkbot3000-runtime-v1';

// Track if storage is available
let storageAvailable = true;

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/privacy.html',
  '/terms.html',
  '/refund.html',
  '/offline.html'
];

// Check if cache storage is available
async function isCacheAvailable() {
  try {
    await caches.keys();
    return true;
  } catch (error) {
    console.warn('[Service Worker] Cache storage not available:', error.message);
    return false;
  }
}

// Install event - precache essential resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    (async () => {
      try {
        // Check if storage is available
        storageAvailable = await isCacheAvailable();

        if (!storageAvailable) {
          console.warn('[Service Worker] Storage blocked - running in limited mode');
          await self.skipWaiting();
          return;
        }

        const cache = await caches.open(CACHE_NAME);
        console.log('[Service Worker] Precaching app shell');

        // Try to cache all URLs, but don't fail if some don't work
        await cache.addAll(PRECACHE_URLS).catch((error) => {
          console.warn('[Service Worker] Some assets failed to precache:', error.message);
        });

        await self.skipWaiting();
      } catch (error) {
        console.error('[Service Worker] Install error:', error.message);
        storageAvailable = false;
        await self.skipWaiting();
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    (async () => {
      try {
        // Re-check storage availability on activation
        storageAvailable = await isCacheAvailable();

        if (storageAvailable) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames
              .filter((cacheName) => {
                // Delete old caches
                return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
              })
              .map((cacheName) => {
                console.log('[Service Worker] Deleting old cache:', cacheName);
                return caches.delete(cacheName);
              })
          );
        } else {
          console.warn('[Service Worker] Storage unavailable - skipping cache cleanup');
        }

        await self.clients.claim();
      } catch (error) {
        console.error('[Service Worker] Activation error:', error.message);
        storageAvailable = false;
        await self.clients.claim();
      }
    })()
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests differently (network first)
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // For navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(async () => {
          // Try to serve offline page if storage is available
          if (storageAvailable) {
            try {
              const offlineResponse = await caches.match('/offline.html');
              if (offlineResponse) {
                return offlineResponse;
              }
            } catch (error) {
              console.warn('[Service Worker] Could not serve offline page:', error.message);
              storageAvailable = false;
            }
          }
          // If no offline page available, let the browser handle it
          throw new Error('Offline and no cached content available');
        })
    );
    return;
  }

  // For all other requests - cache first strategy
  event.respondWith(cacheFirst(event.request));
});

// Cache first strategy - good for static assets
async function cacheFirst(request) {
  try {
    // Only try cache if storage is available
    if (storageAvailable) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
  } catch (error) {
    console.warn('[Service Worker] Cache match failed:', error.message);
    storageAvailable = false;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses only if storage is available
    if (networkResponse.ok && storageAvailable) {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, networkResponse.clone());
      } catch (error) {
        console.warn('[Service Worker] Failed to cache response:', error.message);
        storageAvailable = false;
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Fetch failed:', error);

    // Try to return offline page from cache if available
    if (storageAvailable && request.headers.get('accept')?.includes('text/html')) {
      try {
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) {
          return offlineResponse;
        }
      } catch (cacheError) {
        console.warn('[Service Worker] Could not retrieve offline page:', cacheError.message);
      }
    }

    throw error;
  }
}

// Network first strategy - good for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses only if storage is available
    if (networkResponse.ok && storageAvailable) {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, networkResponse.clone());
      } catch (error) {
        console.warn('[Service Worker] Failed to cache network response:', error.message);
        storageAvailable = false;
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network request failed, trying cache:', error);

    // Try cache fallback only if storage is available
    if (storageAvailable) {
      try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
      } catch (cacheError) {
        console.warn('[Service Worker] Cache fallback failed:', cacheError.message);
        storageAvailable = false;
      }
    }

    throw error;
  }
}

// Background sync for future features
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[Service Worker] Background sync triggered');
  // Placeholder for future background sync functionality
}

// Push notification support for future features
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    tag: 'drinkbot-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('DrinkBot3000', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message handler for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
