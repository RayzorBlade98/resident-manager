import { applyHistoryToResident } from './applyHistoryToResident';
import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import NameBuilder from '_/test/builders/name.builder';
import ResidentBuilder from '_/test/builders/resident.builder';
import ResidentHistoryElementBuilder from '_/test/builders/residentHistoryElement.builder';

describe('applyHistoryToResident', () => {
  it('should apply history to resident correctly', () => {
    // Arrange
    const expectedContractResident = new ContractResidentBuilder()
      .withName(new NameBuilder().withFirstName('name 3').build())
      .build();
    const expectedNumberOfResidents = 6;
    const expectedKeys: Partial<Resident['keys']> = {
      apartment: 5,
      basement: 4,
      frontDoor: 2,
      mailbox: 1,
    };
    const expectedParkingSpace = 'expected parking space';

    const unappliedHistory = [
      new ResidentHistoryElementBuilder()
        .withInvalidSince(new MonthYear(0, 2024))
        .withKeys({
          apartment: 0,
          basement: 0,
          attic: 0,
          frontDoor: 0,
          mailbox: 0,
        })
        .withNumberOfResidents(0)
        .build(),
      new ResidentHistoryElementBuilder()
        .withInvalidSince(new MonthYear(11, 2023))
        .addContractResident(
          new ContractResidentBuilder()
            .withName(new NameBuilder().withFirstName('no name').build())
            .build(),
        )
        .withParkingSpace('oldest parking space')
        .build(),
    ];

    const resident = new ResidentBuilder()
      .addContractResident(
        new ContractResidentBuilder()
          .withName(new NameBuilder().withFirstName('name 1').build())
          .build(),
      )
      .addContractResident(
        new ContractResidentBuilder()
          .withName(new NameBuilder().withFirstName('name 2').build())
          .build(),
      )
      .withNumberOfResidents(3)
      .withKeys({
        apartment: 1,
        basement: 2,
        attic: 3,
        frontDoor: 4,
        mailbox: 5,
      })
      .withParkingSpace('newest parking space')
      .addHistoryElement(
        new ResidentHistoryElementBuilder()
          .withInvalidSince(new MonthYear(6, 2024))
          .addContractResident(expectedContractResident)
          .withKeys({
            apartment: 11,
            basement: 22,
            frontDoor: 44,
            mailbox: 55,
          })
          .withNumberOfResidents(11)
          .build(),
      )
      .addHistoryElement(
        new ResidentHistoryElementBuilder()
          .withInvalidSince(new MonthYear(5, 2024))
          .withKeys({
            apartment: 111,
            basement: 222,
            frontDoor: 444,
            mailbox: 555,
          })
          .withNumberOfResidents(expectedNumberOfResidents)
          .build(),
      )
      .addHistoryElement(
        new ResidentHistoryElementBuilder()
          .withInvalidSince(new MonthYear(4, 2024))
          .withKeys({
            apartment: expectedKeys.apartment,
            mailbox: expectedKeys.mailbox,
            basement: 2222,
            frontDoor: 4444,
          })
          .withParkingSpace('newer parking space')
          .build(),
      )
      .addHistoryElement(
        new ResidentHistoryElementBuilder()
          .withInvalidSince(new MonthYear(3, 2024))
          .withKeys({
            basement: 22222,
            frontDoor: 44444,
          })
          .build(),
      )
      .addHistoryElement(
        new ResidentHistoryElementBuilder()
          .withInvalidSince(new MonthYear(2, 2024))
          .withKeys({
            basement: expectedKeys.basement,
            frontDoor: expectedKeys.frontDoor,
          })
          .build(),
      )
      .addHistoryElement(
        new ResidentHistoryElementBuilder()
          .withInvalidSince(new MonthYear(1, 2024))
          .withParkingSpace(expectedParkingSpace)
          .build(),
      )
      .addHistoryElement(unappliedHistory[0])
      .addHistoryElement(unappliedHistory[1])
      .build();

    const expectedResident: Resident = {
      ...resident,
      contractResidents: [expectedContractResident],
      numberOfResidents: expectedNumberOfResidents,
      keys: {
        ...resident.keys,
        ...expectedKeys,
      },
      parkingSpaceId: expectedParkingSpace,
      history: unappliedHistory,
    };

    // Act
    const historicalResident = applyHistoryToResident(
      resident,
      new MonthYear(0, 2024),
    );

    // Assert
    expect(historicalResident).toEqual(expectedResident);
  });

  it('should handle parkingSpaceId null value correctly', () => {
    // Arrange
    const resident = new ResidentBuilder()
      .withParkingSpace('parking space')
      .addHistoryElement(
        new ResidentHistoryElementBuilder()
          .withInvalidSince(new MonthYear(6, 2024))
          .withParkingSpace(null)
          .build(),
      )
      .build();

    const expectedResident: Resident = {
      ...resident,
      parkingSpaceId: undefined,
      history: [],
    };

    // Act
    const historicalResident = applyHistoryToResident(
      resident,
      new MonthYear(5, 2024),
    );

    // Assert
    expect(historicalResident).toEqual(expectedResident);
  });
});
