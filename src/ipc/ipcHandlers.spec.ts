/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { v4 } from 'uuid';
import ipcCommands from './ipcCommands';
import addIpcHandlers from './ipcHandlers';
import generateContract from './modules/documentGeneration/contractGeneration/generateContract';
import { ContractGenerationArgs } from './modules/documentGeneration/contractGeneration/generateContractMarkdown';
import { generateInvoicePdfs } from './modules/documentGeneration/invoiceGeneration/generateInvoicePdfs';
import { GenerateRentIncreasePdfArgs } from './modules/documentGeneration/rentIncrease/GenerateRentIncreasePdfArgs';
import { generateRentIncreasePdf } from './modules/documentGeneration/rentIncrease/generateRentIncreasePdf';
import * as exportObjectModule from './modules/persistence/exportObject/exportObject';
import * as importObjectModule from './modules/persistence/importObject/importObject';
import * as uploadDocumentModule from './modules/persistence/uploadDocument/uploadDocument';
import { openDocumentWindow } from './modules/windows/openFileWindow/openFileWindow';
import * as persistenceModule from './utils/persistence';
import { DocumentTarget } from './utils/persistence/documentTarget';
import MonthYear from '_/extensions/date/month_year.extension';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import { ipcMain, ipcRenderer } from '_/test/electronModuleMock';

jest.mock(
  './modules/documentGeneration/contractGeneration/generateContract',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock(
  './modules/documentGeneration/rentIncrease/generateRentIncreasePdf',
  () => ({
    generateRentIncreasePdf: jest.fn(),
  }),
);

jest.mock(
  './modules/documentGeneration/invoiceGeneration/generateInvoicePdfs',
  () => ({
    generateInvoicePdfs: jest.fn(),
  }),
);

jest.mock('./modules/windows/openFileWindow/openFileWindow', () => ({
  openDocumentWindow: jest.fn(),
}));

describe('addIpcHandlers', () => {
  let exportObjectSpy: jest.SpyInstance;
  let importObjectSpy: jest.SpyInstance;
  let openFileDialogSpy: jest.SpyInstance;

  beforeEach(() => {
    exportObjectSpy = jest
      .spyOn(exportObjectModule, 'exportObject')
      .mockReturnValue();
    importObjectSpy = jest.spyOn(importObjectModule, 'importObject');
    openFileDialogSpy = jest.spyOn(persistenceModule, 'openFileDialog');

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
    const invoice = new InvoiceBuilder().build();

    // Act
    await ipcRenderer.invoke(ipcCommands.generateInvoicePdfs, invoice);

    // Assert
    expect(generateInvoicePdfs).toHaveBeenCalledTimes(1);
    expect(generateInvoicePdfs).toHaveBeenLastCalledWith(invoice);
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
    const target: DocumentTarget = {
      type: 'resident',
      residentId: 'resident1',
    };
    const expectedDocumentId = 'uploaded-document-id';

    const uploadDocumentMock = jest
      .spyOn(uploadDocumentModule, 'default')
      .mockReturnValue(expectedDocumentId);

    // Act
    const documentId = await ipcRenderer.invoke(
      ipcCommands.uploadDocument,
      uploadedFile,
      target,
    );

    // Act
    expect(uploadDocumentMock).toHaveBeenCalledTimes(1);
    expect(uploadDocumentMock).toHaveBeenLastCalledWith(uploadedFile, target);
    expect(documentId).toBe(expectedDocumentId);
  });

  test('generateRentIncreasePdf should be handled correctly', async () => {
    // Arrange
    const documentId = 'rent increase id';
    (generateRentIncreasePdf as jest.Mock).mockResolvedValue(documentId);

    const resident = new ResidentBuilder().build();
    const property = new PropertyBuilder().build();
    const landlord = new LandlordBuilder().build();
    const newRent = 100;
    const monthForIncrease = new MonthYear(9, 2024);
    const args: GenerateRentIncreasePdfArgs = {
      resident,
      newRent,
      monthForIncrease,
      property,
      landlord,
    };

    // Act
    const actualDocumentId = await ipcRenderer.invoke(
      ipcCommands.generateRentIncreasePdf,
      args,
    );

    // Act
    expect(generateRentIncreasePdf).toHaveBeenCalledTimes(1);
    expect(generateRentIncreasePdf).toHaveBeenLastCalledWith(args);

    expect(actualDocumentId).toEqual(documentId);
  });

  test('openDocumentWindow should be handled correctly', async () => {
    // Arrange
    const documentId = 'document-id';
    const target: DocumentTarget = {
      type: 'resident',
      residentId: 'resident-id',
    };

    // Act
    await ipcRenderer.invoke(
      ipcCommands.openDocumentWindow,
      documentId,
      target,
    );

    // Assert
    expect(openDocumentWindow).toHaveBeenCalledTimes(1);
    expect(openDocumentWindow).toHaveBeenLastCalledWith(documentId, target);
  });
});
