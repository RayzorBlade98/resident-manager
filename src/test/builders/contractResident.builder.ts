import NameBuilder from './name.builder';
import Name from '_/models/name';
import { ContractResident } from '_/models/resident/contractResident';

class ContractResidentBuilder {
  private resident: ContractResident;

  constructor() {
    this.resident = {
      name: new NameBuilder().build(),
    };
  }

  public withName(name: Name): ContractResidentBuilder {
    this.resident.name = name;
    return this;
  }

  public build(): ContractResident {
    return this.resident;
  }
}

export default ContractResidentBuilder;
