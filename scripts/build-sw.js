const { injectManifest } = require('workbox-build');
const path = require('path');

/**
 * Build script for generating the service worker with Workbox
 * This script injects a precache manifest into the service worker template
 * with automatic cache versioning based on file content hashes
 */

const buildServiceWorker = async () => {
  try {
    console.log('🔨 Building service worker with Workbox...');

    const { count, size, warnings } = await injectManifest({
      // Source service worker template
      swSrc: path.join(__dirname, '..', 'service-worker-src', 'service-worker.js'),

      // Output location in build folder
      swDest: path.join(__dirname, '..', 'build', 'service-worker.js'),

      // Directory to look for files to precache
      globDirectory: path.join(__dirname, '..', 'build'),

      // Patterns for files to precache
      globPatterns: [
        '**/*.{html,js,css,png,jpg,jpeg,gif,svg,ico,json,woff,woff2,ttf,eot}'
      ],

      // Ignore patterns
      globIgnores: [
        '**/node_modules/**/*',
        '**/service-worker.js',
        '**/workbox-*.js'
      ],

      // Maximum file size to precache (2MB)
      maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,

      // Manifest transforms for custom handling
      manifestTransforms: [
        // Custom transform to handle index.html
        (manifestEntries) => {
          const manifest = manifestEntries.map(entry => {
            // Handle /index.html to also match /
            if (entry.url === 'index.html') {
              return {
                ...entry,
                url: '/'
              };
            }

            // Ensure URLs start with /
            if (!entry.url.startsWith('/')) {
              entry.url = '/' + entry.url;
            }

            return entry;
          });

          return { manifest, warnings: [] };
        }
      ]
    });

    console.log(`✅ Service worker generated successfully!`);
    console.log(`   📦 Precached ${count} files, totaling ${(size / 1024 / 1024).toFixed(2)} MB`);

    if (warnings.length > 0) {
      console.warn('⚠️  Warnings:');
      warnings.forEach(warning => console.warn(`   - ${warning}`));
    }

  } catch (error) {
    console.error('❌ Error building service worker:', error);
    process.exit(1);
  }
};

buildServiceWorker();
