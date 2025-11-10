/**
 * BACTrackerModern Component
 * Main component orchestrating the BAC tracking application
 * Modern implementation with hooks, components, and best practices
 */

import React, { useState, useCallback } from 'react';

// Components
import SplashScreen from './SplashScreen';
import SetupForm from './SetupForm';
import TrackerView from './TrackerView';
import CalculatorView from './CalculatorView';
import SettingsView from './SettingsView';
import NavBar from './NavBar';
import RobotMessage from './RobotMessage';

// Hooks
import { useBACTracker } from '../../hooks/useBACTracker';
import { useRobotMessages } from '../../hooks/useRobotMessages';
import { useJokes } from '../../hooks/useJokes';

// Data
import { getRandomGreeting, getRandomComment } from '../../data/robotMessages';

// Constants
import { TAB_NAMES } from '../../constants';

/**
 * Main BAC Tracker Application Component
 */
const BACTrackerModern = () => {
  // UI State
  const [showSplash, setShowSplash] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_NAMES.TRACKER);

  // User Profile State
  const [mode, setMode] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');

  // Custom Hooks
  const bacTracker = useBACTracker(mode, gender, weight);
  const { robotMessage, showMessage } = useRobotMessages();
  const jokeState = useJokes();

  /**
   * Handle setup completion
   */
  const handleSetupComplete = useCallback((setupData) => {
    setMode(setupData.mode);
    setGender(setupData.gender);
    setWeight(setupData.weight);

    if (setupData.estimateDrinks) {
      bacTracker.setEstimateDrinks(setupData.estimateDrinks);
    }
    if (setupData.estimateHours) {
      bacTracker.setEstimateHours(setupData.estimateHours);
    }

    setSetupComplete(true);

    // Show welcome message
    const greeting = getRandomGreeting();
    showMessage(greeting);
  }, [bacTracker, showMessage]);

  /**
   * Handle adding a drink
   */
  const handleAddDrink = useCallback(() => {
    bacTracker.addDrink();
    const comment = getRandomComment();
    showMessage(comment);
  }, [bacTracker, showMessage]);

  /**
   * Handle undo drink
   */
  const handleUndoDrink = useCallback(() => {
    if (bacTracker.drinks.length > 0) {
      bacTracker.undoDrink();
      showMessage('*beep boop* Last drink removed from records! 🤖');
    }
  }, [bacTracker, showMessage]);

  /**
   * Handle adding custom drink
   */
  const handleAddCustomDrink = useCallback((volumeOz, abv) => {
    const standardDrinks = bacTracker.addCustomDrink(volumeOz, abv);
    showMessage(`*calculates precisely* That's ${standardDrinks.toFixed(1)} standard drinks! 🤖`);
    return standardDrinks;
  }, [bacTracker, showMessage]);

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  /**
   * Handle gender change
   */
  const handleGenderChange = useCallback((newGender) => {
    setGender(newGender);
  }, []);

  /**
   * Handle weight change
   */
  const handleWeightChange = useCallback((newWeight) => {
    setWeight(newWeight);
  }, []);

  /**
   * Handle closing settings
   */
  const handleCloseSettings = useCallback(() => {
    setActiveTab(TAB_NAMES.TRACKER);
  }, []);

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onContinue={() => setShowSplash(false)} />;
  }

  // Show setup form
  if (!setupComplete) {
    return <SetupForm onComplete={handleSetupComplete} />;
  }

  // Show settings view
  if (activeTab === TAB_NAMES.SETTINGS) {
    return (
      <>
        <RobotMessage message={robotMessage} show={!!robotMessage} />
        <SettingsView
          gender={gender}
          weight={weight}
          mode={mode}
          onGenderChange={handleGenderChange}
          onWeightChange={handleWeightChange}
          onAddCustomDrink={handleAddCustomDrink}
          onClose={handleCloseSettings}
        />
        <NavBar activeTab={activeTab} onTabChange={handleTabChange} />
      </>
    );
  }

  // Show calculator view
  if (activeTab === TAB_NAMES.CALCULATOR) {
    return (
      <>
        <RobotMessage message={robotMessage} show={!!robotMessage} />
        <CalculatorView
          gender={gender}
          weight={weight}
          onTellJoke={jokeState.tellJoke}
          jokeState={jokeState}
        />
        <NavBar activeTab={activeTab} onTabChange={handleTabChange} />
      </>
    );
  }

  // Show tracker view (default)
  return (
    <>
      <RobotMessage message={robotMessage} show={!!robotMessage} />
      <TrackerView
        bac={bacTracker.bac}
        drinks={bacTracker.drinks}
        mode={mode}
        gender={gender}
        weight={weight}
        estimateDrinks={bacTracker.estimateDrinks}
        onAddDrink={handleAddDrink}
        onUndoDrink={handleUndoDrink}
        onTellJoke={jokeState.tellJoke}
        jokeState={jokeState}
      />
      <NavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
};

export default BACTrackerModern;
