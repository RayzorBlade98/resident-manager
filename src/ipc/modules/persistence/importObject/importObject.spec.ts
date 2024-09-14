import fs from 'fs';
import path from 'path';
import { directories } from '../../../utils/persistence/directories';
import { importObject } from './importObject';

describe('importObject', () => {
  const testObject = { test: 'hello' };
  const testObjectJson = JSON.stringify(testObject, null, 4);
  const filename = 'test.json';
  const expectedFilename = path.join(directories.appData(), filename);

  let existsSyncSpy: jest.SpyInstance;
  let readFileSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    existsSyncSpy = jest.spyOn(fs, 'existsSync');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

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
