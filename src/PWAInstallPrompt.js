import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import './PWAInstallPrompt.css';

/**
 * PWAInstallPrompt Component
 * Displays a prompt to install the app as a Progressive Web App
 *
 * Features:
 * - Automatically detects if app is already installed
 * - Shows prompt 5 seconds after page load
 * - Respects user dismissal for 7 days
 * - Fully accessible with proper ARIA labels
 */
const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed recently (within 7 days)
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      if (daysSinceDismissal < 7) {
        return;
      }
    }

    // Listen for install prompt availability
    const handleInstallAvailable = () => {
      // Wait a bit before showing the prompt (better UX)
      const timeoutId = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds

      return () => clearTimeout(timeoutId);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (window.showInstallPrompt) {
      try {
        const accepted = await window.showInstallPrompt();
        if (accepted) {
          setShowPrompt(false);
        }
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not annoy the user
    try {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    } catch (error) {
      console.error('Error storing dismissal:', error);
    }
  };

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div
      className="pwa-install-prompt"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <button
        onClick={handleDismiss}
        className="pwa-install-close"
        aria-label="Dismiss installation prompt"
        type="button"
      >
        <X size={20} />
      </button>

      <div className="pwa-install-content">
        <div className="pwa-install-icon">
          <Download size={24} aria-hidden="true" />
        </div>
        <div className="pwa-install-text">
          <h3 id="pwa-install-title" className="pwa-install-title">
            Install DrinkBot3000
          </h3>
          <p id="pwa-install-description" className="pwa-install-description">
            Add to your home screen for quick access and offline use
          </p>
        </div>
      </div>

      <div className="pwa-install-actions">
        <button
          onClick={handleInstallClick}
          className="pwa-install-button pwa-install-button-primary"
          type="button"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="pwa-install-button pwa-install-button-secondary"
          type="button"
        >
          Not now
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
