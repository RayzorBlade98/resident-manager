import { useRecoilState } from 'recoil';
import Invoice from '_/models/invoice/invoice';
import invoiceState from '_/states/invoice/invoice.state';

/**
 * Hook that returns the invoice state and utility functions to modify it
 */
function useInvoiceState() {
  const [invoices, setInvoices] = useRecoilState(invoiceState);

  function addInvoice(invoice: Invoice): void {
    setInvoices((state) => [...state, invoice]);
  }

  return {
    /**
     * All invoices
     */
    invoices,

    /**
     * Function to add a new invoice
     */
    addInvoice,
  };
}

export default useInvoiceState;
