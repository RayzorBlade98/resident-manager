/* eslint-disable @typescript-eslint/no-empty-interface */

import React from 'react';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import StandardLocalizationProvider from '_/components/functional/StandardLocalizationProvider/StandardLocalizationProvider';

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
      <StandardLocalizationProvider>
        {props.children}
      </StandardLocalizationProvider>
    </RecoilRoot>
  );
}

export default ReactTestWrapper;
