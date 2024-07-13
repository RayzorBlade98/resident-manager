import fs from 'fs';
import path from 'path';
import { DocumentTarget } from './documentTarget';
import * as getAppDataDirectoryModule from './getAppDataDirectory';
import uploadDocument from './uploadDocument';

describe('uploadDocument', () => {
  const appDataDir = 'appData';
  const uploadedFile = 'test/file.txt';
  const fileName = 'test.txt';
  const target: DocumentTarget = {
    type: 'resident',
    residentId: 'resident1',
  };

  const destinationDir = path.join(appDataDir, 'documents/residents/resident1');
  const destinationFile = path.join(destinationDir, fileName);

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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should copy file correctly', () => {
    // Act
    uploadDocument(uploadedFile, fileName, target);

    // Assert
    expect(copyFileSyncMock).toHaveBeenCalledTimes(1);
    expect(copyFileSyncMock).toHaveBeenLastCalledWith(
      uploadedFile,
      destinationFile,
    );
  });

  it('should create dir if not existing', () => {
    // Arrange
    existsSyncMock.mockReturnValue(false);

    // Act
    uploadDocument(uploadedFile, fileName, target);

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
    uploadDocument(uploadedFile, fileName, target);

    // Assert
    expect(mkdirSyncMock).toHaveBeenCalledTimes(0);
  });
});
