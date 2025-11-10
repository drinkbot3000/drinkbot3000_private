import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
      setShowOnline(true);

      // Hide the "back online" message after 3 seconds
      setTimeout(() => {
        setShowOnline(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
      setShowOnline(false);
    };

    const handleConnectionStatus = (event) => {
      if (event.detail.online) {
        handleOnline();
      } else {
        handleOffline();
      }
    };

    // Listen to native events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen to custom events from service worker
    window.addEventListener('connection-status', handleConnectionStatus);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('connection-status', handleConnectionStatus);
    };
  }, []);

  // Don't show anything if we're online and haven't just reconnected
  if (isOnline && !showOnline) {
    return null;
  }

  return (
    <>
      {showOffline && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-orange-600 text-white rounded-lg shadow-2xl p-4 z-40 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
              <WifiOff size={20} />
            </div>
            <div>
              <h4 className="font-semibold">No Connection</h4>
              <p className="text-sm text-white/90">
                You're offline. Some features may be limited.
              </p>
            </div>
          </div>
        </div>
      )}

      {showOnline && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-green-600 text-white rounded-lg shadow-2xl p-4 z-40 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
              <Wifi size={20} />
            </div>
            <div>
              <h4 className="font-semibold">Back Online</h4>
              <p className="text-sm text-white/90">
                Connection restored. All features available.
              </p>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
};

export default ConnectionStatus;
