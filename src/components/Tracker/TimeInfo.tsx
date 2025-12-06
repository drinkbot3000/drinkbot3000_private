/**
 * TimeInfo Component
 * Displays elapsed time and time until sober
 */

import React from 'react';
import { Clock, Coffee } from 'lucide-react';
import { calculateElapsedTime, formatSoberDuration } from '../../utils';
import { calculateSoberTime } from '../../services';

export interface TimeInfoProps {
  startTime: number | null;
  bac: number;
  useSlowMetabolism: boolean;
}

/**
 * TimeInfo Component
 */
export function TimeInfo({ startTime, bac, useSlowMetabolism }: TimeInfoProps): JSX.Element | null {
  if (!startTime) return null;

  const elapsedTime = calculateElapsedTime(startTime);
  const soberTime = calculateSoberTime(bac, useSlowMetabolism);
  const soberDuration = formatSoberDuration(soberTime);

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-800">{elapsedTime}</div>
          <div className="text-xs text-gray-500">Time Elapsed</div>
        </div>
        <div>
          <Coffee className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-800">{soberDuration}</div>
          <div className="text-xs text-gray-500">Until Sober</div>
        </div>
      </div>
    </div>
  );
}
