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
        <div className="min-h-screen bg-[#13131b] flex items-center justify-center p-8">
          <div className="bg-[#1b1b24] p-12 max-w-lg text-center border border-white/10 rounded-2xl">
            <span className="material-symbols-outlined text-6xl text-[#E10600] mb-4 block">warning</span>
            <h2 className="font-headline text-2xl font-bold text-white uppercase mb-4">
              Something went wrong
            </h2>
            <p className="text-sm text-white/60 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#E10600] text-white px-8 py-3 text-xs font-bold tracking-widest rounded-xl hover:brightness-110 transition-all"
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
