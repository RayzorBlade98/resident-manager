import Address from '_/models/address';

class AddressBuilder {
  private address: Address;

  constructor() {
    this.address = {
      zipCode: 12345,
      city: 'Testcity',
      street: 'Teststreet',
      houseNumber: 42,
    };
  }

  public build(): Address {
    return this.address;
  }
}

export default AddressBuilder;
