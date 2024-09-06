import path from 'path';
import generateContract from './generateContract';
import {
  ContractGenerationArgs,
  generateContractMarkdown,
} from './generateContractMarkdown';
import MonthYear from '_/extensions/date/month_year.extension';
import * as getAppDataDirectoryModule from '_/ipc/utils/persistence/getAppDataDirectory';
import { uploadMarkdownAsPdf } from '_/ipc/utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import Imported from '_/types/Imported';

jest.mock('./generateContractMarkdown', () => ({
  generateContractMarkdown: jest.fn(),
}));

jest.mock(
  '../../../utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf',
  () => ({
    uploadMarkdownAsPdf: jest.fn(),
  }),
);

describe('generateContract', () => {
  test('should handle contract generation correctly', async () => {
    // Arrange
    const markdownContent = 'test markdown';
    (generateContractMarkdown as jest.Mock).mockReturnValueOnce(
      markdownContent,
    );

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

    const documentId = 'document id';
    (uploadMarkdownAsPdf as jest.Mock).mockResolvedValue(documentId);

    const assetDir = 'assets';
    jest
      .spyOn(getAppDataDirectoryModule, 'getAssetDirectory')
      .mockReturnValue(assetDir);

    // Act
    const generatedDocumentId = await generateContract(importedArgs);

    // Assert
    expect(generateContractMarkdown).toHaveBeenCalledTimes(1);
    expect(generateContractMarkdown).toHaveBeenLastCalledWith(importedArgs);

    expect(uploadMarkdownAsPdf).toHaveBeenCalledTimes(1);
    expect(uploadMarkdownAsPdf).toHaveBeenLastCalledWith({
      markdownContent,
      target: {
        type: 'resident',
        residentId: resident.id,
      },
      mdToPdfOptions: {
        cssFiles: [path.join(assetDir, 'templates/contract/style.css')],
      },
    });

    expect(generatedDocumentId).toBe(documentId);
  });
});
