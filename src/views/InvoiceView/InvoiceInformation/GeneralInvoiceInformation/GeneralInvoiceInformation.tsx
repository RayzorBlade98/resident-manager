import React from 'react';
import { useRecoilValue } from 'recoil';
import { invoiceViewSelectedInvoiceSelector } from '../../states/invoice_view_state';
import { Invoice } from '_/models/invoice/invoice';

/**
 * Component that displays general information about an invoice
 */
function GeneralInvoiceInformation(): JSX.Element {
  const selectedInvoice = useRecoilValue(
    invoiceViewSelectedInvoiceSelector,
  ) as Invoice;

  return (
    // eslint-disable-next-line max-len
    <p>{`${selectedInvoice.start.toString()} - ${selectedInvoice.end.toString()}`}</p>
  );
}

export default GeneralInvoiceInformation;
