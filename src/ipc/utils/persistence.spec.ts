import fs from 'fs';
import path from 'path';
import { exportObject, importObject } from './persistence';
import getAppDataDirectory from './persistence/getAppDataDirectory';

describe('persistence', () => {
  const testObject = {};
  const testObjectJson = JSON.stringify(testObject, null, 4);
  const filename = 'test.json';
  const expectedFilename = path.join(getAppDataDirectory(), filename);

  let writeFileSyncSpy: jest.SpyInstance;
  let existsSyncSpy: jest.SpyInstance;
  let readFileSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue();
    readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    existsSyncSpy = jest.spyOn(fs, 'existsSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('exportObject', () => {
    test('should export object correctly', () => {
      // Act
      exportObject(testObject, filename);

      // Assert
      expect(writeFileSyncSpy).toHaveBeenLastCalledWith(
        expectedFilename,
        testObjectJson,
      );
    });
  });

  describe('importObject', () => {
    test('should import object correctly if file exists', () => {
      // Arrange
      existsSyncSpy.mockReturnValueOnce(true);
      readFileSyncSpy.mockReturnValueOnce(testObjectJson);

      // Act
      const imported = importObject(filename);

      // Assert
      expect(existsSyncSpy).toHaveBeenLastCalledWith(expectedFilename);
      expect(readFileSyncSpy).toHaveBeenLastCalledWith(expectedFilename);
      expect(imported).toEqual(testObject);
    });

    test("should return null if file doesn't exists", () => {
      // Arrange
      existsSyncSpy.mockReturnValueOnce(false);

      // Act
      const imported = importObject(filename);

      // Assert
      expect(existsSyncSpy).toHaveBeenLastCalledWith(expectedFilename);
      expect(readFileSyncSpy).toHaveBeenCalledTimes(0);
      expect(imported).toBeNull();
    });
  });

  describe('exportJsPdf', () => {
    test.todo('missing test');
  });

  describe('openDirectoryDialog', () => {
    test.todo('missing test');
  });

  describe('openFileDialog', () => {
    test.todo('missing test');
  });
});
