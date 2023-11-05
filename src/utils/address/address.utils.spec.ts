import {
  convertAddressToCityString,
  convertAddressToStreetString,
} from './address.utils';
import AddressBuilder from '_/test/builders/address.builder';

describe('convertAddressToCityString', () => {
  test('should convert address correctly', () => {
    // Arrange
    const address = new AddressBuilder()
      .withZipCode(54321)
      .withCity('Testcity')
      .build();

    // Act
    const converted = convertAddressToCityString(address);

    // Assert
    expect(converted).toBe('54321 Testcity');
  });
});

describe('convertAddressToStreetString', () => {
  test('should convert address correctly', () => {
    // Arrange
    const address = new AddressBuilder()
      .withStreet('Teststreet')
      .withHouseNumber(42)
      .build();

    // Act
    const converted = convertAddressToStreetString(address);

    // Assert
    expect(converted).toBe('Teststreet 42');
  });
});
