import { Month, MonthYear, MonthYearUtils } from '_/types/date';
import { Invoice } from '_/types/invoice';

class InvoiceBuilder {
  private static nextStart: MonthYear = {
    month: Month.January,
    year: 2023,
  };

  private invoice: Invoice;

  constructor() {
    this.invoice = {
      start: InvoiceBuilder.nextStart,
      end: MonthYearUtils.addMonths(InvoiceBuilder.nextStart, 1),
      residentInformation: {},
    };
    InvoiceBuilder.nextStart = this.invoice.end;
  }

  public build(): Invoice {
    return this.invoice;
  }

  public static setStart(start: MonthYear): void {
    InvoiceBuilder.nextStart = start;
  }
}

export default InvoiceBuilder;
