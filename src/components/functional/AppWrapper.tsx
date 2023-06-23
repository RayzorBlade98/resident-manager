import React from 'react';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import SaveStateManager from './SaveStateHandler/SaveStateHandler';
import StandardLocalizationProvider from './StandardLocalizationProvider/StandardLocalizationProvider';

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
          {props.children}
        </StandardLocalizationProvider>
      </SaveStateManager>
    </RecoilRoot>
  );
}

export default AppWrapper;
