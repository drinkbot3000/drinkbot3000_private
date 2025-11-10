import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Use 'prompt' to show update notification instead of auto-updating
      registerType: 'prompt',

      // Include assets in the service worker
      includeAssets: ['icon-192.png', 'icon-512.png', 'offline.html', 'manifest.json'],

      manifest: {
        name: 'DrinkBot3000 - Responsible Drinking Companion',
        short_name: 'DrinkBot3000',
        description: 'Track your BAC responsibly. Never drink and drive.',
        theme_color: '#4F46E5',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        // Auto-generate precache manifest for all built assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],

        // Define runtime caching strategies using Workbox
        runtimeCaching: [
          {
            // API requests: NetworkFirst strategy
            urlPattern: /^https:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Images: CacheFirst strategy (aggressive caching)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            // Fonts: CacheFirst strategy (long-term caching)
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
              }
            }
          },
          {
            // JS/CSS: StaleWhileRevalidate (serve stale while updating)
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Same-origin resources: NetworkFirst
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'same-origin-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          }
        ],

        // Enable navigation preload for faster page loads
        navigationPreload: true,

        // Clean up old caches automatically
        cleanupOutdatedCaches: true,

        // Skip waiting for new service worker
        skipWaiting: true,

        // Take control of all pages immediately
        clientsClaim: true,

        // Handle offline fallback
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/]
      },

      devOptions: {
        enabled: false, // Disable in development for easier debugging
        type: 'module'
      }
    })
  ],

  server: {
    port: 3000,
    open: true
  },

  build: {
    outDir: 'build',
    sourcemap: true
  }
});
