/**
 * AppModern.js
 * Modern implementation of the BAC Tracker application
 * This file demonstrates the new modular, component-based architecture
 */

import React from 'react';
import { BACTrackerModern } from './components/BACTracker';
import PWAInstallPrompt from './PWAInstallPrompt';

/**
 * Main App Component using the modern BAC Tracker implementation
 *
 * Features:
 * - Modular component architecture
 * - Custom hooks for state management
 * - Separated business logic and presentation
 * - Improved accessibility
 * - Performance optimizations with React.memo and useCallback
 * - Clean separation of concerns
 */
function AppModern() {
  return (
    <>
      <BACTrackerModern />
      <PWAInstallPrompt />
    </>
  );
}

export default AppModern;
