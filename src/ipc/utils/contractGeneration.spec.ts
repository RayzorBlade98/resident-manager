import { generateContractMarkdown } from './contractGeneration';
import AddressBuilder from '_/test/builders/address.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import NameBuilder from '_/test/builders/name.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import expectedContract from '_/test/data/contractGeneration/expectedContract.md';

jest.mock('../../assets/contract/contractTemplate.md');
jest.mock('../../assets/contract/landlordCompanyTemplate.md');

describe('generateContractMarkdown', () => {
  test('should return right markdown string', () => {
    // Arrange
    const landlord = new LandlordBuilder()
      .withRepresentative(
        new NameBuilder()
          .withFirstName('Landlordfirst')
          .withLastName('Landlordlast')
          .build(),
      )
      .withAddress(
        new AddressBuilder()
          .withStreet('Landlordstreet')
          .withHouseNumber(42)
          .withZipCode(88888)
          .withCity('Landlordcity')
          .build(),
      )
      .build();
    const resident = new ResidentBuilder()
      .withName(
        new NameBuilder()
          .withFirstName('Residentfirst')
          .withLastName('Residentlast')
          .build(),
      )
      .build();
    const property = new PropertyBuilder()
      .withAdress(
        new AddressBuilder()
          .withStreet('Propertystreet')
          .withHouseNumber(13)
          .withZipCode(55555)
          .withCity('Propertycity')
          .build(),
      )
      .build();

    // Act
    const contract = generateContractMarkdown({ landlord, resident, property });

    // Assert
    expect(contract).toBe(expectedContract);
  });
});
