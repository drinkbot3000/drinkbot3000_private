/**
 * TrackerInterface Component
 * Drink planner: select a target BAC, enter a time window, and see how many
 * standard drinks are needed to reach that level.
 */

import React, { useState, useMemo } from 'react';
import { Scale, Clock, Wine } from 'lucide-react';
import PWAInstallPrompt from '../PWAInstallPrompt';
import { PWAProvider } from '../contexts/PWAContext';
import { MainLayout } from './MainLayout';
import { ConfirmModal, Modal } from './common';
import { MessageDisplay } from './Tracker';
import { HelpModal, SettingsModal } from './Modals';
import FeatureErrorBoundary from './FeatureErrorBoundary';
import { CONSTANTS } from '../constants';
import type { Gender } from '../types';

interface TrackerState {
  // User profile
  gender: Gender | null;
  weight: string;
  useSlowMetabolism: boolean;

  // Modals
  showHelp: boolean;
  showSettings: boolean;
  showConfirmModal: boolean;
  showAgeRestrictionModal: boolean;

  // Settings modal
  settingsEditMode: boolean;
  settingsEditGender: Gender | null;
  settingsEditWeight: string;
  weightError: string;

  // Confirm modal
  confirmModalMessage: string;
  confirmModalAction: (() => void) | null;

  // Robot messages
  robotMessage: string;
  currentJoke: string;
  showJoke: boolean;
}

interface SettingsHandlers {
  handleSettingsEditToggle: () => void;
  handleSettingsSave: () => void;
  handleSettingsCancel: () => void;
}

interface TrackerInterfaceProps {
  state: TrackerState;
  setField: (field: string, value: unknown) => void;
  setMultiple: (fields: Record<string, unknown>) => void;
  settingsHandlers: SettingsHandlers;
  hideConfirm: () => void;
}

/** Target BAC level presets */
const BAC_LEVELS = [
  { value: 0.03, label: '0.03', description: 'Light' },
  { value: 0.06, label: '0.06', description: 'Moderate' },
  { value: 0.09, label: '0.09', description: 'Strong' },
] as const;

/**
 * Calculate the number of standard drinks needed to reach a target BAC
 * over a given time period.
 *
 * BAC = (drinks * GRAMS_PER_STANDARD_DRINK) / (weightKg * bodyWater) - metabolismRate * hours
 * Solving for drinks:
 *   drinks = (targetBAC + metabolismRate * hours) * (weightKg * bodyWater) / GRAMS_PER_STANDARD_DRINK
 */
function calculateDrinksNeeded(
  targetBAC: number,
  weightLbs: number,
  gender: Gender,
  hours: number,
  useSlowMetabolism: boolean
): number {
  const weightKg = weightLbs * CONSTANTS.LBS_TO_KG;
  const bodyWater =
    gender === 'male' ? CONSTANTS.MALE_BODY_WATER : CONSTANTS.FEMALE_BODY_WATER;
  const metabolismRate = useSlowMetabolism
    ? CONSTANTS.SLOW_METABOLISM_RATE
    : CONSTANTS.METABOLISM_RATE;

  const drinks =
    (targetBAC + metabolismRate * hours) *
    ((weightKg * bodyWater) / CONSTANTS.GRAMS_PER_STANDARD_DRINK);

  return Math.max(0, drinks);
}

