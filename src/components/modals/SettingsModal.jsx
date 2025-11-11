import React from 'react';
import { X, RefreshCw, FileText, DollarSign } from 'lucide-react';

/**
 * SettingsModal - Modal dialog for app settings and user profile
 *
 * Modern pattern: Uses React.memo to prevent unnecessary re-renders
 * when parent component updates but settings data hasn't changed
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback to close the modal
 * @param {object} userProfile - User profile data { gender, weight }
 * @param {function} onReset - Callback to reset the app
 * @param {function} onShowRefundPolicy - Callback to show refund policy
 * @param {string} appVersion - App version string
 */
const SettingsModal = React.memo(({
  isOpen,
  onClose,
  userProfile,
  onReset,
  onShowRefundPolicy,
  appVersion = '1.0.0'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Your Profile</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Gender:</strong> {userProfile.gender === 'male' ? 'Male' : 'Female'}
              </p>
              <p>
                <strong>Weight:</strong> {userProfile.weight} lbs
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onReset}
              className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-medium hover:bg-red-200 transition"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Reset App
            </button>

            <a
              href="/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition text-center"
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Privacy Policy
            </a>

            <a
              href="/terms.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition text-center"
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Terms of Service
            </a>

            <button
              onClick={onShowRefundPolicy}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Refund Policy
            </button>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-xs text-indigo-900">
              <strong>Version:</strong> {appVersion}<br />
              <strong>Made with:</strong> Responsibility & Care 🤖
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

SettingsModal.displayName = 'SettingsModal';

export default SettingsModal;
