import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

/**
 * Modern update notification component
 * Replaces the old window.confirm() with a sleek in-app banner
 */
const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Listen for update available events from service worker registration
    const handleUpdateAvailable = (reg) => {
      setRegistration(reg);
      setShowUpdate(true);
    };

    // Store the handler globally so main.jsx can call it
    window.showUpdateNotification = handleUpdateAvailable;

    return () => {
      window.showUpdateNotification = null;
    };
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Tell the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Listen for controller change to reload
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 10000,
        maxWidth: '90%',
        width: '400px',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .update-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .update-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .update-btn:active {
          transform: translateY(0);
        }

        .update-btn svg {
          animation: spin 2s linear infinite;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .close-btn:hover {
          opacity: 1;
        }
      `}</style>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
          New version available!
        </div>
        <div style={{ fontSize: '13px', opacity: 0.9 }}>
          Update now for the latest features
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="update-btn"
        aria-label="Update now"
      >
        <RefreshCw size={16} />
        Update
      </button>

      <button
        onClick={handleDismiss}
        className="close-btn"
        aria-label="Dismiss"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default UpdateNotification;
