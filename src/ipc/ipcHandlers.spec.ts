/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { range } from 'lodash';
import { v4 } from 'uuid';
import ipcCommands from './ipcCommands';
import addIpcHandlers from './ipcHandlers';
import generateContract from './modules/documentGeneration/contractGeneration/generateContract';
import { ContractGenerationArgs } from './modules/documentGeneration/contractGeneration/generateContractMarkdown';
import { GenerateRentIncreasePdfArgs } from './modules/documentGeneration/rentIncrease/GenerateRentIncreasePdfArgs';
import * as rentIncreaseModule from './modules/documentGeneration/rentIncrease/generateRentIncreasePdf';
import * as exportObjectModule from './modules/persistence/exportObject/exportObject';
import * as importObjectModule from './modules/persistence/importObject/importObject';
import * as uploadDocumentModule from './modules/persistence/uploadDocument/uploadDocument';
import * as persistenceModule from './utils/persistence';
import { DocumentTarget } from './utils/persistence/documentTarget';
import MonthYear from '_/extensions/date/month_year.extension';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import ResidentInvoiceInformationBuilder from '_/test/builders/residentInvoiceInformation.builder';
import { ipcMain, ipcRenderer } from '_/test/electronModuleMock';

jest.mock(
  './modules/documentGeneration/contractGeneration/generateContract',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

describe('addIpcHandlers', () => {
  let exportObjectSpy: jest.SpyInstance;
  let importObjectSpy: jest.SpyInstance;
  let openDirectoryDialogSpy: jest.SpyInstance;
  let openFileDialogSpy: jest.SpyInstance;
  let exportJsPdfSpy: jest.SpyInstance;

  beforeEach(() => {
    exportObjectSpy = jest
      .spyOn(exportObjectModule, 'exportObject')
      .mockReturnValue();
    importObjectSpy = jest.spyOn(importObjectModule, 'importObject');
    openDirectoryDialogSpy = jest.spyOn(
      persistenceModule,
      'openDirectoryDialog',
    );
    openFileDialogSpy = jest.spyOn(persistenceModule, 'openFileDialog');
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

  test('generateContractPdf should be handled correctly', async () => {
    // Arrange
    const landlord = new LandlordBuilder().build();
    const resident = new ResidentBuilder().build();
    const property = new PropertyBuilder().build();
    const contractStart = new MonthYear();
    const args: ContractGenerationArgs = {
      landlord,
      resident,
      property,
      contractStart,
    };

    // Act
    await ipcRenderer.invoke(ipcCommands.generateContractPdf, args);

    // Assert
    expect(generateContract).toHaveBeenCalledTimes(1);
    expect(generateContract).toHaveBeenLastCalledWith(args);
  });

  test('selectFile should be handled correctly', async () => {
    // Arrange
    const expectedFile = 'test/file.pdf';
    openFileDialogSpy.mockReturnValueOnce(expectedFile);

    // Act
    const file = await ipcRenderer.invoke(ipcCommands.selectFile);

    // Assert
    expect(file).toBe(expectedFile);
  });

  test('uploadDocument should be handled correctly', async () => {
    // Arrange
    const uploadedFile = 'test/file.txt';
    const fileName = 'test.txt';
    const target: DocumentTarget = {
      type: 'resident',
      residentId: 'resident1',
    };

    const uploadDocumentMock = jest
      .spyOn(uploadDocumentModule, 'default')
      .mockReturnValue();

    // Act
    await ipcRenderer.invoke(
      ipcCommands.uploadDocument,
      uploadedFile,
      fileName,
      target,
    );

    // Act
    expect(uploadDocumentMock).toHaveBeenCalledTimes(1);
    expect(uploadDocumentMock).toHaveBeenLastCalledWith(
      uploadedFile,
      fileName,
      target,
    );
  });

  test('generateRentIncreasePdf should be handled correctly', async () => {
    // Arrange
    const generateRentIncreasePdfMock = jest
      .spyOn(rentIncreaseModule, 'generateRentIncreasePdf')
      .mockReturnValue();

    const args: GenerateRentIncreasePdfArgs = {};

    // Act
    await ipcRenderer.invoke(ipcCommands.generateRentIncreasePdf, args);

    // Act
    expect(generateRentIncreasePdfMock).toHaveBeenCalledTimes(1);
    expect(generateRentIncreasePdfMock).toHaveBeenLastCalledWith(args);
  });
});
