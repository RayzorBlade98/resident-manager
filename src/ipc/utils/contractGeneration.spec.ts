import { generateContractMarkdown } from './contractGeneration';
import AddressBuilder from '_/test/builders/address.builder';
import ApartmentBuilder from '_/test/builders/apartment.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import NameBuilder from '_/test/builders/name.builder';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';
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

    const property = new PropertyBuilder()
      .withAdress(
        new AddressBuilder()
          .withStreet('Propertystreet')
          .withHouseNumber(13)
          .withZipCode(55555)
          .withCity('Propertycity')
          .build(),
      )
      .addApartment(
        new ApartmentBuilder()
          .withFloor('1 OG')
          .withLocation('right')
          .withRooms({
            generic: 5,
            kitchen: 4,
            bath: 3,
            hallway: 2,
            basement: 1,
          })
          .build(),
      )
      .addParkingSpace(new ParkingSpaceBuilder().build())
      .build();

    const resident = new ResidentBuilder()
      .withName(
        new NameBuilder()
          .withFirstName('Residentfirst')
          .withLastName('Residentlast')
          .build(),
      )
      .withApartment(property.apartments[0].id)
      .withParkingSpace(property.parkingSpaces[0].id)
      .build();

    // Act
    const contract = generateContractMarkdown({ landlord, resident, property });

    // Assert
    expect(contract).toBe(expectedContract);
  });
});
