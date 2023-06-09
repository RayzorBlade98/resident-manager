import { atom, selector } from 'recoil';
import invoiceState from '_/states/invoice/invoice.state';
import { Invoice } from '_/types/invoice';

/**
 * Invoice view state
 */
export interface InvoiceViewState {
  /**
   * Id of the currently selected invoice
   */
  selectedInvoice?: string;
}

/**
 * Resident view recoil state
 */
const invoiceViewState = atom<InvoiceViewState>({
  key: 'invoiceViewState',
  default: {
    selectedInvoice: undefined,
  },
});

/**
 * Selector for the currently selcted invoice
 */
export const invoiceViewSelectedInvoiceSelector = selector<Invoice | undefined>(
  {
    key: 'invoiceViewState-selectedInvoice',
    get: ({ get }) => get(invoiceState).find(
      (i) => i.id === get(invoiceViewState).selectedInvoice,
    ),
    set: ({ set }, invoice) => set(invoiceViewState, (state) => ({
      ...state,
      selectedInvoice: (invoice as Invoice).id,
    })),
  },
);

export default invoiceViewState;
