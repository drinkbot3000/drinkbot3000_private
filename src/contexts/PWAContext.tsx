import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAContextValue {
  isInstallable: boolean;
  isInstalled: boolean;
  showInstallPrompt: () => Promise<boolean>;
}

interface PWAProviderProps {
  children: ReactNode;
}

// ============================================================================
// Context
// ============================================================================

const PWAContext = createContext<PWAContextValue | null>(null);

export const usePWA = (): PWAContextValue => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export const PWAProvider = ({ children }: PWAProviderProps): JSX.Element => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
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

  const showInstallPrompt = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      // Clear the deferred prompt
      setDeferredPrompt(null);
      setIsInstallable(false);

      return outcome === 'accepted';
    } catch {
      return false;
    }
  };

  const value: PWAContextValue = {
    isInstallable,
    isInstalled,
    showInstallPrompt,
  };

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
};
