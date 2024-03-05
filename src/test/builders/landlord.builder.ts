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
      email: 'landlord@example.org',
      phone: '0152 111111',
      bankAccount: {
        holder: 'test holder',
        iban: 'DE 1111',
      },
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

  public withBankAccount(
    bankAccount: Partial<Landlord['bankAccount']>,
  ): LandlordBuilder {
    this.landlord.bankAccount = {
      ...this.landlord.bankAccount,
      ...bankAccount,
    };
    return this;
  }

  public withEmail(email: string): LandlordBuilder {
    this.landlord.email = email;
    return this;
  }

  public withPhone(phone: string): LandlordBuilder {
    this.landlord.phone = phone;
    return this;
  }

  public build(): Landlord {
    return this.landlord;
  }
}

export default LandlordBuilder;
