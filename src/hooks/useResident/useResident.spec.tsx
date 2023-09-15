/* eslint-disable react-hooks/rules-of-hooks */

import { act, renderHook } from '@testing-library/react';
import { range } from 'lodash';
import { RecoilRoot } from 'recoil';
import useResident from './useResident';
import MonthYear from '_/extensions/date/month_year.extension';
import residentState from '_/states/resident/resident.state';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';

describe('useResident', () => {
  const residents = range(0, 3).map((_) => new ResidentBuilder()
    .addWaterMeterReading(
      new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 7, 15))
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(8, 2023))
        .build(),
    )
    .addRentInformation(
      new RentInformationBuilder()
        .withDueDate(new MonthYear(7, 2023))
        .build(),
    )
    .build());
  const selectedResident = residents[1];

  describe('residents', () => {
    test('should return right resident', () => {
      // Arrange
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Assert
      expect(result.current.resident).toEqual(selectedResident);
    });
  });

  describe('addWaterMeterReading', () => {
    test('should set state correctly', () => {
      // Arrange
      const waterMeterReading = new WaterMeterReadingBuilder()
        .withReadingDate(new Date(2023, 8, 15))
        .build();
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.addWaterMeterReading(waterMeterReading);
      });

      // Assert
      expect(result.current.resident).toEqual({
        ...selectedResident,
        waterMeterReadings: [
          waterMeterReading,
          ...selectedResident.waterMeterReadings,
        ],
      });
    });
  });

  describe('addRentPayment', () => {
    test('should set state correctly', () => {
      // Arrange
      const rentPayment = {
        dueDate: selectedResident.rentInformation[1].dueDate,
        paymentDate: new Date(),
        paymentAmount: 12345,
      };
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: () => useResident(selectedResident.id),
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Act
      act(() => {
        result.current.addRentPayment(rentPayment);
      });

      // Assert
      expect(result.current.resident).toEqual({
        ...selectedResident,
        rentInformation: [
          selectedResident.rentInformation[0],
          { ...selectedResident.rentInformation[1], ...rentPayment },
        ],
      });
    });
  });
});
