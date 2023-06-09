import { setRecoil } from 'recoil-nexus';
import invoiceState from './invoice.state';
import { Invoice } from '_/types/invoice';

/**
 * Class that provides utility functions to manage the invoice state
 */

export default abstract class InvoiceStateManager {
  /**
   * Adds a new invoice to the invoice state
   * @param invoice new invoice that should be added
   */
  public static addInvoice(invoice: Invoice): void {
    setRecoil(invoiceState, (state) => [...state, invoice]);
  }
}
