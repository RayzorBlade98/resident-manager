import {
  ContractGenerationArgs,
  generateContractMarkdown,
} from './contractGeneration';
import MonthYear from '_/extensions/date/month_year.extension';
import AddressBuilder from '_/test/builders/address.builder';
import ApartmentBuilder from '_/test/builders/apartment.builder';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import LandlordBuilder from '_/test/builders/landlord.builder';
import NameBuilder from '_/test/builders/name.builder';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';
import PropertyBuilder from '_/test/builders/property.builder';
import RentInformationBuilder from '_/test/builders/rent_information.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import expectedContract from '_/test/data/contractGeneration/expectedContract.md';
import Imported from '_/types/Imported';

jest.mock('../../assets/contract/contractTemplate.md');
jest.mock('../../assets/contract/landlordCompanyTemplate.md');
jest.mock('../../assets/contract/residentTemplate.md');

describe('generateContractMarkdown', () => {
  test('should return right markdown string', () => {
    // Arrange
    const contractStart = new MonthYear(2, 2024);
    const parkingSpace = new ParkingSpaceBuilder()
      .addCosts({ cost: 0, date: contractStart.addMonths(2) })
      .addCosts({ cost: 0, date: contractStart.addMonths(1) })
      .addCosts({ cost: 2500, date: contractStart })
      .addCosts({ cost: 0, date: contractStart.addMonths(-1) })
      .addCosts({ cost: 0, date: contractStart.addMonths(-2) })
      .build();

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
      .withEmail('landlord@example.org')
      .withPhone('0152 12345678')
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
            garden: 0,
          })
          .build(),
      )
      .addParkingSpace(parkingSpace)
      .build();

    const resident = new ResidentBuilder()
      .addContractResident(
        new ContractResidentBuilder()
          .withName(
            new NameBuilder()
              .withFirstName('Residentfirst')
              .withLastName('Residentlast')
              .build(),
          )
          .withOldAdress(
            new AddressBuilder()
              .withZipCode(11111)
              .withCity('Residentcity')
              .withStreet('Residentstreet')
              .withHouseNumber(1)
              .build(),
          )
          .withPhone('0151 12345')
          .withEmail('email@example.com')
          .build(),
      )
      .addContractResident(
        new ContractResidentBuilder()
          .withName(
            new NameBuilder()
              .withFirstName('Resident2first')
              .withLastName('Resident2last')
              .build(),
          )
          .withOldAdress(
            new AddressBuilder()
              .withZipCode(22222)
              .withCity('Resident2city')
              .withStreet('Resident2street')
              .withHouseNumber(2)
              .build(),
          )
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
      .withContractStart(contractStart.addMonths(-1))
      .withRentDeposit(150000)
      .withNumberOfResidents(5)
      .addRentInformation(
        new RentInformationBuilder()
          .withDueDate(contractStart.addMonths(-1))
          .withRent(0)
          .withIncidentals(0)
          .build(),
      )
      .addRentInformation(
        new RentInformationBuilder()
          .withDueDate(contractStart)
          .withRent(50000)
          .withIncidentals(10000)
          .build(),
      )
      .addRentInformation(
        new RentInformationBuilder()
          .withDueDate(contractStart.addMonths(1))
          .withRent(0)
          .withIncidentals(0)
          .build(),
      )
      .build();

    const args: ContractGenerationArgs = {
      contractStart,
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
