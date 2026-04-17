"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/modules/logs/services/logger";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.captureClientError(error, errorInfo);
  }

  private resetErrorBoundary = () => {
    this.setState({ error: null });
  };

  public render() {
    if (this.state.error) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary
        });
      }
      return this.props.fallback || (
        <div className="p-4 rounded-xl bg-red-50/50 text-red-900 border border-red-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm opacity-80">{this.state.error.message}</p>
          <button 
            onClick={this.resetErrorBoundary}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm transition-colors text-red-900 font-medium"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
