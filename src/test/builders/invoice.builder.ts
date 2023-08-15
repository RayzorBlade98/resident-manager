import { v4 as uuid } from 'uuid';
import MonthYear from '_/extensions/date/month_year.extension';
import Invoice from '_/models/invoice/invoice';

class InvoiceBuilder {
  private static nextStart = new MonthYear(1, 2023);

  private invoice: Invoice;

  constructor() {
    this.invoice = {
      id: uuid(),
      start: InvoiceBuilder.nextStart,
      end: InvoiceBuilder.nextStart.clone(),
      residentInformation: {},
      ongoingIncidentalsInformation: {},
    };
    InvoiceBuilder.nextStart = this.invoice.end;
  }

  public withId(id: string): InvoiceBuilder {
    this.invoice.id = id;
    return this;
  }

  public withStartAndEnd(start: MonthYear, end: MonthYear): InvoiceBuilder {
    this.invoice.start = start;
    this.invoice.end = end;
    return this;
  }

  public build(): Invoice {
    InvoiceBuilder.nextStart.addMonths(1);
    return this.invoice;
  }

  public static setStart(start: MonthYear): void {
    InvoiceBuilder.nextStart = start;
  }
}

export default InvoiceBuilder;