export const TrackerInterface: React.FC<TrackerInterfaceProps> = ({
  state,
  setField,
  setMultiple: _setMultiple,
  settingsHandlers,
  hideConfirm,
}) => {
  const [selectedBAC, setSelectedBAC] = useState<number | null>(null);
  const [hours, setHours] = useState('');

  const weightNum = parseFloat(state.weight) || 0;
  const weightValid = weightNum >= CONSTANTS.MIN_WEIGHT && weightNum <= CONSTANTS.MAX_WEIGHT;
  const hoursNum = parseFloat(hours) || 0;
  const hoursValid = hours === '' || (hoursNum >= 0 && hoursNum <= 72);

  const canCalculate =
    weightValid && selectedBAC !== null && state.gender !== null && hours !== '' && hoursValid && hoursNum > 0;

  const drinksNeeded = useMemo(() => {
    if (!canCalculate) return null;
    return calculateDrinksNeeded(
      selectedBAC!,
      weightNum,
      state.gender!,
      hoursNum,
      state.useSlowMetabolism
    );
  }, [canCalculate, selectedBAC, weightNum, state.gender, hoursNum, state.useSlowMetabolism]);

  return (
    <PWAProvider>
      <MainLayout
        onSettingsClick={() => setField('showSettings', true)}
        onHelpClick={() => setField('showHelp', true)}
      >
        <MessageDisplay
          robotMessage={state.robotMessage}
          joke={state.currentJoke}
          showJoke={state.showJoke}
        />

        {/* Mass / Weight Input */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-800">Your Mass</h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="decimal"
              value={state.weight}
              onChange={(e) => setField('weight', e.target.value)}
              className={`flex-1 text-3xl font-bold text-center py-3 border-2 rounded-xl transition
                ${weightValid ? 'border-indigo-200 focus:border-indigo-500' : 'border-red-300 focus:border-red-500'}
                outline-none`}
              placeholder="150"
              min={CONSTANTS.MIN_WEIGHT}
              max={CONSTANTS.MAX_WEIGHT}
            />
            <span className="text-gray-500 font-medium text-lg">lbs</span>
          </div>
          {state.weight && !weightValid && (
            <p className="text-red-500 text-sm mt-2">
              Enter a weight between {CONSTANTS.MIN_WEIGHT} and {CONSTANTS.MAX_WEIGHT} lbs
            </p>
          )}
        </div>

        {/* Target BAC Level */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Target BAC</h3>
          <div className="grid grid-cols-3 gap-3">
            {BAC_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedBAC(level.value)}
                className={`flex flex-col items-center justify-center p-5 rounded-xl font-medium transition
                  ${
                    selectedBAC === level.value
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2'
                      : 'bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200'
                  }`}
              >
                <span className={`text-2xl font-bold ${selectedBAC === level.value ? 'text-white' : 'text-indigo-700'}`}>
                  {level.label}
                </span>
                <span className={`text-xs mt-1 ${selectedBAC === level.value ? 'text-indigo-100' : 'text-indigo-500'}`}>
                  {level.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Input */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-800">Drinking Window</h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="decimal"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className={`flex-1 text-3xl font-bold text-center py-3 border-2 rounded-xl transition
                ${hoursValid ? 'border-indigo-200 focus:border-indigo-500' : 'border-red-300 focus:border-red-500'}
                outline-none`}
              placeholder="2"
              min={0}
              max={72}
              step="0.5"
            />
            <span className="text-gray-500 font-medium text-lg">hours</span>
          </div>
          {hours !== '' && !hoursValid && (
            <p className="text-red-500 text-sm mt-2">Enter a value between 0 and 72 hours</p>
          )}
        </div>

        {/* Drinks Needed Result */}
        {drinksNeeded !== null && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow">
            <div className="flex items-center gap-3 mb-4">
              <Wine className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-800">Standard Drinks Needed</h3>
            </div>
            <div className="text-center">
              <span className="text-5xl font-bold text-indigo-700">
                {drinksNeeded.toFixed(1)}
              </span>
              <p className="text-gray-500 text-sm mt-2">
                standard drinks over {hoursNum} hour{hoursNum !== 1 ? 's' : ''} to reach {selectedBAC} BAC
              </p>
              {selectedBAC! >= CONSTANTS.LEGAL_LIMIT && (
                <p className="text-red-600 text-sm font-semibold mt-3">
                  This target exceeds the legal limit of {CONSTANTS.LEGAL_LIMIT} BAC. Do not drive.
                </p>
              )}
            </div>
          </div>
        )}
      </MainLayout>

      {/* Modals */}
      <HelpModal isOpen={state.showHelp} onClose={() => setField('showHelp', false)} />
      <FeatureErrorBoundary
        featureName="Settings"
        featureDescription="update your profile settings"
        showSafetyNote={false}
      >
        <SettingsModal
          isOpen={state.showSettings}
          onClose={() => setField('showSettings', false)}
          gender={state.gender}
          weight={state.weight}
          editMode={state.settingsEditMode}
          editGender={state.settingsEditGender}
          editWeight={state.settingsEditWeight}
          weightError={state.weightError}
          useSlowMetabolism={state.useSlowMetabolism}
          onEditModeToggle={settingsHandlers.handleSettingsEditToggle}
          onGenderChange={(gender) => setField('settingsEditGender', gender)}
          onWeightChange={(weight) => setField('settingsEditWeight', weight)}
          onMetabolismChange={(value) => setField('useSlowMetabolism', value)}
          onSaveSettings={settingsHandlers.handleSettingsSave}
          onCancelEdit={settingsHandlers.handleSettingsCancel}
        />
      </FeatureErrorBoundary>
      <ConfirmModal
        isOpen={state.showConfirmModal}
        message={state.confirmModalMessage}
        onConfirm={() => {
          if (state.confirmModalAction) {
            state.confirmModalAction();
          }
        }}
        onCancel={() => hideConfirm()}
      />
      <Modal
        isOpen={state.showAgeRestrictionModal}
        onClose={() => setField('showAgeRestrictionModal', false)}
        title="Age Restriction"
        maxWidth="max-w-md"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-6">
            You must be of legal drinking age to use this application.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            This app is intended for users who are 21 years or older in the United States, or of
            legal drinking age in their respective country.
          </p>
          <button
            onClick={() => setField('showAgeRestrictionModal', false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            I Understand
          </button>
        </div>
      </Modal>

      <PWAInstallPrompt />
    </PWAProvider>
  );
};
