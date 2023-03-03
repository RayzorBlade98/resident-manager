import { Year, Month } from '_/types/date';

import { CurrencyInCents } from '_/utils/currency';
import { RentInformation } from '_types/rent';

class RentInformationBuilder {
  private rentInformation: RentInformation;

  constructor() {
    this.rentInformation = {
      dueDate: {
        month: Month.March,
        year: 2023,
      },
      rent: 50000,
      incidentals: 10000,
      isPaid: false,
    };
  }

  public withMonth(month: Month): RentInformationBuilder {
    this.rentInformation.dueDate.month = month;
    return this;
  }

  public withYear(year: Year): RentInformationBuilder {
    this.rentInformation.dueDate.year = year;
    return this;
  }

  public withRent(rent: CurrencyInCents): RentInformationBuilder {
    this.rentInformation.rent = rent;
    return this;
  }

  public withIncidentals(incidentals: CurrencyInCents): RentInformationBuilder {
    this.rentInformation.incidentals = incidentals;
    return this;
  }

  public withIsPaid(isPaid: boolean): RentInformationBuilder {
    this.rentInformation.isPaid = isPaid;
    return this;
  }

  public build(): RentInformation {
    return this.rentInformation;
  }
}

export default RentInformationBuilder;
