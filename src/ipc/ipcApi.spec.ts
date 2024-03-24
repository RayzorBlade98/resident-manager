import { v4 } from 'uuid';
import ipcAPI from './ipcApi';
import ipcCommands from './ipcCommands';
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

  test('exportObject should invoke exportObject event', async () => {
    // Arrange
    const objectToExport = { id: v4() };
    const filename = 'test.json';

    // Act
    await ipcAPI.exportObject(objectToExport, filename);

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
    await ipcAPI.importObject(filename);

    // Assert
    expect(invokeSpy).toHaveBeenLastCalledWith(
      ipcCommands.importObject,
      filename,
    );
  });

  test('generateInvoicePdfs should invoke generateInvoicePdfs event', async () => {
    // Arrange
    const invoice = new InvoiceBuilder().build();

    // Act
    await ipcAPI.generateInvoicePdfs(invoice);

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
      landlord, resident, property, contractStart,
    };

    // Act
    await ipcAPI.generateContractPdf(args);

    // Assert
    expect(invokeSpy).toHaveBeenLastCalledWith(
      ipcCommands.generateContractPdf,
      args,
    );
  });
});
