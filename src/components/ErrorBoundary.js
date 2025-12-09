import React from 'react';
import PropTypes from 'prop-types';
import ErrorFallback from './ErrorFallback';

/**
 * Error Boundary Component
 * Catches React render errors and displays a fallback UI
 *
 * Usage:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('🚨 Error Boundary caught an error:', error);
    console.error('📋 Error Info:', errorInfo);

    // Store error details in state
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default ErrorFallback
      if (this.props.fallback) {
        return React.cloneElement(this.props.fallback, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.resetError,
        });
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.element,
};

export default ErrorBoundary;
