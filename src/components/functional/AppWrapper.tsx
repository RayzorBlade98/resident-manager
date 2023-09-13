import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import SaveStateManager from './SaveStateHandler/SaveStateHandler';
import StandardLocalizationProvider from './StandardLocalizationProvider/StandardLocalizationProvider';
import theme from '_/styles/mui.theme';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppWrapperProps {}

/**
 * Component that includes all functional components in which the app needs to be wrapped
 */
function AppWrapper(
  props: React.PropsWithChildren<AppWrapperProps>,
): JSX.Element {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <SaveStateManager>
        <StandardLocalizationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>{props.children}</HashRouter>
          </ThemeProvider>
        </StandardLocalizationProvider>
      </SaveStateManager>
    </RecoilRoot>
  );
}

export default AppWrapper;
