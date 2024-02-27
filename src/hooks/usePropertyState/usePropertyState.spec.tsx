/* eslint-disable react-hooks/rules-of-hooks */

import { act, renderHook } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import usePropertyState from './usePropertyState';
import propertyState from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import ApartmentBuilder from '_/test/builders/apartment.builder';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';

describe('usePropertyState', () => {
  const property = new PropertyBuilder()
    .addApartment(new ApartmentBuilder().withId('id1').build())
    .addApartment(new ApartmentBuilder().withId('id2').build())
    .addApartment(new ApartmentBuilder().withId('id3').build())
    .addApartment(new ApartmentBuilder().withId('id4').build())
    .addParkingSpace(new ParkingSpaceBuilder().withId('id5').build())
    .addParkingSpace(new ParkingSpaceBuilder().withId('id6').build())
    .addParkingSpace(new ParkingSpaceBuilder().withId('id7').build())
    .addParkingSpace(new ParkingSpaceBuilder().withId('id8').build())
    .build();

  describe('property', () => {
    test('should return right property', () => {
      // Arrange
      const { result } = renderHook(
        () =>
          useInitializedRecoilState({
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

  describe('emptyApartments', () => {
    test('should return right apartments', () => {
      // Arrange
      const rentedApartments = [property.apartments[1], property.apartments[3]];
      const residents = rentedApartments.map((apartment) =>
        new ResidentBuilder().withApartment(apartment.id).build(),
      );
      const expectedEmptyApartments = [
        property.apartments[0],
        property.apartments[2],
      ];

      const { result } = renderHook(
        () =>
          useInitializedRecoilState({
            state: propertyState,
            stateValue: property,
            hook: () =>
              useInitializedRecoilState({
                state: residentState,
                stateValue: residents,
                hook: usePropertyState,
              }),
          }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Assert
      expect(result.current.emptyApartments).toEqual(expectedEmptyApartments);
    });
  });

  describe('emptyParkingSpaces', () => {
    test('should return right apartments', () => {
      // Arrange
      const rentedParkingSpaces = [
        property.parkingSpaces[0],
        property.parkingSpaces[2],
      ];
      const residents = rentedParkingSpaces.map((parkingSpace) =>
        new ResidentBuilder().withParkingSpace(parkingSpace.id).build(),
      );
      const expectedEmptyParkingSpaces = [
        property.parkingSpaces[1],
        property.parkingSpaces[3],
      ];

      const { result } = renderHook(
        () =>
          useInitializedRecoilState({
            state: propertyState,
            stateValue: property,
            hook: () =>
              useInitializedRecoilState({
                state: residentState,
                stateValue: residents,
                hook: usePropertyState,
              }),
          }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Assert
      expect(result.current.emptyParkingSpaces).toEqual(expectedEmptyParkingSpaces);
    });
  });

  describe('addApartment', () => {
    test('should set state correctly', () => {
      // Arrange
      const { result } = renderHook(
        () =>
          useInitializedRecoilState({
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

  describe('addParkingSpace', () => {
    test('should set state correctly', () => {
      // Arrange
      const { result } = renderHook(
        () =>
          useInitializedRecoilState({
            state: propertyState,
            stateValue: property,
            hook: usePropertyState,
          }),
        {
          wrapper: RecoilRoot,
        },
      );
      const parkingSpace = new ParkingSpaceBuilder().build();

      // Act
      act(() => {
        result.current.addParkingSpace(parkingSpace);
      });

      // Assert
      expect(result.current.property.parkingSpaces).toEqual([
        ...property.parkingSpaces,
        parkingSpace,
      ]);
    });
  });
});
