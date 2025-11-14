/**
 * RefundPolicyModal Component
 * Displays refund policy information
 */

import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { CONSTANTS } from '../../constants';

/**
 * RefundPolicyModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback to close modal
 */
const RefundPolicyModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refund Policy"
      maxWidth="2xl"
    >
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600 mb-4">
          We want you to be completely satisfied with DrinkBot3000. If you're not happy with your tip/donation, we offer a simple refund process.
        </p>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">Refund Window</h3>
        <p className="text-gray-600 mb-4">
          You can request a full refund within <strong>{CONSTANTS.REFUND_WINDOW_DAYS} days</strong> of your payment, no questions asked.
        </p>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">How to Request a Refund</h3>
        <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
          <li>Email us at <strong>drinkbot3000@gmail.com</strong></li>
          <li>Include your receipt number or payment details</li>
          <li>We'll process your refund within 5-7 business days</li>
        </ol>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">Refund Method</h3>
        <p className="text-gray-600 mb-4">
          Refunds will be issued to the original payment method used for the transaction.
        </p>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-6">
          <p className="text-sm text-green-900">
            ✓ Simple process • ✓ Full refunds • ✓ {CONSTANTS.REFUND_WINDOW_DAYS}-day window • ✓ No questions asked
          </p>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={onClose}
        className="mt-6"
      >
        Close
      </Button>
    </Modal>
  );
};

export default RefundPolicyModal;
