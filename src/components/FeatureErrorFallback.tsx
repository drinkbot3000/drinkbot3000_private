import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from './common/Button';

export interface ErrorInfo {
  componentStack?: string;
}

export interface FeatureErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  resetError?: () => void;
  featureName: string;
  featureDescription?: string;
  fallbackAction?: () => void;
  showSafetyNote?: boolean;
}

/**
 * Feature-Specific Error Fallback Component
 * Displays feature-specific error messages and recovery options
 */
const FeatureErrorFallback = ({
  error,
  errorInfo,
  resetError,
  featureName,
  featureDescription,
  fallbackAction,
  showSafetyNote = true,
}: FeatureErrorFallbackProps): JSX.Element => {
  const isProduction = process.env.NODE_ENV === 'production';

  const handleReload = (): void => {
    window.location.reload();
  };

  const handleGoHome = (): void => {
    window.location.href = '/';
  };

  const handleFallbackAction = (): void => {
    if (fallbackAction) {
      fallbackAction();
    } else {
      handleGoHome();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          {featureName} Encountered an Error
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 text-center mb-6">
          {featureDescription ? (
            <>
              We encountered an unexpected error while trying to {featureDescription}. The rest of
              the app should still work normally.
            </>
          ) : (
            <>
              We encountered an unexpected error in this feature. The rest of the app should still
              work normally.
            </>
          )}
        </p>

        {/* Feature-Specific Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">What you can do:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Try the operation again using the "Try Again" button below</li>
            <li>Reload the entire page to reset the app</li>
            <li>Return to the home screen to access other features</li>
            {featureName === 'BAC Tracker' && (
              <li>Your drink history is saved and will be available after recovery</li>
            )}
          </ul>
        </div>

        {/* Error Details (Development Only) */}
        {!isProduction && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-red-900 mb-2">
              Error Details (Development Mode):
            </h3>
            <p className="text-sm text-red-800 font-mono mb-2 break-words">{error.toString()}</p>
            {errorInfo?.componentStack && (
              <details className="mt-2">
                <summary className="text-sm text-red-700 cursor-pointer hover:text-red-900">
                  Component Stack
                </summary>
                <pre className="text-xs text-red-700 mt-2 overflow-x-auto whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resetError && (
            <Button
              onClick={resetError}
              variant="primary"
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}

          <Button
            onClick={handleReload}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </Button>

          <Button
            onClick={handleFallbackAction}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            {fallbackAction ? <ArrowLeft className="w-4 h-4" /> : <Home className="w-4 h-4" />}
            {fallbackAction ? 'Go Back' : 'Go Home'}
          </Button>
        </div>

        {/* Safety Note */}
        {showSafetyNote && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              <strong>Safety Note:</strong> If you were tracking your BAC, please wait at least 15
              minutes after your last drink before making any decisions about driving.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureErrorFallback;
