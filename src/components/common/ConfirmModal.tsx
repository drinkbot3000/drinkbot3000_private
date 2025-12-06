/**
 * ConfirmModal Component
 * Confirmation dialog with yes/no options
 */

import React from 'react';
import { Modal } from './Modal';
import { Button, ButtonVariant } from './Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ButtonVariant;
}

/**
 * ConfirmModal Component
 */
export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmModalProps): JSX.Element {
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
