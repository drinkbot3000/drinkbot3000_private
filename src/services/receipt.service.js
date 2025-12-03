/**
 * Receipt Service
 * Functions for generating and managing payment receipts
 */

import { CONSTANTS, EMOJIS } from '../constants';

/**
 * Generate a new receipt
 * @param {number} amount - Payment amount
 * @param {string} paymentMethod - Payment method (default: 'Stripe')
 * @returns {Object} Receipt object
 */
export const generateReceipt = (amount, paymentMethod = 'Stripe') => {
  const stripeFee = amount * 0.029 + 0.30;
  const netAmount = amount - stripeFee;

  return {
    id: `DBT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    date: new Date().toISOString(),
    amount: amount,
    stripeFee: stripeFee.toFixed(2),
    netAmount: netAmount.toFixed(2),
    paymentMethod: paymentMethod,
    description: 'Developer Support - DrinkBot3000',
    status: 'Completed',
    refundableUntil: new Date(
      Date.now() + CONSTANTS.REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
};

/**
 * Format receipt as plain text for download
 * @param {Object} receipt - Receipt object
 * @returns {string} Formatted receipt text
 */
export const formatReceiptText = (receipt) => {
  return `
╔═══════════════════════════════════════════════════════════╗
║              DRINKBOT3000 - PAYMENT RECEIPT               ║
║                   Developer Support                        ║
╚═══════════════════════════════════════════════════════════╝

Receipt #: ${receipt.id}
Date: ${new Date(receipt.date).toLocaleString()}
Status: ${receipt.status}

─────────────────────────────────────────────────────────────

Description: ${receipt.description}
Support Amount: $${receipt.amount.toFixed(2)}
Processing Fee: -$${receipt.stripeFee}
Net Amount: $${receipt.netAmount}

Payment Method: ${receipt.paymentMethod}
Payment Processor: Stripe, Inc.

─────────────────────────────────────────────────────────────

REFUND POLICY:
Eligible for refund until: ${new Date(receipt.refundableUntil).toLocaleDateString()}
Refund window: ${CONSTANTS.REFUND_WINDOW_DAYS} days from purchase date

To request a refund:
1. Email: support@drinkbot3000.com
2. Subject: "Refund Request - ${receipt.id}"
3. Include this receipt number

─────────────────────────────────────────────────────────────

TERMS:
- This is a voluntary tip/donation to support DrinkBot3000
- All sales are final after ${CONSTANTS.REFUND_WINDOW_DAYS} days
- For questions, email: support@drinkbot3000.com

Thank you for supporting responsible drinking awareness!

DrinkBot3000 - Your Safety Companion ${EMOJIS.ROBOT}
────────────────────────────────────────────────────────────

This receipt is valid proof of payment.
Keep this for your records.
`.trim();
};

/**
 * Download receipt as text file
 * @param {Object} receipt - Receipt object
 */
export const downloadReceipt = (receipt) => {
  const receiptText = formatReceiptText(receipt);
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `DrinkBot3000-Receipt-${receipt.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Check if receipt is still refundable
 * @param {Object} receipt - Receipt object
 * @returns {boolean} True if refundable
 */
export const isRefundable = (receipt) => {
  return new Date() < new Date(receipt.refundableUntil);
};

/**
 * Get days remaining for refund
 * @param {Object} receipt - Receipt object
 * @returns {number} Days remaining (or 0 if expired)
 */
export const getDaysUntilRefundExpires = (receipt) => {
  const now = new Date();
  const expiryDate = new Date(receipt.refundableUntil);
  const diffTime = expiryDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};
