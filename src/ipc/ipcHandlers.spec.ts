/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { range } from 'lodash';
import { v4 } from 'uuid';
import ipcCommands from './ipcCommands';
import addIpcHandlers from './ipcHandlers';
import * as persistenceModule from './utils/persistence';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import ResidentInvoiceInformationBuilder from '_/test/builders/residentInvoiceInformation.builder';
import { ipcMain, ipcRenderer } from '_/test/electronModuleMock';

describe('addIpcHandlers', () => {
  let exportObjectSpy: jest.SpyInstance;
  let importObjectSpy: jest.SpyInstance;
  let openDirectoryDialogSpy: jest.SpyInstance;
  let exportJsPdfSpy: jest.SpyInstance;

  beforeEach(() => {
    exportObjectSpy = jest
      .spyOn(persistenceModule, 'exportObject')
      .mockReturnValue();
    importObjectSpy = jest.spyOn(persistenceModule, 'importObject');
    openDirectoryDialogSpy = jest.spyOn(
      persistenceModule,
      'openDirectoryDialog',
    );
    exportJsPdfSpy = jest.spyOn(persistenceModule, 'exportJsPdf');

    addIpcHandlers();
  });

  afterEach(() => {
    Object.values(ipcCommands).forEach((c) => ipcMain.removeHandler(c));
    jest.resetAllMocks();
  });

  test('exportObject should be handled correctly', async () => {
    // Arrange
    const objectToExport = { id: v4() };
    const filename = 'test.json';

    // Act
    await ipcRenderer.invoke(
      ipcCommands.exportObject,
      objectToExport,
      filename,
    );

    // Assert
    expect(exportObjectSpy).toHaveBeenCalledWith(objectToExport, filename);
  });

  test('importObject should be handled correctly', async () => {
    // Arrange
    const mockedReturn = { id: v4() };
    const filename = 'test.json';
    importObjectSpy.mockReturnValueOnce(mockedReturn);

    // Act
    const imported = await ipcRenderer.invoke(
      ipcCommands.importObject,
      filename,
    );

    // Assert
    expect(importObjectSpy).toHaveBeenCalledWith(filename);
    expect(imported).toEqual(mockedReturn);
  });

  test('importObject should be handled exception correctly', async () => {
    // Arrange
    const filename = 'test.json';
    importObjectSpy.mockImplementationOnce(() => {
      throw new Error('importObject error');
    });

    // Act
    const imported = await ipcRenderer.invoke(
      ipcCommands.importObject,
      filename,
    );

    // Assert
    expect(importObjectSpy).toHaveBeenCalledWith(filename);
    expect(imported).toBeNull();
  });

  test('generateInvoicePdfs should be handled correctly', async () => {
    // Arrange
    const residents = range(0, 3).map((_) => new ResidentInvoiceInformationBuilder().build());
    const invoiceBuilder = new InvoiceBuilder();
    residents.forEach((r) => invoiceBuilder.withResident(r));
    const invoice = invoiceBuilder.build();
    const directory = 'testdir';

    openDirectoryDialogSpy.mockReturnValueOnce(directory);

    // Act
    await ipcRenderer.invoke(ipcCommands.generateInvoicePdfs, invoice);

    // Assert
    expect(openDirectoryDialogSpy).toHaveBeenCalledTimes(1);
    expect(exportJsPdfSpy).toHaveBeenCalledTimes(3);
  });

  test('generateInvoicePdfs should be handled correctly if no directory is selected', async () => {
    // Arrange
    const invoice = new InvoiceBuilder().build();
    openDirectoryDialogSpy.mockReturnValueOnce(undefined);

    // Act
    await ipcRenderer.invoke(ipcCommands.generateInvoicePdfs, invoice);

    // Assert
    expect(openDirectoryDialogSpy).toHaveBeenCalledTimes(1);
    expect(exportJsPdfSpy).toHaveBeenCalledTimes(0);
  });
});
