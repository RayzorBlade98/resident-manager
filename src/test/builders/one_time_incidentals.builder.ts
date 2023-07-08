import { v4 as uuid } from 'uuid';
import OneTimeIncidentals from '_/models/incidentals/one_time_incidentals';
import '_/extensions/date/date.extension';

class OneTimeIncidentalsBuilder {
  private incidentals: OneTimeIncidentals;

  constructor() {
    this.incidentals = {
      id: uuid(),
      name: 'Test Incidentals',
      cost: 10000,
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

  public build(): OneTimeIncidentals {
    return this.incidentals;
  }
}

export default OneTimeIncidentalsBuilder;
