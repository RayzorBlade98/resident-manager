import { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Apartment from '_/models/property/apartment';
import ParkingSpace from '_/models/property/parkingSpace';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';

/**
 * Hook that returns the property state and utility functions to modify it
 */
function usePropertyState() {
  const [property, setProperty] = useRecoilState(propertyState);
  const residents = useRecoilValue(residentState);

  const emptyApartments = useMemo(
    () => property.apartments.filter(
      (apartment) => !residents.find((resident) => resident.apartmentId === apartment.id),
    ),
    [property, residents],
  );

  const addApartment = useCallback(
    (apartment: Apartment) => {
      setProperty((state) => ({
        ...state,
        apartments: [...state.apartments, apartment],
      }));
    },
    [setProperty],
  );

  const addParkingSpace = useCallback(
    (parkingSpace: ParkingSpace) => {
      setProperty((state) => ({
        ...state,
        parkingSpaces: [...state.parkingSpaces, parkingSpace],
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
     * List of apartments that aren't connected to a resident
     */
    emptyApartments,

    /**
     * Adds a new apartment to the property
     */
    addApartment,

    /**
     * Adds a new parking space to the property
     */
    addParkingSpace,
  };
}

export default usePropertyState;
