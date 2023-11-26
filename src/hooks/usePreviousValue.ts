import { useEffect, useRef } from 'react';

/**
 * Hook that memorizes the previous state of the provided value
 * @param value value that should be memorized
 * @returns previous state of the value
 */
function usePreviousValue<T>(value: T): T {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePreviousValue;
