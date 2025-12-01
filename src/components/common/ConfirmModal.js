/**
 * ConfirmModal Component
 * Confirmation dialog with yes/no options
 */

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * ConfirmModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onConfirm - Confirm handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Confirm button text (default: 'Confirm')
 * @param {string} props.cancelText - Cancel button text (default: 'Cancel')
 * @param {string} props.variant - Button variant for confirm (default: 'danger')
 */
export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} maxWidth="max-w-md" showCloseButton={false}>
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
