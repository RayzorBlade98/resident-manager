import { v4 } from 'uuid';
import ipcAPI from './ipcApi';
import ipcCommands from './ipcCommands';
import { DocumentTarget } from './utils/persistence/documentTarget';
import MonthYear from '_/extensions/date/month_year.extension';
import InvoiceBuilder from '_/test/builders/invoice.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import { ipcRenderer } from '_/test/electronModuleMock';

describe('ipcAPI', () => {
  let sendSpy: jest.SpyInstance;
  let invokeSpy: jest.SpyInstance;

  beforeEach(() => {
    sendSpy = jest.spyOn(ipcRenderer, 'send');
    invokeSpy = jest.spyOn(ipcRenderer, 'invoke');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('rendererReady should send rendererReady event', () => {
    // Act
    ipcAPI.rendererReady();

    // Assert
    expect(sendSpy).toHaveBeenLastCalledWith(ipcCommands.rendererReady);
  });

  describe('persistence', () => {
    test('exportObject should invoke exportObject event', async () => {
      // Arrange
      const objectToExport = { id: v4() };
      const filename = 'test.json';

      // Act
      await ipcAPI.persistence.exportObject(objectToExport, filename);

      // Assert
      expect(invokeSpy).toHaveBeenLastCalledWith(
        ipcCommands.exportObject,
        objectToExport,
        filename,
      );
    });

    test('importObject should invoke importObject event', async () => {
      // Arrange
      const filename = 'test.json';

      // Act
      await ipcAPI.persistence.importObject(filename);

      // Assert
      expect(invokeSpy).toHaveBeenLastCalledWith(
        ipcCommands.importObject,
        filename,
      );
    });

    test('uploadDocument should invoke uploadDocument event', async () => {
      // Arrange
      const uploadedFile = 'test/file.txt';
      const target: DocumentTarget = {
        type: 'resident',
        residentId: 'resident1',
      };
      const expectedDocumentId = 'uploaded-document-id';

      invokeSpy.mockResolvedValueOnce(expectedDocumentId);

      // Act
      const documentId = await ipcAPI.persistence.uploadDocument(
        uploadedFile,
        target,
      );

      // Assert
      expect(invokeSpy).toHaveBeenLastCalledWith(
        ipcCommands.uploadDocument,
        uploadedFile,
        target,
      );
      expect(documentId).toBe(expectedDocumentId);
    });
  });

  describe('documentGeneration', () => {
    test('generateInvoicePdfs should invoke generateInvoicePdfs event', async () => {
      // Arrange
      const invoice = new InvoiceBuilder().build();

      // Act
      await ipcAPI.documentGeneration.generateInvoicePdfs(invoice);

      // Assert
      expect(invokeSpy).toHaveBeenLastCalledWith(
        ipcCommands.generateInvoicePdfs,
        invoice,
      );
    });

    test('generateContractPdf should invoke generateContractPdf event', async () => {
      // Arrange
      const landlord = new LandlordBuilder().build();
      const resident = new ResidentBuilder().build();
      const property = new PropertyBuilder().build();
      const contractStart = new MonthYear(2, 2024);
      const args = {
        landlord,
        resident,
        property,
        contractStart,
      };

      // Act
      await ipcAPI.documentGeneration.generateContractPdf(args);

      // Assert
      expect(invokeSpy).toHaveBeenLastCalledWith(
        ipcCommands.generateContractPdf,
        args,
      );
    });

    test('generateRentIncreasePdf should invoke generateContractPdf event', async () => {
      // Arrange
      const resident = new ResidentBuilder().build();
      const property = new PropertyBuilder().build();
      const landlord = new LandlordBuilder().build();
      const newRent = 100;
      const monthForIncrease = new MonthYear(9, 2024);
      const args = {
        resident,
        newRent,
        monthForIncrease,
        property,
        landlord,
      };

      // Act
      await ipcAPI.documentGeneration.generateRentIncreasePdf(args);

      // Assert
      expect(invokeSpy).toHaveBeenLastCalledWith(
        ipcCommands.generateRentIncreasePdf,
        args,
      );
    });
  });

  describe('fileSystem', () => {
    test('selectFile should invoke selectFile event', async () => {
      // Act
      await ipcAPI.fileSystem.selectFile();

      // Assert
      expect(invokeSpy).toHaveBeenLastCalledWith(ipcCommands.selectFile);
    });
  });

  describe('windows', () => {
    test('openDocumentWindow should invoke openDocumentWindow event', async () => {
      // Arrange
      const documentId = 'document-id';
      const target: DocumentTarget = {
        type: 'resident',
        residentId: 'resident-id',
      };

      // Act
      await ipcAPI.windows.openDocumentWindow(documentId, target);

      // Assert
      expect(invokeSpy).toHaveBeenLastCalledWith(
        ipcCommands.openDocumentWindow,
        documentId,
        target,
      );
    });
  });
});
