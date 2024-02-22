import AddressBuilder from './address.builder';
import Address from '_/models/address';
import Apartment from '_/models/property/apartment';
import Property from '_/models/property/property';

class PropertyBuilder {
  private property: Property;

  constructor() {
    this.property = {
      numberOfApartments: 8,
      address: new AddressBuilder().build(),
      apartments: [],
      parkingSpaces: [],
    };
  }

  public withNumberOfApartments(apartments: number): PropertyBuilder {
    this.property.numberOfApartments = apartments;
    return this;
  }

  public withAdress(address: Address): PropertyBuilder {
    this.property.address = address;
    return this;
  }

  public addApartment(apartments: Apartment): PropertyBuilder {
    this.property.apartments.push(apartments);
    return this;
  }

  public build(): Property {
    return this.property;
  }
}

export default PropertyBuilder;
