/**
 * TrackerInterface Component
 * Redesigned single-tab tracker with mass input and drink level buttons
 */

import React from 'react';
import { Scale } from 'lucide-react';
import PWAInstallPrompt from '../PWAInstallPrompt';
import { PWAProvider } from '../contexts/PWAContext';
import { MainLayout } from './MainLayout';
import { ConfirmModal, Modal } from './common';
import { BACDisplay, TimeInfo, MessageDisplay } from './Tracker';
import { HelpModal, SettingsModal } from './Modals';
import FeatureErrorBoundary from './FeatureErrorBoundary';
import { CONSTANTS } from '../constants';
import type { Gender, Drink } from '../types';

interface TrackerState {
  // User profile
  gender: Gender | null;
  weight: string;

  // BAC and drinks
  bac: number;
  drinks: Drink[];
  startTime: number | null;
  hasBeenImpaired: boolean;
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

interface DrinkHandlers {
  addDrink: (drinkName: string, oz?: number | null, abv?: number | null) => void;
}

interface SettingsHandlers {
  handleSettingsEditToggle: () => void;
  handleSettingsSave: () => void;
  handleSettingsCancel: () => void;
}

interface MiscHandlers {
  tellJoke: () => void;
}

interface TrackerInterfaceProps {
  state: TrackerState;
  setField: (field: string, value: unknown) => void;
  setMultiple: (fields: Record<string, unknown>) => void;
  drinkHandlers: DrinkHandlers;
  settingsHandlers: SettingsHandlers;
  miscHandlers: MiscHandlers;
  hideConfirm: () => void;
}

/** Drink level presets — oz of pure alcohol per tap */
const DRINK_LEVELS = [
  { value: 0.3, label: '0.3', description: 'Light' },
  { value: 0.6, label: '0.6', description: 'Standard' },
  { value: 0.99, label: '0.99', description: 'Strong' },
] as const;

export const TrackerInterface: React.FC<TrackerInterfaceProps> = ({
  state,
  setField,
  setMultiple: _setMultiple,
  drinkHandlers,
  settingsHandlers,
  miscHandlers: _miscHandlers,
  hideConfirm,
}) => {
  const weightNum = parseFloat(state.weight) || 0;
  const weightValid = weightNum >= CONSTANTS.MIN_WEIGHT && weightNum <= CONSTANTS.MAX_WEIGHT;

  /** Add a drink at the given level (oz of pure alcohol) */
  const handleLevel = (level: (typeof DRINK_LEVELS)[number]) => {
    // Convert level to oz & abv that yield the correct standardDrinks
    // standardDrinks = (oz * abv/100) / STANDARD_DRINK_OZ
    // Using abv=100 → oz = level.value * STANDARD_DRINK_OZ
    const oz = level.value * CONSTANTS.STANDARD_DRINK_OZ;
    drinkHandlers.addDrink(level.description, oz, 100);
  };

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

        {/* Drink Level Buttons */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Drink</h3>
          <div className="grid grid-cols-3 gap-3">
            {DRINK_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => handleLevel(level)}
                disabled={!weightValid}
                className="flex flex-col items-center justify-center p-5 rounded-xl font-medium transition
                  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200
                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <span className="text-2xl font-bold text-indigo-700">{level.label}</span>
                <span className="text-xs text-indigo-500 mt-1">{level.description}</span>
              </button>
            ))}
          </div>
        </div>

        <BACDisplay bac={state.bac} hasBeenImpaired={state.hasBeenImpaired} />
        <TimeInfo
          startTime={state.startTime}
          bac={state.bac}
          useSlowMetabolism={state.useSlowMetabolism}
        />
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
