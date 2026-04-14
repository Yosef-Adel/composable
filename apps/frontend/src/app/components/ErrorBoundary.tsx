import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5">Something went wrong</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Typography>
          <Button variant="outlined" onClick={this.handleReset} sx={{ mt: 1 }}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
