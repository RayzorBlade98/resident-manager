import { act, renderHook } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import usePropertyState from './usePropertyState';
import propertyState from '_/states/property/property.state';
import ApartmentBuilder from '_/test/builders/apartment.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';

describe('usePropertyState', () => {
  const property = new PropertyBuilder()
    .addApartment(new ApartmentBuilder().build())
    .build();

  describe('property', () => {
    test('should return right property', () => {
      // Arrange
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: propertyState,
          stateValue: property,
          hook: usePropertyState,
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Assert
      expect(result.current.property).toEqual(property);
    });
  });

  describe('addApartment', () => {
    test('should set state correctly', () => {
      // Arrange
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: propertyState,
          stateValue: property,
          hook: usePropertyState,
        }),
        {
          wrapper: RecoilRoot,
        },
      );
      const apartment = new ApartmentBuilder().build();

      // Act
      act(() => {
        result.current.addApartment(apartment);
      });

      // Assert
      expect(result.current.property.apartments).toEqual([
        ...property.apartments,
        apartment,
      ]);
    });
  });
});
