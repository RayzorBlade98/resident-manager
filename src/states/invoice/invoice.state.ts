import { atom } from 'recoil';
import { Invoice } from '_/types/invoice';

/**
 * The invoice state is a list of all invoices
 */
export type InvoiceState = Invoice[];

/**
 * Invoice state
 */
const invoiceState = atom<InvoiceState>({
  key: 'invoiceState',
  default: [],
});

export default invoiceState;
