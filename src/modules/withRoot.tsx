import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';

export default function withRoot<P extends React.JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
) {
  function WithRoot(props: P) {
    return (
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }

  return WithRoot;
}