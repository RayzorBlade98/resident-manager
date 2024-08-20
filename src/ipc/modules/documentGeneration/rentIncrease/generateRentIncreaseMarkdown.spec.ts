import { GenerateRentIncreasePdfArgs } from './GenerateRentIncreasePdfArgs';
import { generateRentIncreaseMarkdown } from './generateRentIncreaseMarkdown';
import MonthYear from '_/extensions/date/month_year.extension';
import * as generateAddressHeaderMarkdownModule from '_/ipc/utils/documentGeneration/generateAddressHeaderMarkdown/generateAddressHeaderMarkdown';
import { AddressHeaderEntity } from '_/ipc/utils/documentGeneration/generateAddressHeaderMarkdown/generateAddressHeaderMarkdown';
import * as generateDateHeaderMarkdownModule from '_/ipc/utils/documentGeneration/generateDateHeaderMarkdown/generateDateHeaderMarkdown';
import * as generateSignatureFooterMarkdownModule from '_/ipc/utils/documentGeneration/generateSignatureFooterMarkdown/generateSignatureFooterMarkdown';
import AddressBuilder from '_/test/builders/address.builder';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import NameBuilder from '_/test/builders/name.builder';
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
      .addContractResident(new ContractResidentBuilder().build())
      .addContractResident(new ContractResidentBuilder().build())
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

    const landlord = new LandlordBuilder()
      .withAddress(
        new AddressBuilder()
          .withStreet('Lordstreet')
          .withHouseNumber(13)
          .withZipCode(54321)
          .withCity('Lordstreet')
          .build(),
      )
      .withRepresentative(
        new NameBuilder()
          .withFirstName('Lucas')
          .withLastName('Landlord')
          .build(),
      )
      .build();

    const newRent = 11500;
    const monthForIncrease = new MonthYear(9, 2024);
    const args: GenerateRentIncreasePdfArgs = {
      resident,
      newRent,
      monthForIncrease,
      property,
      landlord,
    };

    const expectedLandlordAddressHeader: AddressHeaderEntity = {
      names: [landlord.representative],
      address: landlord.address,
    };
    const expectedResidentAddressHeader: AddressHeaderEntity = {
      names: resident.contractResidents.map((r) => r.name),
      address: property.address,
    };

    const addressHeaderSpy = jest
      .spyOn(
        generateAddressHeaderMarkdownModule,
        'generateAddressHeaderMarkdown',
      )
      .mockReturnValueOnce('Notification Address Header')
      .mockReturnValueOnce('Confirmation Address Header');

    jest
      .spyOn(generateDateHeaderMarkdownModule, 'generateDateHeaderMarkdown')
      .mockReturnValue('Notification Date Header');

    jest
      .spyOn(
        generateSignatureFooterMarkdownModule,
        'generateSignatureFooterMarkdown',
      )
      .mockReturnValue('signatureFooter');

    // Act
    const rentIncreaseMarkdown = generateRentIncreaseMarkdown(
      JSON.parse(JSON.stringify(args)) as Imported<GenerateRentIncreasePdfArgs>,
    );

    // Assert
    expect(rentIncreaseMarkdown).toBe(expectedRentIncrease);

    expect(addressHeaderSpy).toHaveBeenNthCalledWith(
      1,
      expectedLandlordAddressHeader,
      expectedResidentAddressHeader,
    );
    expect(addressHeaderSpy).toHaveBeenNthCalledWith(
      2,
      expectedResidentAddressHeader,
      expectedLandlordAddressHeader,
    );
  });
});
