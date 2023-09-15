/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react';
import { RecoilState, useSetRecoilState } from 'recoil';

function useInitializedRecoilState<S, H>(args: {
  state: RecoilState<S>;
  stateValue: S;
  hook: () => H;
}): H {
  const stateSetter = useSetRecoilState(args.state);
  const hook = args.hook();

  useEffect(() => {
    stateSetter(args.stateValue);
  }, []);

  return hook;
}

export default useInitializedRecoilState;
