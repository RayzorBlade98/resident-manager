import { rm } from 'fs/promises';
import path from 'path';
import { mdToPdfFile } from 'electron-md-to-pdf';
import { v4 } from 'uuid';
import generateContract from './generateContract';
import {
  ContractGenerationArgs,
  generateContractMarkdown,
} from './generateContractMarkdown';
import MonthYear from '_/extensions/date/month_year.extension';
import * as uploadDocumentModule from '_/ipc/modules/persistence/uploadDocument/uploadDocument';
import * as getAppDataDirectoryModule from '_/ipc/utils/persistence/getAppDataDirectory';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import Imported from '_/types/Imported';

jest.mock('./generateContractMarkdown', () => ({
  generateContractMarkdown: jest.fn(),
}));

jest.mock('electron-md-to-pdf', () => ({
  mdToPdfFile: jest.fn().mockReturnValue(Promise.resolve()),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  rm: jest.fn(),
}));

describe('generateContract', () => {
  test('should handle contract generation correctly', async () => {
    // Arrange
    const markdown = 'test markdown';
    (generateContractMarkdown as jest.Mock).mockReturnValueOnce(markdown);

    const landlord = new LandlordBuilder().build();
    const resident = new ResidentBuilder().build();
    const property = new PropertyBuilder().build();
    const contractStart = new MonthYear();
    const args: ContractGenerationArgs = {
      landlord,
      resident,
      property,
      contractStart,
    };
    const importedArgs = JSON.parse(
      JSON.stringify(args),
    ) as Imported<ContractGenerationArgs>;

    const tmpId = 'tmp-id';
    const documentId = 'document-id';
    (v4 as jest.Mock)
      .mockReturnValueOnce(tmpId)
      .mockReturnValueOnce(documentId);

    const tmpDir = 'tmp';
    jest
      .spyOn(getAppDataDirectoryModule, 'getTmpDirectory')
      .mockReturnValue(tmpDir);

    const assetDir = 'assets';
    jest
      .spyOn(getAppDataDirectoryModule, 'getAssetDirectory')
      .mockReturnValue(assetDir);

    const uploadDocumentMock = jest
      .spyOn(uploadDocumentModule, 'default')
      .mockReturnValue();

    const tmpFile = path.join(tmpDir, `${tmpId}.pdf`);
    const contractFile = `${documentId}.pdf`;

    // Act
    const generatedDocumentId = await generateContract(importedArgs);

    // Assert
    expect(generateContractMarkdown).toHaveBeenCalledTimes(1);
    expect(generateContractMarkdown).toHaveBeenLastCalledWith(importedArgs);

    expect(mdToPdfFile).toHaveBeenCalledTimes(1);
    expect(mdToPdfFile).toHaveBeenLastCalledWith(
      markdown,
      tmpFile,
      expect.objectContaining({
        cssFiles: [path.join(assetDir, 'contract/style.css')],
      }),
    );

    expect(uploadDocumentMock).toHaveBeenCalledTimes(1);
    expect(uploadDocumentMock).toHaveBeenLastCalledWith(tmpFile, contractFile, {
      type: 'resident',
      residentId: resident.id,
    });

    expect(rm).toHaveBeenCalledTimes(1);
    expect(rm).toHaveBeenLastCalledWith(tmpFile);

    expect(generatedDocumentId).toBe(documentId);
  });
});
