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

  public withZipCode(zipCode: number): AddressBuilder {
    this.address.zipCode = zipCode;
    return this;
  }

  public withCity(city: string): AddressBuilder {
    this.address.city = city;
    return this;
  }

  public withStreet(street: string): AddressBuilder {
    this.address.street = street;
    return this;
  }

  public withHouseNumber(houseNumber: number): AddressBuilder {
    this.address.houseNumber = houseNumber;
    return this;
  }

  public build(): Address {
    return this.address;
  }
}

export default AddressBuilder;
