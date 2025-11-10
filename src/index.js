import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', {
        // Update service worker in the background
        updateViaCache: 'none'
      })
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Check for updates more reasonably - every 30 minutes instead of every minute
        let updateCheckInterval;

        const checkForUpdates = () => {
          // Only check if page is visible
          if (document.visibilityState === 'visible') {
            registration.update().catch(err => {
              console.log('Service Worker update check failed:', err);
            });
          }
        };

        // Check on visibility change
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            checkForUpdates();
          }
        });

        // Periodic check every 30 minutes
        updateCheckInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

        // Handle updates with better UX
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 New Service Worker version found');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, show update notification
              showUpdateNotification(newWorker);
            }
          });
        });

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
          if (updateCheckInterval) {
            clearInterval(updateCheckInterval);
          }
        });
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error);
      });

    // Handle controller change (new service worker took control)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        console.log('🔄 Service Worker controller changed, reloading...');
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

// Show update notification with better UX
function showUpdateNotification(worker) {
  // Create a custom event for React components to handle
  const updateEvent = new CustomEvent('sw-update-available', {
    detail: { worker }
  });
  window.dispatchEvent(updateEvent);

  // Fallback: Show a non-intrusive notification
  const shouldUpdate = window.confirm(
    'A new version of DrinkBot3000 is available! Reload to update?'
  );

  if (shouldUpdate) {
    worker.postMessage({ type: 'SKIP_WAITING' });
  }
}

// PWA Install Prompt Handler
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();

  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Dispatch custom event that can be caught in React components
  window.dispatchEvent(new CustomEvent('pwa-install-available', { detail: e }));

  console.log('💾 PWA install prompt available');
});

// Track PWA installation
window.addEventListener('appinstalled', (e) => {
  console.log('✅ PWA was installed successfully');

  // Track installation event
  if (window.gtag) {
    window.gtag('event', 'pwa_installed', {
      event_category: 'engagement',
      event_label: 'PWA Installation'
    });
  }

  deferredPrompt = null;
});

// Expose install function globally for components to use
window.showInstallPrompt = async () => {
  if (!deferredPrompt) {
    console.log('❌ Install prompt not available');
    return false;
  }

  try {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('ℹ️ User dismissed the install prompt');
    }

    // Clear the deferred prompt
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('Error showing install prompt:', error);
    return false;
  }
};

// Check if running as PWA
window.isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Online/Offline detection
window.addEventListener('online', () => {
  console.log('📶 Connection restored');
  window.dispatchEvent(new CustomEvent('connection-status', { detail: { online: true } }));
});

window.addEventListener('offline', () => {
  console.log('📵 Connection lost');
  window.dispatchEvent(new CustomEvent('connection-status', { detail: { online: false } }));
});
