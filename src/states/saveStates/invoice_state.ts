import { atom } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { Invoice } from '_/types/invoice';

/**
 * The invoice state is a list of all invoices
 */
export type InvoiceState = Invoice[];

/**
 * Invoice state
 */
export const invoiceState = atom<InvoiceState>({
  key: 'invoiceState',
  default: [],
});

/**
 * Class that provides utility functions to manage the invoice state
 */
export abstract class InvoiceStateManager {
  /**
   * Adds a new invoice to the invoice state
   * @param invoice new invoice that should be added
   */
  public static addInvoice(invoice: Invoice): void {
    setRecoil(invoiceState, (state: InvoiceState) => [...state, invoice]);
  }
}
