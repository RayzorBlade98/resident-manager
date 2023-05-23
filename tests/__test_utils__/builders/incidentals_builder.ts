import { v4 as uuid } from 'uuid';
import { DeductionType, Incidentals } from '../../../src/types/incidentals';

class IncidentalsBuilder {
  private incidentals: Incidentals;

  constructor() {
    this.incidentals = {
      id: uuid(),
      name: 'Test Incidentals',
      currentPrice: 10000,
      deductionType: DeductionType.PerApartment,
      invoiceInterval: 12,
    };
  }

  public withId(id: string): IncidentalsBuilder {
    this.incidentals.id = id;
    return this;
  }

  public withName(name: string): IncidentalsBuilder {
    this.incidentals.name = name;
    return this;
  }

  public build(): Incidentals {
    return this.incidentals;
  }
}

export default IncidentalsBuilder;
