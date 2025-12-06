/**
 * Modal Component
 * Reusable modal/dialog component
 */

import React from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

/**
 * Modal Component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  showCloseButton = true,
}: ModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full my-8 flex flex-col max-h-[90vh]`}>
        {title && (
          <div className="flex items-center justify-between p-8 pb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto px-8 pb-8">{children}</div>
      </div>
    </div>
  );
}
