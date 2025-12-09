/**
 * Setup Component
 * User profile setup with gender and weight
 */

import React from 'react';
import { User, Scale } from 'lucide-react';
import { Button } from '../common';
import type { Gender } from '../../types';

interface SetupProps {
  gender: Gender | null;
  weight: string;
  weightError: string;
  onGenderChange: (gender: Gender) => void;
  onWeightChange: (weight: string) => void;
  onSubmit: () => void;
}

export function Setup({
  gender,
  weight,
  weightError,
  onGenderChange,
  onWeightChange,
  onSubmit,
}: SetupProps): JSX.Element {
  const isFormValid = gender && weight && !weightError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-6xl">🤖</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DrinkBot3000</h1>
          <p className="text-gray-600">Track your blood alcohol content</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onGenderChange('male')}
                className={`py-3 px-4 rounded-lg font-medium transition ${
                  gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => onGenderChange('female')}
                className={`py-3 px-4 rounded-lg font-medium transition ${
                  gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Scale className="inline w-4 h-4 mr-1" />
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              placeholder="Enter your weight"
              className={`w-full px-4 py-3 border rounded-lg ${
                weightError ? 'border-red-500' : 'border-gray-300'
              }`}
              min="50"
              max="500"
            />
            {weightError && <p className="text-red-600 text-sm mt-1">{weightError}</p>}
          </div>

          <Button variant="primary" size="md" fullWidth onClick={onSubmit} disabled={!isFormValid}>
            Start Tracking
          </Button>
        </div>
      </div>
    </div>
  );
}
