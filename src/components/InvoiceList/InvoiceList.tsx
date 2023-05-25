/* eslint-disable react/jsx-props-no-spreading */
import { StyleAttribute } from 'glamor';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import GenericList from '../GenericComponents/GenericList/GenericList';
import GenericListElement from '../GenericComponents/GenericList/GenericListElement';
import styles from './styles';
import currentViewState, { View } from '_/states/viewStates/current_view_state';
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
  const setCurrentView = useSetRecoilState(currentViewState);
  return (
    <GenericList style={props.style} className="invoiceList">
      <GenericListElement
        onClick={() => {
          setCurrentView(View.InvoiceGeneration);
        }}
        style={styles.newInvoiceElement}
      >
        Neue Abrechnung
      </GenericListElement>
      {props.invoices.map((invoice: Invoice) => (
        <GenericListElement
          onClick={() => {
            props.onSelectInvoice(invoice);
          }}
          selected={invoice === props.selectedInvoice}
          key={`$invoice-${invoice.start.month}-${invoice.start.year}`}
        >
          {`${invoice.start.month} ${invoice.start.year} - `}
          {`${invoice.end.month} ${invoice.end.year}`}
        </GenericListElement>
      ))}
    </GenericList>
  );
}

export default InvoiceList;
