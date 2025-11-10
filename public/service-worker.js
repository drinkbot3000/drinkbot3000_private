// DrinkBot3000 Service Worker
// Version 2.0.0 - Optimized

const VERSION = '2.0.0';
const CACHE_NAME = `drinkbot3000-v${VERSION}`;
const RUNTIME_CACHE = `drinkbot3000-runtime-v${VERSION}`;
const IMAGE_CACHE = `drinkbot3000-images-v${VERSION}`;

// Maximum cache sizes to prevent unlimited growth
const MAX_RUNTIME_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 30;

// Cache duration (in milliseconds)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

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

// In-flight requests map for deduplication
const inFlightRequests = new Map();

// Install event - precache essential resources
self.addEventListener('install', (event) => {
  console.log(`[Service Worker v${VERSION}] Installing...`);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        // Use addAll with error handling for individual failures
        return Promise.allSettled(
          PRECACHE_URLS.map(url =>
            cache.add(url).catch(err => {
              console.warn(`[Service Worker] Failed to cache ${url}:`, err);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker v${VERSION}] Activating...`);

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete caches that don't match current version
              return cacheName.startsWith('drinkbot3000-') &&
                     !cacheName.includes(VERSION);
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim(),
      // Enable navigation preload if available
      self.registration.navigationPreload?.enable()
    ])
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests (except for common CDNs)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different request types with appropriate strategies
  if (url.pathname.includes('/api/')) {
    // API requests: Network first with cache fallback
    event.respondWith(networkFirst(request));
  } else if (request.mode === 'navigate') {
    // Navigation requests: Network first with offline fallback
    event.respondWith(handleNavigationRequest(request, event));
  } else if (request.destination === 'image') {
    // Images: Stale-while-revalidate for best performance
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE));
  } else {
    // Static assets: Stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, MAX_RUNTIME_CACHE_SIZE));
  }
});

// Handle navigation requests with preload support
async function handleNavigationRequest(request, event) {
  try {
    // Try to use navigation preload if available
    const preloadResponse = event.preloadResponse;
    const response = preloadResponse ? await preloadResponse : await fetch(request);

    if (response.ok) {
      // Cache successful navigation responses
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[Service Worker] Navigation fetch failed:', error);

    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fall back to offline page
    return caches.match('/offline.html');
  }
}

// Stale-while-revalidate strategy - best for performance
async function staleWhileRevalidate(request, cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        // Clone before caching
        cache.put(request, networkResponse.clone());

        // Trim cache if needed
        await trimCache(cacheName, maxSize);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[Service Worker] Background fetch failed:', error);
    });

  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Cache first strategy with network fallback
async function cacheFirst(request, cacheName = RUNTIME_CACHE) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Check if cache is stale
    const cacheDate = cachedResponse.headers.get('sw-cache-date');
    if (cacheDate) {
      const age = Date.now() - parseInt(cacheDate, 10);
      if (age > CACHE_DURATION) {
        // Cache is stale, fetch in background
        fetch(request).then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(cacheName);
            const responseToCache = addCacheDate(response);
            cache.put(request, responseToCache);
          }
        }).catch(() => {});
      }
    }
    return cachedResponse;
  }

  // Deduplicate in-flight requests
  const requestKey = request.url;
  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }

  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      inFlightRequests.delete(requestKey);

      if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        const responseToCache = addCacheDate(networkResponse.clone());
        cache.put(request, responseToCache);
      }

      return networkResponse;
    })
    .catch((error) => {
      inFlightRequests.delete(requestKey);
      console.log('[Service Worker] Fetch failed:', error);

      // Return offline page for HTML requests
      const accept = request.headers.get('accept') || '';
      if (accept.includes('text/html')) {
        return caches.match('/offline.html');
      }

      throw error;
    });

  inFlightRequests.set(requestKey, fetchPromise);
  return fetchPromise;
}

// Network first strategy - good for dynamic content
async function networkFirst(request, cacheName = RUNTIME_CACHE) {
  // Deduplicate in-flight requests
  const requestKey = request.url;
  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }

  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      inFlightRequests.delete(requestKey);

      // Cache successful responses
      if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        const responseToCache = addCacheDate(networkResponse.clone());
        cache.put(request, responseToCache);
      }

      return networkResponse;
    })
    .catch(async (error) => {
      inFlightRequests.delete(requestKey);
      console.log('[Service Worker] Network request failed, trying cache:', error);

      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      throw error;
    });

  inFlightRequests.set(requestKey, fetchPromise);
  return fetchPromise;
}

// Add cache date header to response
function addCacheDate(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cache-date', Date.now().toString());

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Trim cache to max size
async function trimCache(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxSize) {
    // Remove oldest entries
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
    console.log(`[Service Worker] Trimmed ${keysToDelete.length} items from ${cacheName}`);
  }
}

// Message handler
self.addEventListener('message', (event) => {
  if (!event.data) return;

  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        })
      );
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({ version: VERSION });
      break;
  }
});
