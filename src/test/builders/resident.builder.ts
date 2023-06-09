import { v4 as uuid } from 'uuid';
import MonthYear from '_/extensions/date/month_year.extension';
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
      invoiceStart: new MonthYear(2, 2023),
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
