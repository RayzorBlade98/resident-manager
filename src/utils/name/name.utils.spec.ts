import { convertNameToString } from './name.utils';
import { Salutation } from '_/models/name';
import NameBuilder from '_/test/builders/name.builder';

describe('convertNameToString', () => {
  test.each([
    [{}, 'Max Mustermann'],
    [{ includeSalutation: true }, 'Herr Max Mustermann'],
    [{ excludeFirstName: true }, 'Mustermann'],
    [{ includeSalutation: true, excludeFirstName: true }, 'Herr Mustermann'],
  ])('should convert name with options %o correctly', (options, expected) => {
    // Arrange
    const name = new NameBuilder()
      .withFirstName('Max')
      .withLastName('Mustermann')
      .withSalutation(Salutation.Male)
      .build();

    // Act
    const converted = convertNameToString(name, options);

    // Assert
    expect(converted).toBe(expected);
  });
});
