import React, { createContext, useContext, useState, useEffect } from 'react';

const PWAContext = createContext(null);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export const PWAProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);

      console.log('💾 PWA install prompt available');
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('✅ PWA was installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async () => {
    if (!deferredPrompt) {
      console.log('❌ Install prompt not available');
      return false;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
      setIsInstallable(false);

      return outcome === 'accepted';
    } catch (error) {
      console.error('❌ Error showing install prompt:', error);
      return false;
    }
  };

  const value = {
    isInstallable,
    isInstalled,
    showInstallPrompt,
  };

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
};
