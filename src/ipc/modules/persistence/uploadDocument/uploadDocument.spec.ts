import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { DocumentTarget } from '../../../utils/persistence/documentTarget';
import * as getAppDataDirectoryModule from '../../../utils/persistence/getAppDataDirectory';
import uploadDocument from './uploadDocument';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('uploadDocument', () => {
  const appDataDir = 'appData';
  const uploadedFile = 'test/file.txt';
  const target: DocumentTarget = {
    type: 'resident',
    residentId: 'resident1',
  };
  const expectedDocumentId = 'uploaded-document-id';

  const destinationDir = path.join(appDataDir, `documents/residents/${target.residentId}`);
  const destinationFile = path.join(destinationDir, `${expectedDocumentId}.txt`);

  let existsSyncMock: jest.SpyInstance;
  let mkdirSyncMock: jest.SpyInstance;
  let copyFileSyncMock: jest.SpyInstance;

  beforeEach(() => {
    jest
      .spyOn(getAppDataDirectoryModule, 'default')
      .mockReturnValue(appDataDir);

    existsSyncMock = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    mkdirSyncMock = jest.spyOn(fs, 'mkdirSync').mockImplementation();
    copyFileSyncMock = jest.spyOn(fs, 'copyFileSync').mockImplementation();

    (v4 as jest.Mock).mockReturnValue(expectedDocumentId);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should copy file correctly', () => {
    // Act
    const documentId = uploadDocument(uploadedFile, target);

    // Assert
    expect(copyFileSyncMock).toHaveBeenCalledTimes(1);
    expect(copyFileSyncMock).toHaveBeenLastCalledWith(
      uploadedFile,
      destinationFile,
    );
    expect(documentId).toBe(expectedDocumentId);
  });

  it('should create dir if not existing', () => {
    // Arrange
    existsSyncMock.mockReturnValue(false);

    // Act
    uploadDocument(uploadedFile, target);

    // Assert
    expect(mkdirSyncMock).toHaveBeenCalledTimes(1);
    expect(mkdirSyncMock).toHaveBeenLastCalledWith(destinationDir, {
      recursive: true,
    });
  });

  it("shouldn't create dir if already existing", () => {
    // Arrange
    existsSyncMock.mockReturnValue(true);

    // Act
    uploadDocument(uploadedFile, target);

    // Assert
    expect(mkdirSyncMock).toHaveBeenCalledTimes(0);
  });
});
