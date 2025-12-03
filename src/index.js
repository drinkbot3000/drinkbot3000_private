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
        // Service Worker registered successfully
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // TODO: Update notification removed - if needed in future, add update detection here
        // Previously would notify user with window.confirm() when new version available
      })
      .catch(() => {
        // Service Worker registration failed - app will still work without offline support
      });

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Service Worker controller changed - new version active
    });
  });
}

// Note: PWA install prompt handling is now managed by PWAContext
// The beforeinstallprompt and appinstalled events are handled in src/contexts/PWAContext.js
