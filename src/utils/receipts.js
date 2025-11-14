/**
 * Receipt Management Utilities
 * Handles receipt generation and download
 */

import { formatCurrency, formatDateTime } from './formatters';

/**
 * Generate a unique receipt ID
 *
 * @returns {string} Unique receipt ID
 *
 * @example
 * generateReceiptId()
 * // Returns: "DBT-1699564800000-ABC123XYZ"
 */
export const generateReceiptId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `DBT-${timestamp}-${random}`;
};

/**
 * Create a receipt object
 *
 * @param {Object} params - Receipt parameters
 * @param {number} params.amount - Amount in dollars
 * @param {string} params.method - Payment method
 * @param {string} params.description - Receipt description
 * @returns {Object} Receipt object
 *
 * @example
 * createReceipt({ amount: 5, method: 'Stripe', description: 'Tip' })
 */
export const createReceipt = (params) => {
  const { amount, method = 'Stripe', description = 'Support Tip' } = params;

  return {
    id: generateReceiptId(),
    timestamp: Date.now(),
    amount: parseFloat(amount),
    method,
    description,
    appName: 'DrinkBot3000',
    appVersion: '1.0.0',
    contact: 'drinkbot3000@gmail.com'
  };
};

/**
 * Format receipt as plain text
 *
 * @param {Object} receipt - Receipt object
 * @returns {string} Formatted receipt text
 */
export const formatReceiptText = (receipt) => {
  const {
    id,
    timestamp,
    amount,
    method,
    description,
    appName,
    contact
  } = receipt;

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ${appName || 'DrinkBot3000'}
            PAYMENT RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Receipt ID: ${id}
Date: ${formatDateTime(timestamp)}

Description: ${description}
Payment Method: ${method}
Amount: ${formatCurrency(amount)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for supporting DrinkBot3000!

Your contribution helps us:
• Maintain and improve the app
• Provide free safety features
• Spread awareness about responsible drinking
• Save lives by preventing drunk driving

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REFUND POLICY:
Refunds available within 30 days
Contact: ${contact || 'drinkbot3000@gmail.com'}
Subject: "Refund Request - ${id}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Drink Responsibly. Never Drink and Drive.

This is a digital receipt.
Keep for your records.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
};

/**
 * Download receipt as text file
 *
 * @param {Object} receipt - Receipt object
 * @returns {boolean} True if successful
 */
export const downloadReceipt = (receipt) => {
  try {
    const text = formatReceiptText(receipt);
    const filename = `DrinkBot3000_Receipt_${receipt.id}.txt`;

    // Create blob
    const blob = new Blob([text], { type: 'text/plain' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;

  } catch (error) {
    console.error('Error downloading receipt:', error);
    return false;
  }
};

/**
 * Validate receipt object
 *
 * @param {Object} receipt - Receipt to validate
 * @returns {boolean} True if valid
 */
export const validateReceipt = (receipt) => {
  if (!receipt || typeof receipt !== 'object') {
    return false;
  }

  const required = ['id', 'timestamp', 'amount', 'method'];

  for (const field of required) {
    if (!(field in receipt)) {
      return false;
    }
  }

  if (typeof receipt.amount !== 'number' || receipt.amount <= 0) {
    return false;
  }

  if (typeof receipt.timestamp !== 'number') {
    return false;
  }

  return true;
};

/**
 * Check if receipt is within refund window
 *
 * @param {Object} receipt - Receipt object
 * @param {number} windowDays - Refund window in days (default: 30)
 * @returns {boolean} True if within refund window
 */
export const isWithinRefundWindow = (receipt, windowDays = 30) => {
  if (!receipt || !receipt.timestamp) {
    return false;
  }

  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const age = Date.now() - receipt.timestamp;

  return age <= windowMs;
};

/**
 * Format receipt for email
 *
 * @param {Object} receipt - Receipt object
 * @returns {string} Email body text
 */
export const formatReceiptForEmail = (receipt) => {
  const text = formatReceiptText(receipt);

  return `Hi,

I'm writing to request a refund for the following transaction:

${text}

Thank you!`;
};
