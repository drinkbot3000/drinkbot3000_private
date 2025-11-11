import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    // Clear local storage and reload
    if (window.confirm('This will reset the app and clear all saved data. Continue?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
                <AlertTriangle className="w-16 h-16 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                DrinkBot3000 encountered an unexpected error.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-6 border-2 border-red-200">
              <p className="text-sm text-gray-700 mb-2">
                Don't worry - your data is safe. Try one of these options:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Reload the page (your data will be preserved)</li>
                <li>Reset the app if the problem persists</li>
                <li>Contact support if the issue continues</li>
              </ul>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-xs overflow-auto max-h-48">
                <p className="font-bold text-red-600 mb-2">Error Details (dev only):</p>
                <p className="text-gray-800 mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-gray-600 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </button>

              <button
                onClick={this.handleReset}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Reset App
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Need help? Contact: support@drinkbot3000.com
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
