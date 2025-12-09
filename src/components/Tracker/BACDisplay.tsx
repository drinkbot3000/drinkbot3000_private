/**
 * BACDisplay Component
 * Displays current BAC with status and warnings
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface BACDisplayStatus {
  bgColor: string;
  label: string;
  message: string;
}

/**
 * Get BAC status colors and styling
 */
function getBACDisplayStatus(bac: number): BACDisplayStatus {
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

export interface BACDisplayProps {
  bac: number;
  hasBeenImpaired: boolean;
}

/**
 * BACDisplay Component
 */
export function BACDisplay({ bac, hasBeenImpaired }: BACDisplayProps): JSX.Element {
  const status = getBACDisplayStatus(bac);

  return (
    <>
      {/* Main BAC Display */}
      <div className={`rounded-2xl shadow-xl p-8 mb-6 ${status.bgColor}`}>
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-2">{bac.toFixed(3)}%</div>
          <div className="text-xl text-white font-medium mb-4">{status.label}</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-white text-sm">{status.message}</p>
          </div>
        </div>
      </div>

      {/* Impairment History Warning */}
      {hasBeenImpaired && bac > 0 && (
        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-900 font-bold mb-1">⚠️ IMPAIRMENT WARNING</p>
              <p className="text-red-800 text-sm">
                You have exceeded the legal limit during this session. DO NOT DRIVE until your BAC
                reaches 0.00% and you feel fully recovered.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
