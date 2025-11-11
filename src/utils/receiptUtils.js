import CONSTANTS from '../constants/appConstants';

/**
 * Generate a receipt for a payment
 * @param {number} amount - Payment amount
 * @param {string} paymentMethod - Payment method
 * @returns {Object} Receipt object
 */
export const generateReceipt = (amount, paymentMethod = 'Stripe') => {
  const receipt = {
    id: `DBT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    date: new Date().toISOString(),
    amount: amount,
    stripeFee: (amount * 0.029 + 0.30).toFixed(2),
    netAmount: (amount - (amount * 0.029 + 0.30)).toFixed(2),
    paymentMethod: paymentMethod,
    description: 'Developer Support - DrinkBot3000',
    status: 'Completed',
    refundableUntil: new Date(Date.now() + (CONSTANTS.REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000)).toISOString(),
  };

  return receipt;
};

/**
 * Download receipt as text file
 * @param {Object} receipt - Receipt object
 */
export const downloadReceipt = (receipt) => {
  const receiptText = `
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

THANK YOU FOR YOUR SUPPORT!

Your contribution helps keep DrinkBot3000 free and ad-free
for everyone.

Questions? Contact: support@drinkbot3000.com

© ${new Date().getFullYear()} DrinkBot3000. All rights reserved.
`;

  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DrinkBot3000-Receipt-${receipt.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};
