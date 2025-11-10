// DrinkBot3000 Service Worker
// Version 1.0.1

const CACHE_NAME = 'drinkbot3000-v1';
const RUNTIME_CACHE = 'drinkbot3000-runtime-v1';

// Flag to track if storage is available
let storageAvailable = true;

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/privacy.html',
  '/terms.html',
  '/refund.html',
  '/offline.html'
];

// Check if storage access is available
async function checkStorageAccess() {
  try {
    await caches.keys();
    return true;
  } catch (error) {
    console.log('[Service Worker] Storage access blocked:', error.message);
    return false;
  }
}

// Install event - precache essential resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    checkStorageAccess()
      .then((available) => {
        storageAvailable = available;
        if (!storageAvailable) {
          console.log('[Service Worker] Skipping cache due to storage restrictions');
          return self.skipWaiting();
        }
        return caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('[Service Worker] Precaching app shell');
            return cache.addAll(PRECACHE_URLS);
          })
          .then(() => self.skipWaiting());
      })
      .catch((error) => {
        console.log('[Service Worker] Install error (continuing anyway):', error);
        storageAvailable = false;
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    checkStorageAccess()
      .then((available) => {
        storageAvailable = available;
        if (!storageAvailable) {
          console.log('[Service Worker] Storage unavailable, skipping cache cleanup');
          return self.clients.claim();
        }
        return caches.keys().then((cacheNames) => {
          return Promise.all(
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
        }).then(() => self.clients.claim());
      })
      .catch((error) => {
        console.log('[Service Worker] Activate error (continuing anyway):', error);
        return self.clients.claim();
      })
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
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // For all other requests - cache first strategy
  event.respondWith(cacheFirst(event.request));
});

// Cache first strategy - good for static assets
async function cacheFirst(request) {
  // Skip caching if storage is unavailable
  if (!storageAvailable) {
    return fetch(request);
  }

  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  } catch (error) {
    console.log('[Service Worker] Cache read failed:', error.message);
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses if storage is available
    if (networkResponse.ok && storageAvailable) {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      } catch (error) {
        console.log('[Service Worker] Cache write failed:', error.message);
        storageAvailable = false;
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Fetch failed:', error);

    // Try to return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      try {
        return await caches.match('/offline.html') || fetch(request);
      } catch {
        throw error;
      }
    }

    throw error;
  }
}

// Network first strategy - good for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses if storage is available
    if (networkResponse.ok && storageAvailable) {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      } catch (error) {
        console.log('[Service Worker] Cache write failed:', error.message);
        storageAvailable = false;
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network request failed, trying cache:', error);

    if (!storageAvailable) {
      throw error;
    }

    try {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (cacheError) {
      console.log('[Service Worker] Cache read failed:', cacheError.message);
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
    icon: '/icon-192.png',
    badge: '/icon-192.png',
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
