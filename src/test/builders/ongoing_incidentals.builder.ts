import { v4 as uuid } from 'uuid';
import {
  OngoingIncidentals,
  OngoingIncidentalsCost,
} from '../../models/incidentals/ongoing_incidentals';
import { OngoingIncidentalsCostBuilder } from './ongoingIncidentalsCost.builder';
import { DeductionType } from '_/models/incidentals/deduction_type';

class OngoingIncidentalsBuilder {
  private incidentals: OngoingIncidentals;

  constructor() {
    this.incidentals = {
      id: uuid(),
      name: 'Test Incidentals',
      costs: [new OngoingIncidentalsCostBuilder().build()],
      deductionType: DeductionType.PerApartment,
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

  public withCosts(costs: OngoingIncidentalsCost[]): OngoingIncidentalsBuilder {
    this.incidentals.costs = costs;
    return this;
  }

  public build(): OngoingIncidentals {
    return this.incidentals;
  }
}

export default OngoingIncidentalsBuilder;
