import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CarePulse Uncaught Application Error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleClearStorageAndReload = () => {
    localStorage.removeItem("CAREPULSE_DASHBOARD_STATE");
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8f5] text-[#2f3630] font-sans flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#e5dfd5] shadow-xl text-center space-y-5">
            <div className="h-16 w-16 bg-[#c46951]/10 rounded-2xl flex items-center justify-center mx-auto text-[#c46951]">
              <AlertOctagon className="h-8 w-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif font-bold text-2xl text-[#3d463e]">CarePulse Safe Mode</h1>
              <p className="text-xs text-[#707e72] leading-relaxed">
                An unexpected interface issue occurred. Your clinical health records are preserved safely in your cloud and local cache.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[#f5f1eb] rounded-xl text-[11px] font-mono text-left text-[#5a6b5d] overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-[#708271] hover:bg-[#5a6b5d] text-white text-xs font-bold rounded-full flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#708271]/20 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reload Dashboard</span>
              </button>

              <button
                onClick={this.handleClearStorageAndReload}
                className="w-full py-2.5 bg-transparent hover:bg-[#f5f1eb] text-[#707e72] hover:text-[#3d463e] text-[11px] font-bold rounded-full transition-all cursor-pointer"
              >
                Reset Local Cache & Re-sync Cloud
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
