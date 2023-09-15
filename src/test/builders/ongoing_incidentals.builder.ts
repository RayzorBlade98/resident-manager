/* eslint-disable max-len */

import { v4 as uuid } from 'uuid';
import { OngoingIncidentals } from '../../models/incidentals/ongoing_incidentals';
import MonthYear from '_/extensions/date/month_year.extension';
import { OngoingCost } from '_/models/OngoingCost';
import { DeductionType } from '_/models/incidentals/deduction_type';

class OngoingIncidentalsBuilder {
  private incidentals: OngoingIncidentals;

  constructor() {
    this.incidentals = {
      id: uuid(),
      name: 'Test Incidentals',
      costs: [
        {
          cost: 10000,
          date: new MonthYear(5, 2023),
        },
      ],
      deductionType: DeductionType.PerApartment,
      invoiceInterval: 12,
    };
  }

  public withId(id: string): OngoingIncidentalsBuilder {
    this.incidentals.id = id;
    return this;
  }

  public withName(name: string): OngoingIncidentalsBuilder {
    this.incidentals.name = name;
    return this;
  }

  public withDeductionType(
    deductionType: DeductionType,
  ): OngoingIncidentalsBuilder {
    this.incidentals.deductionType = deductionType;
    return this;
  }

  public withInvoiceInterval(
    invoiceInterval: number,
  ): OngoingIncidentalsBuilder {
    this.incidentals.invoiceInterval = invoiceInterval;
    return this;
  }

  public withCosts(costs: OngoingCost[]): OngoingIncidentalsBuilder {
    this.incidentals.costs = costs;
    return this;
  }

  public build(): OngoingIncidentals {
    return this.incidentals;
  }
}

export default OngoingIncidentalsBuilder;
