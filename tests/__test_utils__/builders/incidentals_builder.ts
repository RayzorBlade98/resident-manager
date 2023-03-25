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

  public build(): Incidentals {
    return this.incidentals;
  }
}

export default IncidentalsBuilder;
