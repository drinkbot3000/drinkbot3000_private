/**
 * SettingsModal Component
 * User profile and app settings
 */

import React from 'react';
import { FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../common';

/**
 * SettingsModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.gender - Current gender
 * @param {string} props.weight - Current weight
 * @param {boolean} props.editMode - Whether in edit mode
 * @param {string} props.editGender - Edit mode gender
 * @param {string} props.editWeight - Edit mode weight
 * @param {string} props.weightError - Weight validation error
 * @param {boolean} props.useSlowMetabolism - Use slow metabolism setting
 * @param {Function} props.onEditModeToggle - Toggle edit mode
 * @param {Function} props.onGenderChange - Handler for gender change
 * @param {Function} props.onWeightChange - Handler for weight change
 * @param {Function} props.onMetabolismChange - Handler for metabolism setting
 * @param {Function} props.onSaveSettings - Handler for save button
 * @param {Function} props.onCancelEdit - Handler for cancel button
 * @param {Function} props.onShowRefundPolicy - Handler for refund policy button
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
}) {
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
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                <div className="flex gap-3">
                  <button
                    onClick={() => onGenderChange('male')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      editGender === 'male'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => onGenderChange('female')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      editGender === 'female'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => onWeightChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <h3 className="font-semibold text-amber-900 text-sm mb-1">
                Metabolism Variability
              </h3>
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
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition text-center"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Privacy Policy
          </a>

          <a
            href="/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition text-center"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Terms of Service
          </a>

          <button
            onClick={onShowRefundPolicy}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            <DollarSign className="w-4 h-4 inline mr-2" />
            Refund Policy
          </button>
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
