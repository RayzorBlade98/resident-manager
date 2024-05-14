import AddressBuilder from './address.builder';
import NameBuilder from './name.builder';
import Address from '_/models/address';
import Name from '_/models/name';
import { ContractResident } from '_/models/resident/contractResident';

class ContractResidentBuilder {
  private resident: ContractResident;

  constructor() {
    this.resident = {
      name: new NameBuilder().build(),
      oldAddress: new AddressBuilder().build(),
      phone: '1234567890',
      email: undefined,
    };
  }

  public withName(name: Name): ContractResidentBuilder {
    this.resident.name = name;
    return this;
  }

  public withOldAdress(address: Address): ContractResidentBuilder {
    this.resident.oldAddress = address;
    return this;
  }

  public withPhone(phone: string): ContractResidentBuilder {
    this.resident.phone = phone;
    return this;
  }

  public build(): ContractResident {
    return this.resident;
  }
}

export default ContractResidentBuilder;
