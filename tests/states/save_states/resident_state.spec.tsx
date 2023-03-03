/* eslint-disable max-len */

import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import residentState, {
  ResidentStateManager,
} from '_/states/saveStates/resident_state';
import { DateString, Month } from '_/types/date';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import RentInformationBuilder from '_tests/__test_utils__/builders/rent_information_builder';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';

describe('ResidentStateManager', () => {
  describe('addResident', () => {
    test('should add new resident to state', () => {
      // Arrange
      render(<RecoilTestWrapper />);
      const newResident1 = new ResidentBuilder().build();
      const newResident2 = new ResidentBuilder().build();
      const expectedState = [
        ...getRecoil(residentState),
        newResident1,
        newResident2,
      ];

      // Act
      act(() => {
        ResidentStateManager.addResident(newResident1);
        ResidentStateManager.addResident(newResident2);
      });

      // Assert
      const newState = getRecoil(residentState);
      expect(newState).toEqual(expectedState);
    });
  });

  describe('updateResident', () => {
    test('should update resident in state correctly', () => {
      // Arrange
      render(<RecoilTestWrapper />);
      const resident = new ResidentBuilder()
        .withFirstName('Old First')
        .withLastName('Old Last')
        .build();
      act(() => {
        ResidentStateManager.addResident(new ResidentBuilder().build());
        ResidentStateManager.addResident(resident);
        ResidentStateManager.addResident(new ResidentBuilder().build());
      });
      const update = {
        firstName: 'Updated First',
        lastName: 'Updated Last',
      };
      const expectedState = [...getRecoil(residentState)];
      expectedState[1] = {
        ...resident,
        ...update,
      };

      // Act
      act(() => {
        ResidentStateManager.updateResident(resident.id, update);
      });

      // Assert
      const newState = getRecoil(residentState);
      expect(newState).toEqual(expectedState);
    });
  });

  describe('updateRentInformation', () => {
    test('should update resident in state correctly', () => {
      // Arrange
      render(<RecoilTestWrapper />);
      const rentInformation = new RentInformationBuilder()
        .withRent(500)
        .withIncidentals(100)
        .withMonth(Month.Febuary)
        .build();
      const resident = new ResidentBuilder()
        .withFirstName('Old First')
        .withLastName('Old Last')
        .addRentInformation(
          new RentInformationBuilder().withMonth(Month.January).build(),
        )
        .addRentInformation(rentInformation)
        .addRentInformation(
          new RentInformationBuilder().withMonth(Month.March).build(),
        )
        .build();
      act(() => {
        ResidentStateManager.addResident(new ResidentBuilder().build());
        ResidentStateManager.addResident(resident);
        ResidentStateManager.addResident(new ResidentBuilder().build());
      });
      const update = {
        rent: 600,
        incidentals: 200,
        paymentDate: '03.03.2023' as DateString,
        paymentAmount: 1000,
      };
      const expectedState = [...getRecoil(residentState)];
      expectedState[1] = {
        ...expectedState[1],
        rent: [...resident.rent],
      };
      expectedState[1].rent[1] = {
        ...rentInformation,
        ...update,
      };

      // Act
      act(() => {
        ResidentStateManager.updateRentInformation(
          resident.id,
          rentInformation.dueDate,
          update,
        );
      });

      // Assert
      const newState = getRecoil(residentState);
      expect(newState).toEqual(expectedState);
    });
  });
});
