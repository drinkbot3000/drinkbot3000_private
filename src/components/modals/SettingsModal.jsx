/**
 * SettingsModal Component
 * User profile settings with edit functionality
 */

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FileText, DollarSign } from 'lucide-react';

/**
 * SettingsModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback to close modal
 * @param {string} props.currentGender - Current user gender ('male' or 'female')
 * @param {string} props.currentWeight - Current user weight in lbs
 * @param {Function} props.onSaveSettings - Callback when settings are saved (gender, weight)
 * @param {Function} props.onShowRefundPolicy - Callback to show refund policy modal
 */
const SettingsModal = ({
  isOpen,
  onClose,
  currentGender,
  currentWeight,
  onSaveSettings,
  onShowRefundPolicy
}) => {
  // Internal edit state
  const [editMode, setEditMode] = useState(false);
  const [editGender, setEditGender] = useState(currentGender || '');
  const [editWeight, setEditWeight] = useState(currentWeight || '');
  const [weightError, setWeightError] = useState('');

  // Reset form when modal opens/closes or current values change
  useEffect(() => {
    if (isOpen) {
      setEditGender(currentGender || '');
      setEditWeight(currentWeight || '');
      setWeightError('');
      setEditMode(false);
    }
  }, [isOpen, currentGender, currentWeight]);

  const handleCancel = () => {
    setEditMode(false);
    setEditGender(currentGender || '');
    setEditWeight(currentWeight || '');
    setWeightError('');
  };

  const handleSave = () => {
    // Validate weight
    const numWeight = parseFloat(editWeight);
    if (isNaN(numWeight) || numWeight < 50 || numWeight > 500) {
      setWeightError('Weight must be between 50 and 500 lbs');
      return;
    }

    // Validate gender
    if (!editGender || !['male', 'female'].includes(editGender)) {
      setWeightError('Please select a valid gender');
      return;
    }

    // Call parent save handler
    if (onSaveSettings) {
      onSaveSettings(editGender, editWeight);
    }

    // Reset edit mode
    setEditMode(false);
    setWeightError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Your Profile</h3>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {!editMode ? (
            // Display Mode
            <div className="space-y-2 text-sm">
              <p>
                <strong>Gender:</strong>{' '}
                {currentGender === 'male' ? 'Male' : currentGender === 'female' ? 'Female' : 'Not set'}
              </p>
              <p>
                <strong>Weight:</strong> {currentWeight ? `${currentWeight} lbs` : 'Not set'}
              </p>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditGender('male')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      editGender === 'male'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setEditGender('female')}
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

              {/* Weight Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => {
                    setEditWeight(e.target.value);
                    setWeightError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter weight (50-500)"
                  min="50"
                  max="500"
                />
                {weightError && (
                  <p className="text-sm text-red-600 mt-1">{weightError}</p>
                )}
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-900">
                  <strong>Warning:</strong> Changing your profile will reset your current BAC tracking and drink history.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Legal Links Section */}
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

        {/* App Info */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <p className="text-xs text-indigo-900">
            <strong>Version:</strong> 1.0.0<br />
            <strong>Made with:</strong> Responsibility & Care 🤖
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
