/**
 * RefundPolicyModal Component
 * Displays refund policy information
 */

import React from 'react';
import { DollarSign, CheckCircle, Mail, Clock } from 'lucide-react';
import { Modal } from '../common';

export interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * RefundPolicyModal Component
 */
export function RefundPolicyModal({ isOpen, onClose }: RefundPolicyModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Refund Policy">
      <div className="space-y-6">
        {/* Policy Overview */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">100% Satisfaction Guarantee</h3>
              <p className="text-sm text-green-800">
                We stand behind our product. If you're not completely satisfied with DrinkBot3000,
                we'll refund your purchase—no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Refund Window */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm mb-2">30-Day Refund Window</h3>
              <p className="text-sm text-blue-800">
                You have <strong>30 days from your purchase date</strong> to request a full refund.
                This gives you plenty of time to try DrinkBot3000 and ensure it meets your needs.
              </p>
            </div>
          </div>
        </div>

        {/* How to Request */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-600" />
            How to Request a Refund
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <strong>Send us an email</strong> at{' '}
                  <a
                    href="mailto:drinkbot3000@gmail.com"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    drinkbot3000@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <strong>Include your receipt number</strong> (found in your payment confirmation
                  email or receipt)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <strong>We'll process your refund</strong> within 2-3 business days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Method */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-indigo-900 text-sm mb-2">Refund Method</h3>
              <p className="text-sm text-indigo-800">
                Refunds are processed through the original payment method via Stripe. You'll receive
                your money back in the same account or card you used for the purchase. Depending on
                your bank, it may take 5-10 business days for the refund to appear in your account.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Questions about our refund policy?
            <br />
            Contact us at{' '}
            <a
              href="mailto:drinkbot3000@gmail.com"
              className="text-blue-600 hover:text-blue-700 underline font-medium"
            >
              drinkbot3000@gmail.com
            </a>
          </p>
        </div>
      </div>
    </Modal>
  );
}
