import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './common/Button';

/**
 * ErrorFallback Component
 * User-friendly error display with recovery options
 *
 * Props:
 * - error: The error object
 * - errorInfo: React error info with component stack
 * - resetError: Function to attempt error recovery
 */
const ErrorFallback = ({ error, errorInfo, resetError }) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
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
          Oops! Something went wrong
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 text-center mb-6">
          We encountered an unexpected error. Don't worry, your data is safe.
          You can try refreshing the page or returning to the home screen.
        </p>

        {/* Error Details (Development Only) */}
        {!isProduction && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-red-900 mb-2">
              Error Details (Development Mode):
            </h3>
            <p className="text-sm text-red-800 font-mono mb-2 break-words">
              {error.toString()}
            </p>
            {errorInfo && errorInfo.componentStack && (
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
            onClick={handleGoHome}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        {/* Safety Note */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            <strong>Safety Note:</strong> If you were tracking your BAC, please
            wait at least 15 minutes after your last drink before making any
            decisions about driving.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
