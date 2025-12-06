/**
 * Calculator Component
 * BAC estimation calculator
 */

import React from 'react';
import { Button } from '../common';
import { AlertCircle } from 'lucide-react';
import type { Gender } from '../../types';

interface CalculatorStatus {
  bgColor: string;
  label: string;
  message: string;
}

interface CalculatorProps {
  drinks: string;
  hours: string;
  calculatedBAC: number | null;
  gender: Gender | null;
  onDrinksChange: (value: string) => void;
  onHoursChange: (value: string) => void;
  onCalculate: () => void;
}

/**
 * Get BAC status for display
 */
function getCalculatorStatus(bac: number): CalculatorStatus {
  if (bac === 0) {
    return {
      bgColor: 'bg-gradient-to-r from-green-600 to-emerald-600',
      label: 'Sober',
      message: 'Safe to drive',
    };
  } else if (bac < 0.02) {
    return {
      bgColor: 'bg-gradient-to-r from-green-500 to-teal-500',
      label: 'Minimal Impairment',
      message: 'Effects barely noticeable - still, do not drive',
    };
  } else if (bac < 0.05) {
    return {
      bgColor: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      label: 'Light Impairment',
      message: 'DO NOT DRIVE - Judgment and coordination affected',
    };
  } else if (bac < 0.08) {
    return {
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
      label: 'Moderate Impairment',
      message: 'DO NOT DRIVE - Significant impairment',
    };
  } else if (bac < 0.15) {
    return {
      bgColor: 'bg-gradient-to-r from-red-600 to-red-700',
      label: 'Legally Intoxicated',
      message: 'DO NOT DRIVE - Highly dangerous',
    };
  } else {
    return {
      bgColor: 'bg-gradient-to-r from-red-700 to-red-900',
      label: 'Severe Intoxication',
      message: 'SEEK MEDICAL ATTENTION - Dangerous level',
    };
  }
}

export function Calculator({
  drinks,
  hours,
  calculatedBAC,
  gender,
  onDrinksChange,
  onHoursChange,
  onCalculate,
}: CalculatorProps): JSX.Element {
  const status = calculatedBAC !== null ? getCalculatorStatus(calculatedBAC) : null;
  const isValid = drinks && hours;

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">BAC Calculator</h3>
      <p className="text-sm text-gray-600 mb-6">
        Estimate your BAC based on drinks consumed and time elapsed.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Standard Drinks
          </label>
          <input
            type="number"
            value={drinks}
            onChange={(e) => onDrinksChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="e.g., 3"
            min="0"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hours Since First Drink
          </label>
          <input
            type="number"
            value={hours}
            onChange={(e) => onHoursChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="e.g., 2"
            min="0"
            step="0.1"
          />
        </div>

        <Button variant="primary" size="md" fullWidth onClick={onCalculate} disabled={!isValid}>
          Calculate BAC
        </Button>

        {/* Results Display */}
        {status && calculatedBAC !== null && (
          <div className={`rounded-lg p-6 ${status.bgColor}`}>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">{calculatedBAC.toFixed(3)}%</div>
              <div className="text-xl text-white font-medium mb-3">{status.label}</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white text-sm">{status.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> This calculator uses your saved profile ({gender || 'not set'},
              weight configured). Results are estimates only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
