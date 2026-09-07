import React from 'react';

/**
 * A wall around one panel of the portal.
 *
 * React unmounts the whole tree when a render throws, so a single malformed
 * draft took the entire Marketing tab with it and Otis saw a blank page with
 * nothing to act on and nothing to report. The specific cause is fixed (a
 * script with no price line), but the shape of that failure is what matters:
 * one bad row should cost its own panel, not the page.
 *
 * So this catches, says which panel failed and why, and offers a retry that
 * remounts the subtree without a full reload. It is deliberately plain — it
 * appears when something is already wrong, and its job is to be readable.
 */

interface Props {
  /** Named in the message, so a screenshot says which panel broke. */
  label: string;
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  /** Bumping this remounts the children after a retry. */
  attempt: number;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Kept in the console for a screenshot or a bug report; there is no
    // error-reporting service on this site and inventing one silently would be
    // worse than a console line the owner can copy.
    console.error(`[${this.props.label}] render failed:`, error, info.componentStack);
  }

  render() {
    const { error, attempt } = this.state;
    if (!error) {
      return <React.Fragment key={attempt}>{this.props.children}</React.Fragment>;
    }

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-3">
        <div className="flex items-center gap-2 text-red-800">
          <span className="material-symbols-outlined text-xl" aria-hidden="true">error</span>
          <h3 className="font-display font-bold text-base">
            {this.props.label} could not be displayed
          </h3>
        </div>
        <p className="font-body text-sm text-red-900/80 leading-relaxed">
          Something in this panel failed to render, so it has been contained here instead of
          blanking the page. The rest of the portal still works.
        </p>
        <p className="font-mono text-xs text-red-900/70 break-words">{error.message}</p>
        <button
          type="button"
          onClick={() => this.setState({ error: null, attempt: attempt + 1 })}
          className="px-3.5 py-2 rounded-lg bg-white border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
}
