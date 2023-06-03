import React from 'react';
import { useRecoilValue } from 'recoil';
import { invoiceViewSelectedInvoiceSelector } from '../../states/invoice_view_state';
import { Invoice } from '_/types/invoice';

/**
 * Component that displays general information about an invoice
 */
function GeneralInvoiceInformation(): JSX.Element {
  const selectedInvoice = useRecoilValue(
    invoiceViewSelectedInvoiceSelector,
  ) as Invoice;

  return (
    // eslint-disable-next-line max-len
    <p>{`${selectedInvoice.start.month} ${selectedInvoice.start.year} - ${selectedInvoice.end.month} ${selectedInvoice.end.year}`}</p>
  );
}

export default GeneralInvoiceInformation;
