/* eslint-disable @typescript-eslint/no-empty-interface */

import React from 'react';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

interface RecoilTestWrapperProps {}

/**
 * Component that wraps up all components that are needed to test anything regarding recoil state
 */
function RecoilTestWrapper(
  props: React.PropsWithChildren<RecoilTestWrapperProps>,
): JSX.Element {
  return (
    <RecoilRoot>
      <RecoilNexus />
      {props.children}
    </RecoilRoot>
  );
}

export default RecoilTestWrapper;
