/* eslint-disable react/jsx-props-no-spreading */
import { StyleAttribute } from 'glamor';
import React from 'react';
import GenericList from '../GenericComponents/GenericList/GenericList';
// eslint-disable-next-line max-len
import GenericListElement from '../GenericComponents/GenericList/GenericListElement';
import { Invoice } from '_/types/invoice';

interface InvoiceListProps {
  /**
   * List of included invoices
   */
  invoices: Invoice[];

  /**
   * Currently selected invoice
   */
  selectedInvoice?: Invoice;

  /**
   * Callback when selecting an invoice
   */
  onSelectInvoice: (invoice: Invoice) => void;

  /**
   * Additional stlye of the list container
   */
  style?: StyleAttribute;
}

/**
 * Component that displays a list of provided invoices
 */
function InvoiceList(props: InvoiceListProps): JSX.Element {
  return (
    <GenericList style={props.style} className="invoiceList">
      {props.invoices.map((invoice: Invoice) => (
        <GenericListElement
          onClick={() => {
            props.onSelectInvoice(invoice);
          }}
          selected={invoice === props.selectedInvoice}
          key={`$invoice-${invoice.start.month}-${invoice.start.year}`}
        >
          {`${invoice.start.month} ${invoice.start.year}`}
        </GenericListElement>
      ))}
    </GenericList>
  );
}

export default InvoiceList;
