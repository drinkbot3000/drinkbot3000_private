/**
 * HelpModal Component
 * Displays help information and usage instructions
 */

import React from 'react';
import Modal from '../common/Modal';
import { Activity, Calculator, AlertCircle } from 'lucide-react';

/**
 * HelpModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback to close modal
 */
const HelpModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Use DrinkBot3000"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Tracker Tab Section */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Tracker Tab
          </h3>
          <ul className="text-sm text-indigo-800 space-y-2">
            <li><strong>1.</strong> Log each drink as you consume it using the drink buttons</li>
            <li><strong>2.</strong> Your BAC (Blood Alcohol Content) is estimated in real-time</li>
            <li><strong>3.</strong> The color-coded display shows your current state:
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <strong>Green:</strong> Sober</li>
                <li>• <strong>Yellow:</strong> Buzzed (caution)</li>
                <li>• <strong>Orange:</strong> Impaired (do not drive)</li>
                <li>• <strong>Red:</strong> Dangerously intoxicated</li>
              </ul>
            </li>
            <li><strong>4.</strong> View elapsed time and estimated time until sober</li>
          </ul>
        </div>

        {/* Calculator Tab Section */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Calculator Tab
          </h3>
          <p className="text-sm text-purple-800 mb-2">
            Plan ahead or check what your BAC might be:
          </p>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Enter number of drinks and time period</li>
            <li>• Get estimated BAC without logging drinks</li>
            <li>• Useful for planning your night</li>
          </ul>
        </div>

        {/* Common Drink Types Section */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Common Drink Types</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li><strong>Beer (12oz):</strong> ~5% ABV standard</li>
            <li><strong>Wine (5oz):</strong> ~12% ABV</li>
            <li><strong>Shot (1.5oz):</strong> ~40% ABV (vodka, whiskey, etc.)</li>
            <li><strong>Cocktail:</strong> Typically 1-2 standard drinks</li>
            <li><strong>Custom:</strong> Enter your own oz + ABV%</li>
          </ul>
        </div>

        {/* Important Reminders Section */}
        <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Important Reminders
          </h3>
          <ul className="text-xs text-amber-900 space-y-1">
            <li>• BAC estimates are approximations only</li>
            <li>• Never drive if you've been drinking</li>
            <li>• Everyone metabolizes alcohol differently</li>
            <li>• When in doubt, wait it out or call a ride</li>
            <li>• This app does not replace medical advice</li>
          </ul>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Tips for Best Results</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Log drinks immediately when consumed</li>
            <li>• Be honest about drink sizes and strength</li>
            <li>• Check your profile in Settings (gender & weight affect BAC)</li>
            <li>• Use the Calculator to plan ahead</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default HelpModal;
