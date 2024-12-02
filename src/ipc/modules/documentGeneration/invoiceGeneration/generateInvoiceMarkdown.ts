import Invoice from '_/models/invoice/invoice';
import Imported from '_/types/Imported';
import { convertImportedInvoice } from '_/utils/persistence/converters';

export function generateInvoiceMarkdown(
  invoice: Imported<Invoice>,
  residentId: string,
): string {
  return 'test';
}

class InvoiceGenerator {
  private invoiceMarkdown = '';

  private readonly invoice: Invoice;

  private readonly residentId: string;

  constructor(invoice: Imported<Invoice>, residentId: string) {
    this.invoice = convertImportedInvoice(invoice);
    this.residentId = residentId;
  }
}
