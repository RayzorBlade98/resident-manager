import { atom } from 'recoil';
import { sortInvoicesEffect } from './invoice.state.effects';
import { Invoice } from '_/models/invoice/invoice';

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
  effects: [sortInvoicesEffect],
});

export default invoiceState;
