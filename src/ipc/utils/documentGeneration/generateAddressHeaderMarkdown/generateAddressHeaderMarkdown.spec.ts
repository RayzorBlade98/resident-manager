import { AddressHeaderEntity, generateAddressHeaderMarkdown } from './generateAddressHeaderMarkdown';
import AddressBuilder from '_/test/builders/address.builder';
import NameBuilder from '_/test/builders/name.builder';
import expectedAddressHeader from '_/test/data/addressHeaderGeneration/expectedAddressHeader.md';

jest.mock('../../../../assets/templates/addressHeader/addressHeaderTemplate.md');

describe('generateAddressHeaderMarkdown', () => {
  test('should return right markdown string', () => {
    // Arrange
    const sender: AddressHeaderEntity = {
      names: [
        new NameBuilder()
          .withFirstName('Sandra')
          .withLastName('Sender')
          .build(),
        new NameBuilder()
          .withFirstName('Sandro')
          .withLastName('Sender')
          .build(),
      ],
      address: new AddressBuilder()
        .withStreet('Senderstreet')
        .withHouseNumber(1)
        .withZipCode(12345)
        .withCity('Sendercity')
        .build(),
    };

    const receiver: AddressHeaderEntity = {
      names: [
        new NameBuilder()
          .withFirstName('Raul')
          .withLastName('Receiver')
          .build(),
      ],
      address: new AddressBuilder()
        .withStreet('Receiverstreet')
        .withHouseNumber(2)
        .withZipCode(54321)
        .withCity('Receivercity')
        .build(),
    };

    // Act
    const addressHeader = generateAddressHeaderMarkdown(sender, receiver);

    // Assert
    expect(addressHeader).toBe(expectedAddressHeader);
  });
});
