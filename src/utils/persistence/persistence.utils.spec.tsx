/* eslint-disable max-len */
import fs from 'fs';
import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import * as recoil_nexus from 'recoil-nexus';
import incidentalsState, {
  IncidentalsState,
} from '../../states/incidentals/incidentals.state';
import RentInformationUtils from '../rent/rent.utils';
import PersistenceUtils from './persistence.utils';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';
import { Resident } from '_/models/resident/resident';
import invoiceState from '_/states/invoice/invoice.state';
import { propertyState } from '_/states/property/property.state';
import residentState from '_/states/resident/resident.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import ReactTestWrapper from '_/test/ReactTestWrapper';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import OneTimeIncidentalsBuilder from '_/test/builders/one_time_incidentals.builder';
import OngoingIncidentalsBuilder from '_/test/builders/ongoing_incidentals.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import WaterCostsBuilder from '_/test/builders/waterCosts.builder';

describe('PersistenceUtils', () => {
  let existsSyncSpy: jest.SpyInstance;
  let readFileSyncSpy: jest.SpyInstance;
  let mkdirSyncSpy: jest.SpyInstance;
  let writeFileSyncSpy: jest.SpyInstance;
  let addMissingMonthsSpy: jest.SpyInstance;
  let setRecoilSpy: jest.SpyInstance;

  beforeEach(() => {
    existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockReturnValue(undefined);
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue();
    addMissingMonthsSpy = jest
      .spyOn(RentInformationUtils, 'addMissingMonths')
      .mockReturnValue();
    setRecoilSpy = jest.spyOn(recoil_nexus, 'setRecoil');

    render(<ReactTestWrapper />);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('importSaveStates', () => {
    test('should import save state if files exist', () => {
      // Arrange
      const expectedIncidentalsState: IncidentalsState = {
        ongoingIncidentals: [new OngoingIncidentalsBuilder().build()],
        oneTimeIncidentals: [new OneTimeIncidentalsBuilder().build()],
      };
      const expectedInvoiceState: Invoice[] = [new InvoiceBuilder().build()];
      const expectedResidentState: Resident[] = [new ResidentBuilder().build()];
      const expectedPropertyState = new PropertyBuilder().build();
      const expectedWaterCostsState = new WaterCostsBuilder()
        .addWaterUsageCost(500, new MonthYear())
        .build();

      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy
        .mockReturnValueOnce(
          Buffer.from(
            JSON.stringify(expectedIncidentalsState, null, 4),
            'utf-8',
          ),
        )
        .mockReturnValueOnce(
          Buffer.from(JSON.stringify(expectedInvoiceState, null, 4), 'utf-8'),
        )
        .mockReturnValueOnce(
          Buffer.from(JSON.stringify(expectedResidentState, null, 4), 'utf-8'),
        )
        .mockReturnValueOnce(
          Buffer.from(JSON.stringify(expectedPropertyState, null, 4), 'utf-8'),
        )
        .mockReturnValueOnce(
          Buffer.from(
            JSON.stringify(expectedWaterCostsState, null, 4),
            'utf-8',
          ),
        );

      // Act
      act(() => {
        PersistenceUtils.importSaveStates();
      });

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(5);
      expect(readFileSyncSpy).toHaveBeenCalledTimes(5);
      expect(setRecoilSpy).toHaveBeenCalledTimes(5);

      const newIncidentalsState = getRecoil(incidentalsState);
      const newInvoiceState = getRecoil(invoiceState);
      const newResidentState = getRecoil(residentState);
      const newPropertyState = getRecoil(propertyState);
      const newWaterCostState = getRecoil(waterCostsState);
      expect(newIncidentalsState).toEqual(expectedIncidentalsState);
      expect(newInvoiceState).toEqual(expectedInvoiceState);
      expect(newResidentState).toEqual(expectedResidentState);
      expect(newPropertyState).toEqual(expectedPropertyState);
      expect(newWaterCostState).toEqual(expectedWaterCostsState);
    });

    test("shouldn't import save state if files dont exist", () => {
      // Arrange
      existsSyncSpy.mockReturnValue(false);
      const expectedIncidentalsState = getRecoil(incidentalsState);
      const expectedInvoiceState = getRecoil(invoiceState);
      const expectedResidentState = getRecoil(residentState);
      const expectedWaterCostState = getRecoil(waterCostsState);

      // Act
      act(() => {
        PersistenceUtils.importSaveStates();
      });

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(5);
      expect(readFileSyncSpy).toHaveBeenCalledTimes(0);
      expect(setRecoilSpy).toHaveBeenCalledTimes(0);

      const newIncidentalsState = getRecoil(incidentalsState);
      const newInvoiceState = getRecoil(invoiceState);
      const newResidentState = getRecoil(residentState);
      const newWaterCostState = getRecoil(waterCostsState);
      expect(newIncidentalsState).toEqual(expectedIncidentalsState);
      expect(newInvoiceState).toEqual(expectedInvoiceState);
      expect(newResidentState).toEqual(expectedResidentState);
      expect(newWaterCostState).toEqual(expectedWaterCostState);
    });

    test('should add missing months to rent information', () => {
      // Arrange
      existsSyncSpy
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const rentInformation1 = new RentInformationBuilder()
        .withDueDate(new MonthYear(5, 2023))
        .build();
      const rentInformation2 = new RentInformationBuilder()
        .withDueDate(new MonthYear(5, 2023))
        .build();
      const expectedResidentState: Resident[] = [
        new ResidentBuilder().addRentInformation(rentInformation1).build(),
        new ResidentBuilder().addRentInformation(rentInformation2).build(),
      ];

      readFileSyncSpy.mockReturnValueOnce(
        Buffer.from(JSON.stringify(expectedResidentState, null, 4), 'utf-8'),
      );

      // Act
      act(() => {
        PersistenceUtils.importSaveStates();
      });

      // Assert
      expect(addMissingMonthsSpy).toHaveBeenCalledTimes(2);
      expect(addMissingMonthsSpy.mock.calls).toEqual([
        [[rentInformation1]],
        [[rentInformation2]],
      ]);
    });
  });

  describe('exportSaveStates', () => {
    test("should create dir if it doesn't exist", () => {
      // Arrange
      existsSyncSpy.mockReturnValue(false);

      // Act
      PersistenceUtils.exportSaveStates();

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(1);
      expect(mkdirSyncSpy).toHaveBeenCalledTimes(1);
    });

    test("shouldn't create dir if it exists", () => {
      // Arrange
      existsSyncSpy.mockReturnValue(true);

      // Act
      PersistenceUtils.exportSaveStates();

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(1);
      expect(mkdirSyncSpy).toHaveBeenCalledTimes(0);
    });

    test('should export states', () => {
      // Arrange
      const expectedIncidentalsState: IncidentalsState = {
        ongoingIncidentals: [new OngoingIncidentalsBuilder().build()],
        oneTimeIncidentals: [new OneTimeIncidentalsBuilder().build()],
      };
      const expectedInvoiceState: Invoice[] = [new InvoiceBuilder().build()];
      const expectedResidentState: Resident[] = [new ResidentBuilder().build()];
      const expectedPropertyState = new PropertyBuilder().build();
      const expectedWaterCostsState = new WaterCostsBuilder()
        .addWaterUsageCost(500, new MonthYear())
        .build();

      act(() => {
        setRecoil(incidentalsState, expectedIncidentalsState);
        setRecoil(invoiceState, expectedInvoiceState);
        setRecoil(residentState, expectedResidentState);
        setRecoil(propertyState, expectedPropertyState);
        setRecoil(waterCostsState, expectedWaterCostsState);
      });

      // Act
      PersistenceUtils.exportSaveStates();

      // Assert
      expect(writeFileSyncSpy.mock.calls).toEqual([
        [
          PersistenceUtils.INCIDENTALS_FILE,
          JSON.stringify(expectedIncidentalsState, null, 4),
        ],
        [
          PersistenceUtils.INVOICES_FILE,
          JSON.stringify(expectedInvoiceState, null, 4),
        ],
        [
          PersistenceUtils.RESIDENTS_FILE,
          JSON.stringify(expectedResidentState, null, 4),
        ],
        [
          PersistenceUtils.PROPERTY_FILE,
          JSON.stringify(expectedPropertyState, null, 4),
        ],
        [
          PersistenceUtils.WATER_COSTS_FILE,
          JSON.stringify(expectedWaterCostsState, null, 4),
        ],
      ]);
    });
  });
});
