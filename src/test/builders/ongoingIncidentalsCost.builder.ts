import MonthYear from '_/extensions/date/month_year.extension';
import { OngoingIncidentalsCost } from '_/models/incidentals/ongoing_incidentals';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

export class OngoingIncidentalsCostBuilder {
  private cost: OngoingIncidentalsCost;

  public constructor() {
    this.cost = {
      dueDate: new MonthYear(8, 2024),
      cost: 10000,
      paymentDate: new Date(2024, 8, 8),
      bankTransferDocumentId: 'bank-transfer-document-id',
    };
  }

  public withDueDate(date: MonthYear): OngoingIncidentalsCostBuilder {
    this.cost.dueDate = date;
    return this;
  }

  public withCost(cost: CurrencyInCents): OngoingIncidentalsCostBuilder {
    this.cost.cost = cost;
    return this;
  }

  public build(): OngoingIncidentalsCost {
    return this.cost;
  }
}
