import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Apartment from '_/models/property/apartment';
import propertyState from '_/states/property/property.state';

/**
 * Hook that returns the property state and utility functions to modify it
 */
function usePropertyState() {
  const [property, setProperty] = useRecoilState(propertyState);

  const addApartment = useCallback(
    (apartment: Apartment) => {
      setProperty((state) => ({
        ...state,
        apartments: [...state.apartments, apartment],
      }));
    },
    [setProperty],
  );

  return {
    /**
     * Property object
     */
    property,

    /**
     * Adds a new apartment to the property
     */
    addApartment,
  };
}

export default usePropertyState;
