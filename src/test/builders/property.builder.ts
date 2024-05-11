import AddressBuilder from './address.builder';
import Address from '_/models/address';
import Apartment from '_/models/property/apartment';
import ParkingSpace from '_/models/property/parkingSpace';
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

  public addApartment(apartment: Apartment): PropertyBuilder {
    this.property.apartments.push(apartment);
    return this;
  }

  public addParkingSpace(parkingSpace: ParkingSpace): PropertyBuilder {
    this.property.parkingSpaces.push(parkingSpace);
    return this;
  }

  public build(): Property {
    return this.property;
  }
}

export default PropertyBuilder;
