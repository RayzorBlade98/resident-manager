/* eslint-disable max-len */
import fs from 'fs';
import { act, render } from '@testing-library/react';
import React from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';
import * as recoil_nexus from 'recoil-nexus';
import IncidentalsState, {
  incidentalsState,
} from '_/states/saveStates/incidentals_state';
import { InvoiceState, invoiceState } from '_/states/saveStates/invoice_state';
import SaveStatePersistenceManager from '_/states/saveStates/persistence';
import residentState, {
  ResidentState,
} from '_/states/saveStates/resident_state';
import { RentInformationUtils } from '_/types/rent';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';
import IncidentalsBuilder from '_tests/__test_utils__/builders/incidentals_builder';
import InvoiceBuilder from '_tests/__test_utils__/builders/invoice_builder';
import RentInformationBuilder from '_tests/__test_utils__/builders/rent_information_builder';
import ResidentBuilder from '_tests/__test_utils__/builders/resident_builder';

describe('SaveStatePersistenceManager', () => {
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
      const expectedIncidentalsState: IncidentalsState = [
        new IncidentalsBuilder().build(),
      ];
      const expectedInvoiceState: InvoiceState = [new InvoiceBuilder().build()];
      const expectedResidentState: ResidentState = [
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
        SaveStatePersistenceManager.importSaveStates();
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
        SaveStatePersistenceManager.importSaveStates();
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
        .withYear(2023)
        .build();
      const rentInformation2 = new RentInformationBuilder()
        .withYear(2024)
        .build();
      const expectedResidentState: ResidentState = [
        new ResidentBuilder().addRentInformation(rentInformation1).build(),
        new ResidentBuilder().addRentInformation(rentInformation2).build(),
      ];

      readFileSyncSpy.mockReturnValueOnce(
        Buffer.from(JSON.stringify(expectedResidentState, null, 4), 'utf-8'),
      );

      // Act
      act(() => {
        SaveStatePersistenceManager.importSaveStates();
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
      SaveStatePersistenceManager.exportSaveStates();

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(1);
      expect(mkdirSyncSpy).toHaveBeenCalledTimes(1);
    });

    test("shouldn't create dir if it exists", () => {
      // Arrange
      existsSyncSpy.mockReturnValue(true);

      // Act
      SaveStatePersistenceManager.exportSaveStates();

      // Assert
      expect(existsSyncSpy).toHaveBeenCalledTimes(1);
      expect(mkdirSyncSpy).toHaveBeenCalledTimes(0);
    });

    test('should export states', () => {
      // Arrange
      const expectedIncidentalsState: IncidentalsState = [
        new IncidentalsBuilder().build(),
      ];
      const expectedInvoiceState: InvoiceState = [new InvoiceBuilder().build()];
      const expectedResidentState: ResidentState = [
        new ResidentBuilder().build(),
      ];

      act(() => {
        setRecoil(incidentalsState, expectedIncidentalsState);
        setRecoil(invoiceState, expectedInvoiceState);
        setRecoil(residentState, expectedResidentState);
      });

      // Act
      SaveStatePersistenceManager.exportSaveStates();

      // Assert
      expect(writeFileSyncSpy.mock.calls).toEqual([
        [
          SaveStatePersistenceManager.INCIDENTALS_FILE,
          JSON.stringify(expectedIncidentalsState, null, 4),
        ],
        [
          SaveStatePersistenceManager.INVOICES_FILE,
          JSON.stringify(expectedInvoiceState, null, 4),
        ],
        [
          SaveStatePersistenceManager.RESIDENTS_FILE,
          JSON.stringify(expectedResidentState, null, 4),
        ],
      ]);
    });
  });
});
