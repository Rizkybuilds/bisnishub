import React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ts-hitam text-ts-krem flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full glass-panel border border-ts-border p-8 rounded-sm text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-ts-terracotta" />
            
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-ts-terracotta/10 border border-ts-terracotta/20 flex items-center justify-center text-ts-terracotta">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <span className="font-mono text-xs uppercase tracking-widest text-ts-terracotta font-semibold">
              System Notice
            </span>

            <h1 className="text-xl md:text-2xl font-bold mt-2 text-ts-krem tracking-tight">
              Terjadi Kendala Teknis
            </h1>

            <p className="mt-3 text-sm text-ts-kremMuted leading-relaxed">
              Halaman mengalami galat yang tidak terduga. Silakan muat ulang halaman atau kembali ke beranda TeeStock.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mt-4 p-3 bg-red-950/30 border border-red-500/20 rounded text-left overflow-auto max-h-32 text-xs font-mono text-red-300">
                {this.state.error.toString()}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-ts-terracotta hover:bg-ts-terracotta/90 text-white font-medium text-sm rounded-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-ts-surface hover:bg-ts-surfaceHover border border-ts-border text-ts-krem font-medium text-sm rounded-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                Ke Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
