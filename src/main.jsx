import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import { initStorageAccess } from './utils/storageAccess';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ============================================================================
// MODERN SERVICE WORKER REGISTRATION with Workbox
// ============================================================================

// Initialize Storage Access API check on app load
initStorageAccess().then((result) => {
  console.log('[Storage Access] Initial check:', result);

  if (!result.hasAccess && result.canRequest) {
    console.log('[Storage Access] Storage access restricted - may affect caching');
  }
});

// Register service worker using vite-plugin-pwa
// This provides automatic updates and modern PWA features
if ('serviceWorker' in navigator) {
  // Register with vite-plugin-pwa's built-in registration
  const updateSW = registerSW({
    onNeedRefresh() {
      console.log('[PWA] New version available!');

      // Get the registration to pass to the notification
      navigator.serviceWorker.getRegistration().then((registration) => {
        // Trigger the modern update notification component
        if (window.showUpdateNotification) {
          window.showUpdateNotification(registration);
        }
      });
    },
    onOfflineReady() {
      console.log('[PWA] App ready to work offline!');

      // Optional: Show a toast that app is ready for offline use
      const event = new CustomEvent('pwa-offline-ready');
      window.dispatchEvent(event);
    },
    onRegistered(registration) {
      console.log('[PWA] Service Worker registered successfully');

      // Check for updates periodically (every hour)
      setInterval(() => {
        registration?.update();
      }, 60 * 60 * 1000); // 1 hour
    },
    onRegisterError(error) {
      console.error('[PWA] Service Worker registration failed:', error);
    },
  });

  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'STORAGE_ACCESS_BLOCKED') {
      console.warn('[PWA] Service Worker reports storage blocked:', event.data.message);

      // Optional: Show user notification about limited offline functionality
      const storageEvent = new CustomEvent('pwa-storage-blocked', {
        detail: event.data.message
      });
      window.dispatchEvent(storageEvent);
    }
  });
}

// ============================================================================
// PWA INSTALL PROMPT - Modern approach
// ============================================================================

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();

  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Dispatch custom event that React components can listen to
  window.dispatchEvent(new CustomEvent('pwa-install-available', { detail: e }));

  console.log('[PWA] Install prompt available');
});

// Track PWA installation
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');
  deferredPrompt = null;

  // Dispatch event for analytics or UI updates
  window.dispatchEvent(new CustomEvent('pwa-installed'));
});

// Expose install function globally for components to use
window.showInstallPrompt = async () => {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    console.log('[PWA] User accepted the install prompt');
  } else {
    console.log('[PWA] User dismissed the install prompt');
  }

  // Clear the deferred prompt
  deferredPrompt = null;
  return outcome === 'accepted';
};

// ============================================================================
// MODERN NAVIGATION PRELOAD CHECK
// ============================================================================

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    if (registration.navigationPreload) {
      console.log('[PWA] Navigation preload supported and enabled');
    } else {
      console.log('[PWA] Navigation preload not supported');
    }
  });
}
