import { generateSalutationString } from './generateSalutationString';
import { Salutation } from '_/models/name';
import ContractResidentBuilder from '_/test/builders/contractResident.builder';
import NameBuilder from '_/test/builders/name.builder';
import ResidentBuilder from '_/test/builders/resident.builder';

describe('generateSalutationString', () => {
  test.each([
    [
      'single male contract resident',
      [
        new ContractResidentBuilder()
          .withName(
            new NameBuilder()
              .withSalutation(Salutation.Male)
              .withLastName('Tester')
              .build(),
          )
          .build(),
      ],
      'Sehr geehrter Herr Tester',
    ],
    [
      'single female contract resident',
      [
        new ContractResidentBuilder()
          .withName(
            new NameBuilder()
              .withSalutation(Salutation.Female)
              .withLastName('Testerin')
              .build(),
          )
          .build(),
      ],
      'Sehr geehrte Frau Testerin',
    ],
    [
      'male and female contract residents',
      [
        new ContractResidentBuilder()
          .withName(
            new NameBuilder()
              .withSalutation(Salutation.Male)
              .withLastName('Tester')
              .build(),
          )
          .build(),
        new ContractResidentBuilder()
          .withName(
            new NameBuilder()
              .withSalutation(Salutation.Female)
              .withLastName('Testerin')
              .build(),
          )
          .build(),
      ],
      'Sehr geehrter Herr Tester, sehr geehrte Frau Testerin',
    ],
  ])(
    'should generate resident for %s correctly',
    (_, contractResidents, expected) => {
      // Arrange
      const builder = new ResidentBuilder();
      contractResidents.forEach((resident) => builder.addContractResident(resident));
      const resident = builder.build();

      // Act
      const salutation = generateSalutationString(resident);

      // Assert
      expect(salutation).toBe(expected);
    },
  );
});
