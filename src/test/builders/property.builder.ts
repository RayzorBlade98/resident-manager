import Property from '_/models/property/property';

class PropertyBuilder {
  private property: Property;

  constructor() {
    this.property = {
      numberOfApartments: 8,
    };
  }

  public build(): Property {
    return this.property;
  }
}

export default PropertyBuilder;
