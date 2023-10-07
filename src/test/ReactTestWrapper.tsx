/* eslint-disable @typescript-eslint/no-empty-interface, react-hooks/exhaustive-deps */

import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import View from '../routes';
import PropertyBuilder from './builders/property.builder';
import StandardLocalizationProvider from '_/components/functional/StandardLocalizationProvider/StandardLocalizationProvider';
import propertyState from '_/states/property/property.state';
import theme from '_/styles/mui.theme';

/**
 * Initialize property to enable standard app flow
 */
function PropertyInitializer(): null {
  const setProperty = useSetRecoilState(propertyState);
  useEffect(() => {
    setProperty(new PropertyBuilder().build());
  }, []);
  return null;
}

/**
 * Provides functionality to track the current route during a test
 */
function CurrentRouteProvider({
  onRouteChange,
}: {
  onRouteChange?: (route: View) => void;
}): null {
  const location = useLocation();

  useEffect(() => {
    if (onRouteChange) {
      onRouteChange(location.pathname as View);
    }
  }, [location]);

  return null;
}

interface ReactTestWrapperProps {
  /**
   * Route that should be initialized
   */
  route?: View;

  /**
   * Routing history that should be initialized
   */
  routingHistory?: View[];

  /**
   * Callback whenever the route changes
   */
  onRouteChange?: (route: View) => void;

  /**
   * Function that is called before the children are rendered
   */
  initializationFunction?: () => void;
}

/**
 * Component that wraps up all components that are needed to test anything regarding recoil state
 */
function ReactTestWrapper(
  props: React.PropsWithChildren<ReactTestWrapperProps>,
): JSX.Element {
  const [isInitialized, setInitialized] = useState(false);

  const routingHistory = [
    ...(props.routingHistory ?? []),
    ...(props.route ? [props.route] : []),
  ];

  useEffect(() => {
    if (props.initializationFunction) {
      act(() => {
        props.initializationFunction!();
      });
    }
    setInitialized(true);
  }, []);

  return (
    <RecoilRoot>
      <RecoilNexus />
      <PropertyInitializer />
      <StandardLocalizationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter
            initialEntries={
              routingHistory.length > 0 ? routingHistory : undefined
            }
          >
            <CurrentRouteProvider onRouteChange={props.onRouteChange} />
            {isInitialized && props.children}
          </MemoryRouter>
        </ThemeProvider>
      </StandardLocalizationProvider>
    </RecoilRoot>
  );
}

export default ReactTestWrapper;
