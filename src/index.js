import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Service Worker Registration for PWA
// TODO: Service worker update notifications removed - notification system has been disabled
// Previously, this code would show a window.confirm() dialog when updates were available
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // TODO: Update notification removed - if needed in future, add update detection here
        // Previously would notify user with window.confirm() when new version available
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error);
      });

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });
  });
}

// PWA Install Prompt Handler
let deferredPrompt;
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
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA was installed successfully');
  deferredPrompt = null;
});

// Expose install function globally for components to use
window.showInstallPrompt = async () => {
  if (!deferredPrompt) {
    console.log('❌ Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    console.log('✅ User accepted the install prompt');
  } else {
    console.log('❌ User dismissed the install prompt');
  }

  // Clear the deferred prompt
  deferredPrompt = null;
  return outcome === 'accepted';
};
