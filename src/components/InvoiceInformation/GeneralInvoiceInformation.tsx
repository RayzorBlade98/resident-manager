import React from 'react';
import { Invoice } from '_/types/invoice';

interface GeneralInvoiceInformationProps {
  /**
   * Invoice for which the information should be displayed
   */
  invoice: Invoice;
}

/**
 * Component that displays general information about an invoice
 */
function GeneralInvoiceInformation(
  props: GeneralInvoiceInformationProps,
): JSX.Element {
  return (
    // eslint-disable-next-line max-len
    <p>{`${props.invoice.start.month} ${props.invoice.start.year} - ${props.invoice.end.month} ${props.invoice.end.year}`}</p>
  );
}

export default GeneralInvoiceInformation;
