import { Component, type ErrorInfo, type ReactNode } from 'react';
import NetworkFallback from './NetworkFallback';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught component error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                    <NetworkFallback
                        title="Something went wrong"
                        message={this.state.error?.message || 'An unexpected rendering or network error occurred.'}
                        onRetry={this.handleReset}
                    />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
