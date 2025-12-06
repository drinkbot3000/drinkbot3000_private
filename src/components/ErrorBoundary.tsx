import React from 'react';
import ErrorFallback, { type ErrorInfo } from './ErrorFallback';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactElement;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React render errors and displays a fallback UI
 *
 * Usage:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    console.error('🚨 Error Boundary caught an error:', error);
    console.error('📋 Error Info:', errorInfo);

    // Store error details in state
    this.setState({
      error,
      errorInfo: { componentStack: errorInfo.componentStack },
    });

    // Optional: Send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry)
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): React.ReactNode {
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
          error={this.state.error ?? undefined}
          errorInfo={this.state.errorInfo ?? undefined}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
