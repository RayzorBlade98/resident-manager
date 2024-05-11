/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from 'react';
import { RecoilState, useSetRecoilState } from 'recoil';

function useInitializedRecoilState<S, H>(args: {
  state: RecoilState<S>;
  stateValue: S;
  hook: () => H;
}): H {
  const [isInitialized, setIsInitialized] = useState(false);
  const stateSetter = useSetRecoilState(args.state);

  if (!isInitialized) {
    stateSetter(args.stateValue);
    setIsInitialized(true);
  }

  const hook = args.hook();

  return hook;
}

export default useInitializedRecoilState;
