/* eslint-disable @typescript-eslint/no-unsafe-return */

import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import {
  exportSaveStates,
  importSaveStates,
  persistenceFilenames,
} from './persistence';
import MonthYear from '_/extensions/date/month_year.extension';
import incidentalsState, {
  IncidentalsState,
} from '_/states/incidentals/incidentals.state';
import invoiceState, { InvoiceState } from '_/states/invoice/invoice.state';
import propertyState, { PropertyState } from '_/states/property/property.state';
import residentState, { ResidentState } from '_/states/resident/resident.state';
import waterCostsState, {
  WaterCostsState,
} from '_/states/waterCosts/waterCosts.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterCostsBuilder from '_/test/builders/waterCosts.builder';
import { exportObjectMock, importObjectMock } from '_/test/ipcApiMock';

const incidentals: IncidentalsState = {
  ongoingIncidentals: [
    new OngoingIncidentalsBuilder().build(),
    new OngoingIncidentalsBuilder().build(),
  ],
  oneTimeIncidentals: [
    new OneTimeIncidentalsBuilder().build(),
    new OneTimeIncidentalsBuilder().build(),
  ],
};
const invoices: InvoiceState = [
  new InvoiceBuilder().build(),
  new InvoiceBuilder().build(),
].reverse();
const residents: ResidentState = [
  new ResidentBuilder()
    .addRentInformation(
      new RentInformationBuilder().withDueDate(new MonthYear()).build(),
    )
    .build(),
  new ResidentBuilder()
    .addRentInformation(
      new RentInformationBuilder().withDueDate(new MonthYear()).build(),
    )
    .build(),
];
const property: PropertyState = new PropertyBuilder().build();
const waterCosts: WaterCostsState = new WaterCostsBuilder()
  .addSewageCost(100, new MonthYear())
  .addWaterUsageCost(123, new MonthYear())
  .build();

beforeEach(() => {
  render(<ReactTestWrapper />);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('importSaveStates', () => {
  test('should import states correctly', async () => {
    // Arrange
    importObjectMock
      .mockImplementation((filename: string) => {
        switch (filename) {
          case persistenceFilenames.incidentals:
            return JSON.parse(JSON.stringify(incidentals));
          case persistenceFilenames.invoices:
            return JSON.parse(JSON.stringify(invoices));
          case persistenceFilenames.residents:
            return JSON.parse(JSON.stringify(residents));
          case persistenceFilenames.property:
            return JSON.parse(JSON.stringify(property));
          case persistenceFilenames.waterCosts:
            return JSON.parse(JSON.stringify(waterCosts));
          default:
            throw new Error('Missing filename in mock implementation');
        }
      });

    // Act
    await act(async () => {
      await importSaveStates();
    });

    // Assert
    expect(getRecoil(incidentalsState)).toEqual(incidentals);
    expect(getRecoil(invoiceState)).toEqual(invoices);
    expect(getRecoil(residentState)).toEqual(residents);
    expect(getRecoil(propertyState)).toEqual(property);
    expect(getRecoil(waterCostsState)).toEqual(waterCosts);
  });
});

describe('exportSaveStates', () => {
  test('should export states correctly', () => {
    // Arrange
    act(() => {
      setRecoil(incidentalsState, incidentals);
      setRecoil(invoiceState, invoices);
      setRecoil(residentState, residents);
      setRecoil(propertyState, property);
      setRecoil(waterCostsState, waterCosts);
    });

    // Act
    exportSaveStates();

    // Assert
    expect(exportObjectMock).toHaveBeenNthCalledWith(
      1,
      incidentals,
      persistenceFilenames.incidentals,
    );
    expect(exportObjectMock).toHaveBeenNthCalledWith(
      2,
      invoices,
      persistenceFilenames.invoices,
    );
    expect(exportObjectMock).toHaveBeenNthCalledWith(
      3,
      residents,
      persistenceFilenames.residents,
    );
    expect(exportObjectMock).toHaveBeenNthCalledWith(
      4,
      property,
      persistenceFilenames.property,
    );
    expect(exportObjectMock).toHaveBeenNthCalledWith(
      5,
      waterCosts,
      persistenceFilenames.waterCosts,
    );
  });
});
