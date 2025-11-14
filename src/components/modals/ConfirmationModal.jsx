/**
 * ConfirmationModal Component
 * Generic confirmation dialog for destructive actions
 */

import React from 'react';
import Modal from '../common/Modal';
import { AlertCircle } from 'lucide-react';
import Button from '../common/Button';

/**
 * ConfirmationModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback to close/cancel modal
 * @param {Function} props.onConfirm - Callback when user confirms
 * @param {string} props.message - Confirmation message to display
 * @param {string} props.confirmText - Text for confirm button (default: "Yes, Continue")
 * @param {string} props.cancelText - Text for cancel button (default: "Cancel")
 * @param {string} props.title - Modal title (default: "Are you sure?")
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = 'Yes, Continue',
  cancelText = 'Cancel',
  title = 'Are you sure?'
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      showCloseButton={false}
    >
      <div className="text-center mb-6">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="danger"
          fullWidth
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={onClose}
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
