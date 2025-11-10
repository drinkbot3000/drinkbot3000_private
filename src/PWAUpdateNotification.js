import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

const PWAUpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [worker, setWorker] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handleUpdate = (event) => {
      setWorker(event.detail.worker);
      setShowUpdate(true);
    };

    window.addEventListener('sw-update-available', handleUpdate);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, []);

  const handleUpdate = () => {
    if (!worker) return;

    setUpdating(true);

    // Send skip waiting message
    worker.postMessage({ type: 'SKIP_WAITING' });

    // The page will reload automatically when the new service worker takes control
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Store dismissal to show again later
    setTimeout(() => {
      setShowUpdate(true);
    }, 5 * 60 * 1000); // Show again in 5 minutes
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-2xl p-4 z-50 animate-slide-down">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        aria-label="Dismiss"
        disabled={updating}
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
          <RefreshCw size={24} className={updating ? 'animate-spin' : ''} />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Update Available</h3>
          <p className="text-sm text-white/90">
            {updating
              ? 'Updating DrinkBot3000...'
              : 'A new version is ready. Update now for the latest features and improvements.'}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="flex-1 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? 'Updating...' : 'Update Now'}
        </button>
        <button
          onClick={handleDismiss}
          disabled={updating}
          className="px-4 py-2 text-white/90 hover:text-white transition-colors disabled:opacity-50"
        >
          Later
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PWAUpdateNotification;
