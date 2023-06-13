import MonthYear from '_/extensions/date/month_year.extension';
import { RentInformation } from '_/models/resident/rent';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

class RentInformationBuilder {
  private rentInformation: RentInformation;

  constructor() {
    this.rentInformation = {
      dueDate: new MonthYear(2, 2023),
      rent: 50000,
      incidentals: 10000,
    };
  }

  public withDueDate(dueDate: MonthYear): RentInformationBuilder {
    this.rentInformation.dueDate = dueDate;
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

  public withPayment(
    paymentAmount: CurrencyInCents,
    paymentDate: Date,
  ): RentInformationBuilder {
    this.rentInformation.paymentAmount = paymentAmount;
    this.rentInformation.paymentDate = paymentDate;
    return this;
  }

  public build(): RentInformation {
    return this.rentInformation;
  }
}

export default RentInformationBuilder;
