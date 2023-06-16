import { v4 as uuid } from 'uuid';
import {
  DeductionType,
  OngoingIncidentals,
} from '../../models/incidentals/ongoing_incidentals';

class OngoingIncidentalsBuilder {
  private incidentals: OngoingIncidentals;

  constructor() {
    this.incidentals = {
      id: uuid(),
      name: 'Test Incidentals',
      currentPrice: 10000,
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

  public withInvoiceInterval(
    invoiceInterval: number,
  ): OngoingIncidentalsBuilder {
    this.incidentals.invoiceInterval = invoiceInterval;
    return this;
  }

  public build(): OngoingIncidentals {
    return this.incidentals;
  }
}

export default OngoingIncidentalsBuilder;
