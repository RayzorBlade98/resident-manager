import {
  ContractGenerationArgs,
  generateContractMarkdown,
} from './contractGeneration';
import MonthYear from '_/extensions/date/month_year.extension';
import AddressBuilder from '_/test/builders/address.builder';
import ApartmentBuilder from '_/test/builders/apartment.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import NameBuilder from '_/test/builders/name.builder';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import expectedContract from '_/test/data/contractGeneration/expectedContract.md';
import Imported from '_/types/Imported';

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
      .withBankAccount({
        holder: 'Landlord Holder',
        iban: 'DE12 3456 7890',
      })
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
      .withKeys({
        apartment: 11,
        basement: 12,
        attic: 13,
        frontDoor: 14,
        mailbox: 15,
      })
      .withContractStart(new MonthYear(2, 2024))
      .withRentDeposit(150000)
      .withNumberOfResidents(5)
      .build();

    const args: ContractGenerationArgs = {
      landlord,
      resident,
      property,
    };

    // Act
    const contract = generateContractMarkdown(
      JSON.parse(JSON.stringify(args)) as Imported<ContractGenerationArgs>,
    );

    // Assert
    expect(contract).toBe(expectedContract);
  });
});
