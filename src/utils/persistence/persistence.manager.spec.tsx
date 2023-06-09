/* eslint-disable max-len */
import fs from 'fs';
import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import * as recoil_nexus from 'recoil-nexus';
import incidentalsState from '../../states/incidentals/incidentals.state';
import MonthYear from '_/extensions/date/month_year.extension';
import invoiceState from '_/states/invoice/invoice.state';
import residentState from '_/states/resident/resident.state';
import { Incidentals } from '_/types/incidentals';
import { Invoice } from '_/types/invoice';
import { RentInformationUtils } from '_/types/rent';
import { Resident } from '_/types/resident';
import PersistenceManager from '_/utils/persistence/persistence.manager';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import IncidentalsBuilder from '_tests/__test_utils__/builders/incidentals_builder';
import InvoiceBuilder from '_tests/__test_utils__/builders/invoice_builder';
import RentInformationBuilder from '_tests/__test_utils__/builders/rent_information_builder';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';

describe('PersistenceManager', () => {
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

    render(<RecoilTestWrapper />);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('importSaveStates', () => {
    test('should import save state if files exist', () => {
      // Arrange
      const expectedIncidentalsState: Incidentals[] = [
        new IncidentalsBuilder().build(),
      ];
      const expectedInvoiceState: Invoice[] = [new InvoiceBuilder().build()];
      const expectedResidentState: Resident[] = [
        new ResidentBuilder().build(),
      ];

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
        );

      // Act
      act(() => {
        PersistenceManager.importSaveStates();
      });

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(3);
      expect(readFileSyncSpy).toHaveBeenCalledTimes(3);
      expect(setRecoilSpy).toHaveBeenCalledTimes(3);

      const newIncidentalsState = getRecoil(incidentalsState);
      const newInvoiceState = getRecoil(invoiceState);
      const newResidentState = getRecoil(residentState);
      expect(newIncidentalsState).toEqual(expectedIncidentalsState);
      expect(newInvoiceState).toEqual(expectedInvoiceState);
      expect(newResidentState).toEqual(expectedResidentState);
    });

    test("shouldn't import save state if files dont exist", () => {
      // Arrange
      existsSyncSpy.mockReturnValue(false);
      const expectedIncidentalsState = getRecoil(incidentalsState);
      const expectedInvoiceState = getRecoil(invoiceState);
      const expectedResidentState = getRecoil(residentState);

      // Act
      act(() => {
        PersistenceManager.importSaveStates();
      });

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(3);
      expect(readFileSyncSpy).toHaveBeenCalledTimes(0);
      expect(setRecoilSpy).toHaveBeenCalledTimes(0);

      const newIncidentalsState = getRecoil(incidentalsState);
      const newInvoiceState = getRecoil(invoiceState);
      const newResidentState = getRecoil(residentState);
      expect(newIncidentalsState).toEqual(expectedIncidentalsState);
      expect(newInvoiceState).toEqual(expectedInvoiceState);
      expect(newResidentState).toEqual(expectedResidentState);
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
        PersistenceManager.importSaveStates();
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
      PersistenceManager.exportSaveStates();

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(1);
      expect(mkdirSyncSpy).toHaveBeenCalledTimes(1);
    });

    test("shouldn't create dir if it exists", () => {
      // Arrange
      existsSyncSpy.mockReturnValue(true);

      // Act
      PersistenceManager.exportSaveStates();

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(1);
      expect(mkdirSyncSpy).toHaveBeenCalledTimes(0);
    });

    test('should export states', () => {
      // Arrange
      const expectedIncidentalsState: Incidentals[] = [
        new IncidentalsBuilder().build(),
      ];
      const expectedInvoiceState: Invoice[] = [new InvoiceBuilder().build()];
      const expectedResidentState: Resident[] = [
        new ResidentBuilder().build(),
      ];

      act(() => {
        setRecoil(incidentalsState, expectedIncidentalsState);
        setRecoil(invoiceState, expectedInvoiceState);
        setRecoil(residentState, expectedResidentState);
      });

      // Act
      PersistenceManager.exportSaveStates();

      // Assert
      expect(writeFileSyncSpy.mock.calls).toEqual([
        [
          PersistenceManager.INCIDENTALS_FILE,
          JSON.stringify(expectedIncidentalsState, null, 4),
        ],
        [
          PersistenceManager.INVOICES_FILE,
          JSON.stringify(expectedInvoiceState, null, 4),
        ],
        [
          PersistenceManager.RESIDENTS_FILE,
          JSON.stringify(expectedResidentState, null, 4),
        ],
      ]);
    });
  });
});
