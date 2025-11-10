import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmModal Component
 * Generic confirmation modal with ARIA labels for accessibility
 */
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div
              className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4"
              aria-hidden="true"
            >
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2
              id="confirm-modal-title"
              className="text-xl font-bold text-gray-800"
            >
              Confirm Action
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-full p-1"
            aria-label="Close confirmation dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p
          id="confirm-modal-description"
          className="text-gray-700 mb-6"
        >
          {message}
        </p>

        <div className="flex gap-3" role="group" aria-label="Confirmation options">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition focus:outline-none focus:ring-4 focus:ring-red-300"
            aria-label="Confirm action"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition focus:outline-none focus:ring-4 focus:ring-gray-300"
            aria-label="Cancel action"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
