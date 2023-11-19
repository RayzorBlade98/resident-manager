import AddressBuilder from './address.builder';
import NameBuilder from './name.builder';
import Landlord from '_/models/landlord/landlord';

class LandlordBuilder {
  private landlord: Landlord;

  constructor() {
    this.landlord = {
      company: 'test company',
      representative: new NameBuilder().build(),
      address: new AddressBuilder().build(),
    };
  }

  public build(): Landlord {
    return this.landlord;
  }
}

export default LandlordBuilder;
