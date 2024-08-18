import path from 'path';
import { GenerateRentIncreasePdfArgs } from './GenerateRentIncreasePdfArgs';
import { generateRentIncreaseMarkdown } from './generateRentIncreaseMarkdown';
import { generateRentIncreasePdf } from './generateRentIncreasePdf';
import MonthYear from '_/extensions/date/month_year.extension';
import * as getAppDataDirectoryModule from '_/ipc/utils/persistence/getAppDataDirectory';
import { uploadMarkdownAsPdf } from '_/ipc/utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf';
import LandlordBuilder from '_/test/builders/landlord.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import Imported from '_/types/Imported';

jest.mock('./generateRentIncreaseMarkdown', () => ({
  generateRentIncreaseMarkdown: jest.fn(),
}));

jest.mock(
  '../../../utils/persistence/uploadMarkdownAsPdf/uploadMarkdownAsPdf',
  () => ({
    uploadMarkdownAsPdf: jest.fn(),
  }),
);

describe('generateRentIncreasePdf', () => {
  test('should handle rent increase generation correctly', async () => {
    // Arrange
    const markdownContent = 'test markdown';
    (generateRentIncreaseMarkdown as jest.Mock).mockReturnValueOnce(
      markdownContent,
    );

    const resident = new ResidentBuilder().build();
    const property = new PropertyBuilder().build();
    const newRent = 100;
    const monthForIncrease = new MonthYear(9, 2024);
    const landlord = new LandlordBuilder().build();
    const args: GenerateRentIncreasePdfArgs = {
      resident,
      newRent,
      monthForIncrease,
      property,
      landlord,
    };
    const importedArgs = JSON.parse(
      JSON.stringify(args),
    ) as Imported<GenerateRentIncreasePdfArgs>;

    const documentId = 'document id';
    (uploadMarkdownAsPdf as jest.Mock).mockResolvedValue(documentId);

    const assetDir = 'assets';
    jest
      .spyOn(getAppDataDirectoryModule, 'getAssetDirectory')
      .mockReturnValue(assetDir);

    // Act
    const generatedDocumentId = await generateRentIncreasePdf(importedArgs);

    // Assert
    expect(generateRentIncreaseMarkdown).toHaveBeenCalledTimes(1);
    expect(generateRentIncreaseMarkdown).toHaveBeenLastCalledWith(importedArgs);

    expect(uploadMarkdownAsPdf).toHaveBeenCalledTimes(1);
    expect(uploadMarkdownAsPdf).toHaveBeenLastCalledWith({
      markdownContent,
      target: {
        type: 'resident',
        residentId: resident.id,
      },
      mdToPdfOptions: {
        cssFiles: [path.join(assetDir, 'templates/rentIncrease/style.css')],
      },
    });

    expect(generatedDocumentId).toBe(documentId);
  });
});
