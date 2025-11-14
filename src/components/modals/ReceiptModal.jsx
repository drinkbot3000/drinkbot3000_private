/**
 * ReceiptModal Component
 * Displays payment receipt after successful transaction
 */

import React from 'react';
import Modal from '../common/Modal';
import { CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import { CONSTANTS } from '../../constants';

/**
 * ReceiptModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback to close modal
 * @param {Object} props.receipt - Receipt object with amount, date, id
 */
const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!receipt) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      showCloseButton={false}
    >
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Thank you for your support!</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4 text-center">Receipt</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">${receipt.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-semibold">
              {new Date(receipt.date || receipt.timestamp).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Receipt #:</span>
            <span className="font-mono text-xs">{receipt.id.slice(0, 8)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
        <p className="text-xs text-blue-900">
          <strong>Refund Policy:</strong> You can request a refund within {CONSTANTS.REFUND_WINDOW_DAYS} days. See Refund Policy for details.
        </p>
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={onClose}
      >
        Close
      </Button>
    </Modal>
  );
};

export default ReceiptModal;
