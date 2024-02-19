import AddressBuilder from './address.builder';
import NameBuilder from './name.builder';
import Address from '_/models/address';
import Landlord from '_/models/landlord/landlord';
import Name from '_/models/name';

class LandlordBuilder {
  private landlord: Landlord;

  constructor() {
    this.landlord = {
      company: 'test company',
      representative: new NameBuilder().build(),
      address: new AddressBuilder().build(),
    };
  }

  public withRepresentative(name: Name): LandlordBuilder {
    this.landlord.representative = name;
    return this;
  }

  public withAddress(address: Address): LandlordBuilder {
    this.landlord.address = address;
    return this;
  }

  public build(): Landlord {
    return this.landlord;
  }
}

export default LandlordBuilder;
