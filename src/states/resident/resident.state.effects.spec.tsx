/* eslint-disable max-len */

import { act, render } from '@testing-library/react';
import { range } from 'lodash';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import residentState from './resident.state';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterMeterReadingBuilder from '_/test/builders/water_meter_reading.builder';

beforeEach(() => {
  render(<ReactTestWrapper />);
});

const rentInformation = range(0, 5).map((i) => new RentInformationBuilder().withDueDate(new MonthYear(i, 2023)).build());
const expectedRentInformation = [...rentInformation].reverse();

const waterMeterReadings = range(0, 5).map((i) => new WaterMeterReadingBuilder().withReadingDate(new Date(2023, i, 1)).build());
const expectedWaterMeterReadings = [...waterMeterReadings].reverse();

const residents = range(0, 5).map((_) => new ResidentBuilder().build());

test('residentState effects should set the state correctly', () => {
  // Arrange
  const newState = residents.map((r) => ({
    ...r,
    rentInformation,
    waterMeterReadings,
  }));
  const expectedState = residents.map((r) => ({
    ...r,
    rentInformation: expectedRentInformation,
    waterMeterReadings: expectedWaterMeterReadings,
  }));

  // Act
  act(() => {
    setRecoil(residentState, newState);
  });

  // Assert
  expect(getRecoil(residentState)).toStrictEqual(expectedState);
});

describe('sortRentInformationEffect', () => {
  test('should sort rent information on set recoil', () => {
    // Arrange
    const newState = residents.map((r) => ({ ...r, rentInformation }));

    // Act
    act(() => {
      setRecoil(residentState, newState);
    });

    // Assert
    getRecoil(residentState).forEach((r) => {
      expect(r.rentInformation).toStrictEqual(expectedRentInformation);
    });
  });
});

describe('sortWaterMeterReadingsEffect', () => {
  test('should sort water meter readings on set recoil', () => {
    // Arrange
    const newState = residents.map((r) => ({ ...r, waterMeterReadings }));

    // Act
    act(() => {
      setRecoil(residentState, newState);
    });

    // Assert
    getRecoil(residentState).forEach((r) => {
      expect(r.waterMeterReadings).toStrictEqual(expectedWaterMeterReadings);
    });
  });
});
