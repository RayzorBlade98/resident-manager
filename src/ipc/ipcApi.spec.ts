import { v4 } from 'uuid';
import ipcAPI from './ipcApi';
import ipcCommands from './ipcCommands';
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
});
