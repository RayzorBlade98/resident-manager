import fs from 'fs';
import path from 'path';
import { exportObject } from './exportObject';
import getAppDataDirectory from '_/ipc/utils/persistence/getAppDataDirectory';

describe('exportObject', () => {
  const testObject = {};
  const testObjectJson = JSON.stringify(testObject, null, 4);
  const filename = 'test.json';
  const expectedFilename = path.join(getAppDataDirectory(), filename);

  let writeFileSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

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
