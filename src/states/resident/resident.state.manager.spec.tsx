/* eslint-disable max-len */

import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil } from 'recoil-nexus';
import ResidentStateManager from './resident.state.manager';
import MonthYear from '_/extensions/date/month_year.extension';
import residentState from '_/states/resident/resident.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('ResidentStateManager', () => {
  beforeEach(() => {
    render(<ReactTestWrapper />);
  });

  describe('addResident', () => {
    test('should add new resident to state', () => {
      // Arrange
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
      const rentInformation = new RentInformationBuilder()
        .withRent(500)
        .withIncidentals(100)
        .withDueDate(new MonthYear(1, 2023))
        .build();
      const resident = new ResidentBuilder()
        .withFirstName('Old First')
        .withLastName('Old Last')
        .addRentInformation(
          new RentInformationBuilder()
            .withDueDate(new MonthYear(0, 2023))
            .build(),
        )
        .addRentInformation(rentInformation)
        .addRentInformation(
          new RentInformationBuilder()
            .withDueDate(new MonthYear(2, 2023))
            .build(),
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
        paymentDate: new Date(3, 2, 2023),
        paymentAmount: 1000,
      };
      const expectedState = [...getRecoil(residentState)];
      expectedState[1] = {
        ...expectedState[1],
        rentInformation: [...resident.rentInformation],
      };
      expectedState[1].rentInformation[1] = {
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