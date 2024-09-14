import fs from 'fs';
import path from 'path';
import { directories } from '../../../utils/persistence/directories';
import { exportObject } from './exportObject';

describe('exportObject', () => {
  const testObject = {};
  const testObjectJson = JSON.stringify(testObject, null, 4);
  const filename = 'test.json';
  const expectedFilename = path.join(directories.appData(), filename);

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
