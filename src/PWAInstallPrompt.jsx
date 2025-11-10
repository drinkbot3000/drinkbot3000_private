import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt availability
    const handleInstallAvailable = () => {
      // Wait a bit before showing the prompt (better UX)
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds
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
      const accepted = await window.showInstallPrompt();
      if (accepted) {
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not annoy the user
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently (within 7 days)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      if (daysSinceDismissal < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt || isInstalled) {
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

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PWAInstallPrompt;
