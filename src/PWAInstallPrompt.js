import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from './contexts/PWAContext';
import { getItem, setItem, STORAGE_KEYS } from './services/storage.service';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, showInstallPrompt } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled) {
      setShowPrompt(false);
      return;
    }

    // Show prompt after a delay when installable
    if (isInstallable) {
      // Show prompt sooner for better UX (reduced from 5 seconds to 1 second)
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1000); // Show after 1 second

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstallClick = async () => {
    const accepted = await showInstallPrompt();
    if (accepted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not annoy the user
    setItem(STORAGE_KEYS.PWA_INSTALL_DISMISSED, Date.now());
  };

  // Check if user dismissed recently (within 7 days)
  useEffect(() => {
    const dismissed = getItem(STORAGE_KEYS.PWA_INSTALL_DISMISSED);
    if (dismissed) {
      const dismissedTime = typeof dismissed === 'number' ? dismissed : parseInt(dismissed, 10);
      const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      if (daysSinceDismissal < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  // Don't show if not installable, already installed, or user dismissed
  if (!showPrompt || isInstalled || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-2xl p-4 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
          <Download size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Install DrinkBot3000</h3>
          <p className="text-sm text-white/90">
            Add to your home screen for quick access and offline use
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 bg-white text-indigo-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-white/90 hover:text-white transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
