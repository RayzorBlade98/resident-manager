import { v4 as uuid } from 'uuid';
import MonthYear from '_/extensions/date/month_year.extension';
import { Invoice } from '_/types/invoice';

class InvoiceBuilder {
  private static nextStart = new MonthYear(1, 2023);

  private invoice: Invoice;

  constructor() {
    this.invoice = {
      id: uuid(),
      start: InvoiceBuilder.nextStart,
      end: InvoiceBuilder.nextStart.clone(),
      residentInformation: {},
    };
    InvoiceBuilder.nextStart = this.invoice.end;
  }

  public withId(id: string): InvoiceBuilder {
    this.invoice.id = id;
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
