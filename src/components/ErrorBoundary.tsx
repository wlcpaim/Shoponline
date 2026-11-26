import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Ops! Algo deu errado.</h2>
            <p className="text-zinc-600 mb-6 text-sm">
              {this.state.error?.message || 'Ocorreu um erro inesperado na aplicação.'}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-800 transition"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}