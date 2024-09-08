import { v4 as uuid } from 'uuid';
import { DeductionType } from '_/models/incidentals/deduction_type';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import '_/extensions/date/date.extension';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

class OneTimeIncidentalsBuilder {
  private incidentals: OneTimeIncidentals;

  constructor() {
    this.incidentals = {
      id: uuid(),
      name: 'Test Incidentals',
      cost: 10000,
      deductionType: DeductionType.PerApartment,
      billingDate: new Date(2023, 5, 16).toUTC(),
    };
  }

  public withId(id: string): OneTimeIncidentalsBuilder {
    this.incidentals.id = id;
    return this;
  }

  public withName(name: string): OneTimeIncidentalsBuilder {
    this.incidentals.name = name;
    return this;
  }

  public withBillingDate(date: Date): OneTimeIncidentalsBuilder {
    this.incidentals.billingDate = date.toUTC();
    return this;
  }

  public withPaymentDate(date: Date): OneTimeIncidentalsBuilder {
    this.incidentals.paymentDate = date.toUTC();
    return this;
  }

  public withDeductionType(
    deductionType: DeductionType,
  ): OneTimeIncidentalsBuilder {
    this.incidentals.deductionType = deductionType;
    return this;
  }

  public withCosts(cost: CurrencyInCents): OneTimeIncidentalsBuilder {
    this.incidentals.cost = cost;
    return this;
  }

  public build(): OneTimeIncidentals {
    return this.incidentals;
  }
}

export default OneTimeIncidentalsBuilder;
