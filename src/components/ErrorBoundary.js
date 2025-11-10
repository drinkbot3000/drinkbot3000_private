import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 *
 * Features:
 * - Logs errors to console (can be extended to log to error tracking service)
 * - Provides user-friendly error message
 * - Allows user to try to recover by reloading
 * - Prevents the entire app from crashing
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
    // Log the error to console (in production, send to error tracking service)
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // In production, you would send this to an error tracking service like Sentry
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  background: '#FEF2F2',
                  borderRadius: '50%',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={48} color="#DC2626" />
              </div>
              <h1
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#1F2937',
                  marginBottom: '0.5rem',
                }}
              >
                Something went wrong
              </h1>
              <p style={{ color: '#6B7280', fontSize: '1rem' }}>
                We encountered an unexpected error. Don't worry, your data should be safe.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                }}
              >
                <p style={{ fontWeight: '600', color: '#DC2626', marginBottom: '0.5rem' }}>
                  Error Details (Development Only):
                </p>
                <pre
                  style={{
                    overflow: 'auto',
                    fontSize: '0.75rem',
                    color: '#991B1B',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              <button
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <RefreshCw size={20} />
                Reload Application
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  width: '100%',
                  background: '#F3F4F6',
                  color: '#374151',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#E5E7EB';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#F3F4F6';
                }}
              >
                Try to Continue
              </button>
            </div>

            <p
              style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#9CA3AF',
              }}
            >
              If this problem persists, please try clearing your browser cache or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
