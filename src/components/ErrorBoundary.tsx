import { Component, type ReactNode } from 'react';
import { Card, CardContent } from './ui/card';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-6">
            <h3 className="font-semibold text-destructive mb-1">
              {this.props.fallbackTitle ?? 'This section encountered an error'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              type="button"
              className="mt-3 text-sm text-primary underline underline-offset-2 hover:text-primary/80"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
