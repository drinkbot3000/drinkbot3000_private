import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import FeatureErrorFallback from './FeatureErrorFallback';

export interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName: string;
  featureDescription?: string;
  fallbackAction?: () => void;
  showSafetyNote?: boolean;
}

/**
 * Feature-Specific Error Boundary Component
 * Wraps ErrorBoundary with feature-specific context and fallback UI
 *
 * Usage:
 * <FeatureErrorBoundary
 *   featureName="BAC Tracker"
 *   featureDescription="track your drinks and BAC level"
 *   fallbackAction={() => window.location.href = '/'}
 * >
 *   <YourFeatureComponent />
 * </FeatureErrorBoundary>
 */
const FeatureErrorBoundary = ({
  children,
  featureName,
  featureDescription,
  fallbackAction,
  showSafetyNote = true,
}: FeatureErrorBoundaryProps): JSX.Element => {
  const fallback = (
    <FeatureErrorFallback
      featureName={featureName}
      featureDescription={featureDescription}
      fallbackAction={fallbackAction}
      showSafetyNote={showSafetyNote}
    />
  );

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
};

export default FeatureErrorBoundary;
