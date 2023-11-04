import { Button } from '@mui/material';
import React from 'react';
import Invoice from '_/models/invoice/invoice';

interface GeneralInvoiceInformationProps {
  /**
   * Invoice for which the general information should be displayed
   */
  invoice: Invoice;
}

/**
 * Component that displays general information about an invoice
 */
function GeneralInvoiceInformation(
  props: GeneralInvoiceInformationProps,
): JSX.Element {
  const invoice = props.invoice;
  return (
    <>
      <p>{`${invoice.start.toString()} - ${invoice.end.toString()}`}</p>
      <Button
        onClick={() => {
          void window.ipcAPI.generateInvoicePdfs(invoice);
        }}
      >
        Pdf generieren
      </Button>
    </>
  );
}

export default GeneralInvoiceInformation;
