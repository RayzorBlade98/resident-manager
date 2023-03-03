import { v4 as uuid } from 'uuid';
import { Month } from '_/types/date';
import { RentInformation } from '_/types/rent';
import { Resident } from '_/types/resident';

class ResidentBuilder {
  private resident: Resident;

  constructor() {
    this.resident = {
      id: uuid(),
      firstName: 'Max',
      lastName: 'Mustermann',
      rent: [],
      invoiceStart: {
        month: Month.March,
        year: 2023,
      },
    };
  }

  public withFirstName(firstName: string): ResidentBuilder {
    this.resident.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): ResidentBuilder {
    this.resident.lastName = lastName;
    return this;
  }

  public addRentInformation(rentInformation: RentInformation): ResidentBuilder {
    this.resident.rent.push(rentInformation);
    return this;
  }

  public build(): Resident {
    return this.resident;
  }
}

export default ResidentBuilder;
