/**
 * HelpModal Component
 * Instructions on how to use DrinkBot3000
 */

import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { Modal } from '../common';

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * HelpModal Component
 */
export function HelpModal({ isOpen, onClose }: HelpModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Use DrinkBot3000">
      <div className="space-y-6">
        {/* How It Works */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            How It Works
          </h3>
          <ul className="text-sm text-indigo-800 space-y-2">
            <li>
              <strong>1.</strong> Log each drink as you consume it using the preset drink buttons (beer, wine, shot, cocktail) or create a custom drink
            </li>
            <li>
              <strong>2.</strong> Your BAC (Blood Alcohol Content) is calculated in real-time based on your profile (gender and weight)
            </li>
            <li>
              <strong>3.</strong> The color-coded display shows your current state:
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  • <strong>Green:</strong> Sober (0.00%)
                </li>
                <li>
                  • <strong>Yellow:</strong> Buzzed - use caution (0.01-0.04%)
                </li>
                <li>
                  • <strong>Orange:</strong> Impaired - DO NOT DRIVE (0.05-0.07%)
                </li>
                <li>
                  • <strong>Red:</strong> Legally intoxicated or dangerously high (0.08%+)
                </li>
              </ul>
            </li>
            <li>
              <strong>4.</strong> Track your session with elapsed time and estimated time until sober
            </li>
            <li>
              <strong>5.</strong> View your drink history and manage your drinks (undo last, clear all, or delete specific drinks)
            </li>
          </ul>
        </div>

        {/* Common Drink Types */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Common Drink Types</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>
              <strong>Beer (12oz):</strong> ~5% ABV standard
            </li>
            <li>
              <strong>Wine (5oz):</strong> ~12% ABV
            </li>
            <li>
              <strong>Shot (1.5oz):</strong> ~40% ABV (vodka, whiskey, etc.)
            </li>
            <li>
              <strong>Cocktail:</strong> Typically 1-2 standard drinks
            </li>
            <li>
              <strong>Custom:</strong> Enter your own oz + ABV%
            </li>
          </ul>
        </div>

        {/* Important Reminders */}
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

        {/* Tips for Best Results */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Tips for Best Results</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Log drinks immediately as you consume them for accurate tracking</li>
            <li>• Be honest about drink sizes and alcohol strength</li>
            <li>• Update your profile in Settings if needed (gender & weight significantly affect BAC)</li>
            <li>• Use custom drinks for mixed beverages or non-standard sizes</li>
            <li>• Save frequently used custom drinks for quick logging</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
