/**
 * SettingsModal Component
 * User profile and app settings
 */

import React from 'react';
import { FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../common';
import { COLORS, RADIUS, SPACING } from '../../styles/designTokens';
import type { Gender } from '../../types';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gender: Gender | null;
  weight: string;
  editMode: boolean;
  editGender: Gender | null;
  editWeight: string;
  weightError: string;
  useSlowMetabolism: boolean;
  onEditModeToggle: () => void;
  onGenderChange: (gender: Gender) => void;
  onWeightChange: (weight: string) => void;
  onMetabolismChange: (checked: boolean) => void;
  onSaveSettings: () => void;
  onCancelEdit: () => void;
  onShowRefundPolicy: () => void;
}

/**
 * SettingsModal Component
 */
export function SettingsModal({
  isOpen,
  onClose,
  gender,
  weight,
  editMode,
  editGender,
  editWeight,
  weightError,
  useSlowMetabolism,
  onEditModeToggle,
  onGenderChange,
  onWeightChange,
  onMetabolismChange,
  onSaveSettings,
  onCancelEdit,
  onShowRefundPolicy,
}: SettingsModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Your Profile</h3>
            {!editMode && (
              <button
                onClick={onEditModeToggle}
                className={`text-sm ${COLORS.primary.text} ${COLORS.primary.textHover} font-medium`}
              >
                Edit
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Gender:</strong>{' '}
                {gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Not set'}
              </p>
              <p>
                <strong>Weight:</strong> {weight ? `${weight} lbs` : 'Not set'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className={`flex ${SPACING.gap.medium}`}>
                  <button
                    onClick={() => onGenderChange('male')}
                    className={`flex-1 py-2 px-4 ${RADIUS.medium} font-medium transition ${
                      editGender === 'male'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => onGenderChange('female')}
                    className={`flex-1 py-2 px-4 ${RADIUS.medium} font-medium transition ${
                      editGender === 'female'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => onWeightChange(e.target.value)}
                  className={`w-full px-4 py-2 border border-gray-300 ${RADIUS.medium} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Enter weight (50-500)"
                  min="50"
                  max="500"
                />
                {weightError && <p className="text-sm text-red-600 mt-1">{weightError}</p>}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-900">
                  <strong>Warning:</strong> Changing your profile will reset your current BAC
                  tracking and drink history.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={onCancelEdit}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={onSaveSettings}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Metabolism Settings */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 text-sm mb-1">Metabolism Variability</h3>
              <p className="text-xs text-amber-800 mb-3">
                Alcohol metabolism varies significantly between individuals. Studies show metabolism
                can be up to twice as slow for some people due to genetics, medications, health
                conditions, and other factors.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useSlowMetabolism}
              onChange={(e) => onMetabolismChange(e.target.checked)}
              className="mt-1 w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-amber-900 block">
                Use Slower Metabolism Rate
              </span>
              <span className="text-xs text-amber-800">
                Enables more conservative calculations (half speed: 0.005%/hour instead of
                0.010%/hour) for safer estimates.
              </span>
            </div>
          </label>
        </div>

        {/* Legal Links */}
        <div className="space-y-3">
          <Button
            as="a"
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            fullWidth
            className="text-center"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Privacy Policy
          </Button>

          <Button
            as="a"
            href="/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            fullWidth
            className="text-center"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Terms of Service
          </Button>

          <Button onClick={onShowRefundPolicy} variant="outline" fullWidth>
            <DollarSign className="w-4 h-4 inline mr-2" />
            Refund Policy
          </Button>
        </div>

        {/* Version Info */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <p className="text-xs text-indigo-900">
            <strong>Version:</strong> 1.0.0
            <br />
            <strong>Made with:</strong> Responsibility & Care 🤖
          </p>
        </div>
      </div>
    </Modal>
  );
}
