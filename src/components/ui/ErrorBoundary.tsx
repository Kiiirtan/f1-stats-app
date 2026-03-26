import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-c-60 flex items-center justify-center p-8">
          <div className="bg-c-30 p-12 max-w-lg text-center border border-c-10/20">
            <span className="material-symbols-outlined text-6xl text-c-10 mb-4 block">warning</span>
            <h2 className="font-headline text-2xl font-bold text-t-bright uppercase mb-4">
              Something went wrong
            </h2>
            <p className="text-sm text-t-main mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-c-10 text-c-60 px-8 py-3 text-xs font-bold tracking-widest hover:brightness-110 transition-all"
            >
              RELOAD PAGE
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
