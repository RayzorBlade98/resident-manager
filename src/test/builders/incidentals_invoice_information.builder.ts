import { v4 as uuid } from 'uuid';
import { DeductionType } from '_/models/incidentals/deduction_type';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';
import { IncidentalsInvoiceInformation } from '_/models/invoice/incidentals_invoice';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

class IncidentalsInvoiceInformationBuilder {
  private incidentals: IncidentalsInvoiceInformation;

  constructor() {
    this.incidentals = {
      incidentalsId: uuid(),
      name: 'Test Incidentals',
      totalCost: 10000,
      deductionType: DeductionType.PerApartment,
    };
  }

  public withId(id: string): IncidentalsInvoiceInformationBuilder {
    this.incidentals.incidentalsId = id;
    return this;
  }

  public withName(name: string): IncidentalsInvoiceInformationBuilder {
    this.incidentals.name = name;
    return this;
  }

  public withDeductionType(
    deductionType: DeductionType,
  ): IncidentalsInvoiceInformationBuilder {
    this.incidentals.deductionType = deductionType;
    return this;
  }

  public withTotalCost(
    cost: CurrencyInCents,
  ): IncidentalsInvoiceInformationBuilder {
    this.incidentals.totalCost = cost;
    return this;
  }

  public build(): IncidentalsInvoiceInformation {
    return this.incidentals;
  }

  public static fromIncidentals(
    incidentals: OngoingIncidentals | OneTimeIncidentals,
  ): IncidentalsInvoiceInformationBuilder {
    return new IncidentalsInvoiceInformationBuilder()
      .withId(incidentals.id)
      .withName(incidentals.name)
      .withDeductionType(incidentals.deductionType);
  }
}

export default IncidentalsInvoiceInformationBuilder;
