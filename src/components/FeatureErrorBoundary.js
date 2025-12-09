import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';
import FeatureErrorFallback from './FeatureErrorFallback';

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
}) => {
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

FeatureErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  featureName: PropTypes.string.isRequired,
  featureDescription: PropTypes.string,
  fallbackAction: PropTypes.func,
  showSafetyNote: PropTypes.bool,
};

export default FeatureErrorBoundary;
