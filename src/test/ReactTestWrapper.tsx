/* eslint-disable @typescript-eslint/no-empty-interface, react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import View from '../routes';
import PropertyBuilder from './builders/property.builder';
import StandardLocalizationProvider from '_/components/functional/StandardLocalizationProvider/StandardLocalizationProvider';
import { propertyState } from '_/states/property/property.state';

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
   * Callback whenever the route changes
   */
  onRouteChange?: (route: View) => void;
}

/**
 * Component that wraps up all components that are needed to test anything regarding recoil state
 */
function ReactTestWrapper(
  props: React.PropsWithChildren<ReactTestWrapperProps>,
): JSX.Element {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <PropertyInitializer />
      <StandardLocalizationProvider>
        <MemoryRouter initialEntries={props.route ? [props.route] : undefined}>
          <CurrentRouteProvider onRouteChange={props.onRouteChange} />
          {props.children}
        </MemoryRouter>
      </StandardLocalizationProvider>
    </RecoilRoot>
  );
}

export default ReactTestWrapper;
