/* eslint-disable max-len */

import { v4 as uuid } from 'uuid';
import { DeductionType } from '_/models/incidentals/deduction_type';
import { OngoingIncidentalsInvoiceInformation } from '_/models/invoice/invoice';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

class OngoingIncidentalsInvoiceInformationBuilder {
  private incidentals: OngoingIncidentalsInvoiceInformation;

  constructor() {
    this.incidentals = {
      incidentalsId: uuid(),
      name: 'Test Incidentals',
      totalCost: 10000,
      deductionType: DeductionType.PerApartment,
    };
  }

  public withId(id: string): OngoingIncidentalsInvoiceInformationBuilder {
    this.incidentals.incidentalsId = id;
    return this;
  }

  public withName(name: string): OngoingIncidentalsInvoiceInformationBuilder {
    this.incidentals.name = name;
    return this;
  }

  public withDeductionType(
    deductionType: DeductionType,
  ): OngoingIncidentalsInvoiceInformationBuilder {
    this.incidentals.deductionType = deductionType;
    return this;
  }

  public withTotalCost(
    cost: CurrencyInCents,
  ): OngoingIncidentalsInvoiceInformationBuilder {
    this.incidentals.totalCost = cost;
    return this;
  }

  public build(): OngoingIncidentalsInvoiceInformation {
    return this.incidentals;
  }
}

export default OngoingIncidentalsInvoiceInformationBuilder;
