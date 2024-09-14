import { rm } from 'fs/promises';
import path from 'path';
import { mdToPdfFile } from 'electron-md-to-pdf';
import { v4 } from 'uuid';
import { directories } from '../directories';
import { DocumentTarget } from '../documentTarget';
import { uploadMarkdownAsPdf } from './uploadMarkdownAsPdf';
import * as uploadDocumentModule from '_/ipc/modules/persistence/uploadDocument/uploadDocument';

jest.mock('electron-md-to-pdf', () => ({
  mdToPdfFile: jest.fn().mockReturnValue(Promise.resolve()),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  rm: jest.fn(),
}));

describe('uploadMarkdownAsPdf', () => {
  it('should handle pdf generation and upload correctly', async () => {
    // Arrange
    const markdownContent = 'my markdownContent';
    const target: DocumentTarget = {
      type: 'resident',
      residentId: 'resident-id',
    };
    const mdToPdfOptions = {
      cssFiles: ['test/file1', 'file2'],
    };

    const tmpId = 'tmp-id';
    const documentId = 'document-id';
    (v4 as jest.Mock)
      .mockReturnValueOnce(tmpId)
      .mockReturnValueOnce(documentId);

    const uploadDocumentMock = jest
      .spyOn(uploadDocumentModule, 'default')
      .mockReturnValue(documentId);

    const tmpFile = path.join(directories.temporary(), `${tmpId}.pdf`);

    // Act
    const actualDocumentId = await uploadMarkdownAsPdf({
      markdownContent,
      target,
      mdToPdfOptions,
    });

    // Assert
    expect(mdToPdfFile).toHaveBeenCalledTimes(1);
    expect(mdToPdfFile).toHaveBeenLastCalledWith(
      markdownContent,
      tmpFile,
      expect.objectContaining(mdToPdfOptions),
    );

    expect(uploadDocumentMock).toHaveBeenCalledTimes(1);
    expect(uploadDocumentMock).toHaveBeenLastCalledWith(tmpFile, target);

    expect(rm).toHaveBeenCalledTimes(1);
    expect(rm).toHaveBeenLastCalledWith(tmpFile);

    expect(actualDocumentId).toBe(documentId);
  });
});
