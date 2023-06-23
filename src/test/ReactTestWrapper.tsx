/* eslint-disable @typescript-eslint/no-empty-interface, react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import RecoilNexus from 'recoil-nexus';
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

interface ReactTestWrapperProps {}

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
        {props.children}
      </StandardLocalizationProvider>
    </RecoilRoot>
  );
}

export default ReactTestWrapper;
