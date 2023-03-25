import { Month } from '_/types/date';
import { Invoice } from '_/types/invoice';

class InvoiceBuilder {
  private invoice: Invoice;

  constructor() {
    this.invoice = {
      start: {
        month: Month.January,
        year: 2023,
      },
      end: {
        month: Month.Febuary,
        year: 2023,
      },
      residentInformation: {},
    };
  }

  public build(): Invoice {
    return this.invoice;
  }
}

export default InvoiceBuilder;
