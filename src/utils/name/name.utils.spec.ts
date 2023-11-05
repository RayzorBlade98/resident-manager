import { convertNameToString } from './name.utils';
import { Salutation } from '_/models/name';
import NameBuilder from '_/test/builders/name.builder';

describe('convertNameToString', () => {
  test('should convert name correctly', () => {
    // Arrange
    const name = new NameBuilder()
      .withFirstName('Max')
      .withLastName('Mustermann')
      .build();

    // Act
    const converted = convertNameToString(name);

    // Assert
    expect(converted).toBe('Max Mustermann');
  });

  test('should convert name correctly (with salutation)', () => {
    // Arrange
    const name = new NameBuilder()
      .withFirstName('Max')
      .withLastName('Mustermann')
      .withSalutation(Salutation.Male)
      .build();

    // Act
    const converted = convertNameToString(name, true);

    // Assert
    expect(converted).toBe('Herr Max Mustermann');
  });
});
