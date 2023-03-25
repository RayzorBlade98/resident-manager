import { selector } from 'recoil';
import saveState from './save_state';
import { Invoice } from '_/types/invoice';

/**
 * The invoice state is a list of all invoices
 */
export type InvoiceState = Invoice[];

/**
 * Selector for the invoice state
 */
export const residentState = selector<InvoiceState>({
  key: 'invoiceState',
  get: ({ get }) => {
    const state = get(saveState);
    return state.invoices;
  },
});
