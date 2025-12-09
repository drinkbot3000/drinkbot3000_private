/**
 * ReceiptModal Component
 * Displays payment receipt information
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FileText, Download, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Modal, Button } from '../common';
import {
  downloadReceipt,
  isRefundable,
  getDaysUntilRefundExpires,
} from '../../services/receipt.service';

/**
 * ReceiptModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.receipt - Receipt object
 */
export function ReceiptModal({ isOpen, onClose, receipt }) {
  if (!receipt) return null;

  const refundable = isRefundable(receipt);
  const daysRemaining = getDaysUntilRefundExpires(receipt);

  const handleDownload = () => {
    downloadReceipt(receipt);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Receipt">
      <div className="space-y-6">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900">Payment Successful!</h3>
              <p className="text-sm text-green-700 mt-1">
                Thank you for supporting DrinkBot3000 development!
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Receipt Details</h3>
          </div>

          <div className="space-y-3">
            {/* Receipt ID */}
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Receipt #:</span>
              <span className="text-sm font-mono text-gray-900 text-right">{receipt.id}</span>
            </div>

            {/* Date */}
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="text-sm text-gray-900 text-right">
                {new Date(receipt.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {receipt.status}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-2"></div>

            {/* Description */}
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Description:</span>
              <span className="text-sm text-gray-900 text-right">{receipt.description}</span>
            </div>

            {/* Amount Breakdown */}
            <div className="bg-white rounded p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Support Amount:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${parseFloat(receipt.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing Fee:</span>
                <span className="text-sm text-gray-700">-${receipt.stripeFee}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">Net Amount:</span>
                  <span className="text-lg font-bold text-green-600">${receipt.netAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Payment Method:</span>
              <span className="text-sm text-gray-900 text-right">{receipt.paymentMethod}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Processor:</span>
              <span className="text-sm text-gray-900 text-right">Stripe, Inc.</span>
            </div>
          </div>
        </div>

        {/* Refund Status */}
        {refundable ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">Refund Eligible</h3>
                <p className="text-sm text-blue-800">
                  You have{' '}
                  <strong>
                    {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                  </strong>{' '}
                  remaining to request a refund.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Refundable until:{' '}
                  {new Date(receipt.refundableUntil).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Refund Window Expired</h3>
                <p className="text-sm text-gray-700">
                  The refund window for this transaction has ended.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Download Button */}
        <Button variant="primary" fullWidth onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2 inline" />
          Download Receipt (TXT)
        </Button>

        {/* Footer Note */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <p className="text-xs text-indigo-900 text-center">
            <strong>Thank you!</strong> Your support helps us maintain and improve DrinkBot3000 for
            everyone. This is a voluntary contribution to support responsible drinking awareness.
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-600">
            Questions about this receipt?
            <br />
            Email:{' '}
            <a
              href="mailto:drinkbot3000@gmail.com"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              drinkbot3000@gmail.com
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
}

ReceiptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  receipt: PropTypes.shape({
    id: PropTypes.string,
    date: PropTypes.number,
    status: PropTypes.string,
    description: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stripeFee: PropTypes.string,
    netAmount: PropTypes.string,
    paymentMethod: PropTypes.string,
    refundableUntil: PropTypes.number,
  }),
};
