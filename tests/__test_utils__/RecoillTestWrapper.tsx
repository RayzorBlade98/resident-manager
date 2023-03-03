import React from 'react';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

/**
 * Component that wraps up all components that are needed to test anything regarding recoil state
 */
function RecoilTestWrapper(
  props: React.PropsWithChildren<Record<string, never>>,
): JSX.Element {
  return (
    <RecoilRoot>
      <RecoilNexus />
      {props.children}
    </RecoilRoot>
  );
}

export default RecoilTestWrapper;
