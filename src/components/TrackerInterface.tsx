/**
 * TrackerInterface Component
 * Main tracker interface after onboarding is complete
 */

import React from 'react';
import PWAInstallPrompt from '../PWAInstallPrompt';
import { PWAProvider } from '../contexts/PWAContext';
import { MainLayout } from './MainLayout';
import { ConfirmModal, Modal } from './common';
import {
  BACDisplay,
  TimeInfo,
  AddDrinkPanel,
  DrinkHistoryList,
  SupportSection,
  MessageDisplay,
} from './Tracker';
import { HelpModal, SettingsModal, RefundPolicyModal, ReceiptModal } from './Modals';
import FeatureErrorBoundary from './FeatureErrorBoundary';
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

  // UI state
  showCustomDrink: boolean;
  customDrinkName: string;
  customDrinkOz: string;
  customDrinkABV: string;
  savedCustomDrinks: any[];
  showDrinkHistory: boolean;

  // Modals
  showHelp: boolean;
  showSettings: boolean;
  showRefundPolicy: boolean;
  showReceipt: boolean;
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

  // Receipt
  currentReceipt: any;

  // Support
  customTipAmount: string;

  // Robot messages
  robotMessage: string;
  currentJoke: string;
  showJoke: boolean;
}

interface DrinkHandlers {
  addDrink: (drinkName: string, standardDrinks: number) => void;
  deleteDrink: (drinkId: string) => void;
  undoDrink: () => void;
  clearDrinks: () => void;
  handleAddCustomDrink: () => void;
  handleSaveCustomDrink: () => void;
  handleDeleteCustomDrink: (drinkId: string) => void;
  handleCancelCustomDrink: () => void;
}

interface SettingsHandlers {
  handleSettingsEditToggle: () => void;
  handleSettingsSave: () => void;
  handleSettingsCancel: () => void;
}

interface MiscHandlers {
  handlePaymentSuccess: (amount: number, receiptData: any) => void;
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

export const TrackerInterface: React.FC<TrackerInterfaceProps> = ({
  state,
  setField,
  setMultiple,
  drinkHandlers,
  settingsHandlers,
  miscHandlers,
  hideConfirm,
}) => {
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
        <BACDisplay bac={state.bac} hasBeenImpaired={state.hasBeenImpaired} />
        <TimeInfo
          startTime={state.startTime}
          bac={state.bac}
          useSlowMetabolism={state.useSlowMetabolism}
        />
        <FeatureErrorBoundary
          featureName="Add Drink"
          featureDescription="add drinks to your tracker"
          showSafetyNote={true}
        >
          <AddDrinkPanel
            showCustomDrink={state.showCustomDrink}
            customDrinkName={state.customDrinkName}
            customDrinkOz={state.customDrinkOz}
            customDrinkABV={state.customDrinkABV}
            savedCustomDrinks={state.savedCustomDrinks}
            onToggleCustomDrink={() => setField('showCustomDrink', !state.showCustomDrink)}
            onCustomDrinkChange={(field, value) => {
              if (field === 'name') {
                setField('customDrinkName', value);
              } else if (field === 'oz') {
                setField('customDrinkOz', value);
              } else if (field === 'abv') {
                setField('customDrinkABV', value);
              }
            }}
            onAddCustomDrink={drinkHandlers.handleAddCustomDrink}
            onSaveCustomDrink={drinkHandlers.handleSaveCustomDrink}
            onDeleteCustomDrink={drinkHandlers.handleDeleteCustomDrink}
            onCancelCustomDrink={drinkHandlers.handleCancelCustomDrink}
            onAddDrink={drinkHandlers.addDrink}
          />
        </FeatureErrorBoundary>
        <FeatureErrorBoundary
          featureName="Drink History"
          featureDescription="view and manage your drink history"
          showSafetyNote={true}
        >
          <DrinkHistoryList
            drinks={state.drinks}
            showHistory={state.showDrinkHistory}
            onToggleHistory={() => setField('showDrinkHistory', !state.showDrinkHistory)}
            onDeleteDrink={drinkHandlers.deleteDrink}
            onUndoLast={drinkHandlers.undoDrink}
            onClearAll={drinkHandlers.clearDrinks}
          />
        </FeatureErrorBoundary>
        <FeatureErrorBoundary
          featureName="Support & Payment"
          featureDescription="support the app"
          showSafetyNote={false}
        >
          <SupportSection
            customTipAmount={state.customTipAmount}
            onCustomTipChange={(value) => setField('customTipAmount', value)}
            onPaymentSuccess={miscHandlers.handlePaymentSuccess}
            onTellJoke={miscHandlers.tellJoke}
          />
        </FeatureErrorBoundary>
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
          onShowRefundPolicy={() => setField('showRefundPolicy', true)}
        />
      </FeatureErrorBoundary>
      <RefundPolicyModal
        isOpen={state.showRefundPolicy}
        onClose={() => setField('showRefundPolicy', false)}
      />
      <FeatureErrorBoundary
        featureName="Receipt Display"
        featureDescription="view your receipt"
        showSafetyNote={false}
      >
        <ReceiptModal
          isOpen={state.showReceipt}
          onClose={() => setField('showReceipt', false)}
          receipt={state.currentReceipt}
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
