import { GenerateRentIncreasePdfArgs } from './GenerateRentIncreasePdfArgs';
import { generateRentIncreaseMarkdown } from './generateRentIncreaseMarkdown';
import MonthYear from '_/extensions/date/month_year.extension';
import AddressBuilder from '_/test/builders/address.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import expectedRentIncrease from '_/test/data/rentIncrease/expectedRentIncrease.md';
import Imported from '_/types/Imported';

jest.mock('../../../../assets/templates/rentIncrease/rentIncreaseTemplate.md');

describe('generateRentIncreaseMarkdown', () => {
  test('should return right markdown string', () => {
    // Arrange
    const currentDate = new Date(2024, 7, 18);
    jest.useFakeTimers();
    jest.setSystemTime(currentDate);

    const resident = new ResidentBuilder()
      .addRentInformation(
        new RentInformationBuilder()
          .withDueDate(new MonthYear(8, 2024))
          .withRent(10000)
          .withIncidentals(1000)
          .build(),
      )
      .build();
    const property = new PropertyBuilder()
      .withAdress(
        new AddressBuilder()
          .withStreet('Rentstreet')
          .withHouseNumber(5)
          .withZipCode(12345)
          .withCity('RentCity')
          .build(),
      )
      .withRentIndexUrl('example.org/rentIncrease')
      .withCappingLimit(15)
      .build();
    const newRent = 11500;
    const monthForIncrease = new MonthYear(9, 2024);
    const args: GenerateRentIncreasePdfArgs = {
      resident,
      newRent,
      monthForIncrease,
      property,
    };

    // Act
    const rentIncreaseMarkdown = generateRentIncreaseMarkdown(
      JSON.parse(JSON.stringify(args)) as Imported<GenerateRentIncreasePdfArgs>,
    );

    // Assert
    expect(rentIncreaseMarkdown).toBe(expectedRentIncrease);
  });
});
