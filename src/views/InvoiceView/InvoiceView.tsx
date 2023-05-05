import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styles from './styles';
import InvoiceList from '_/components/InvoiceList/InvoiceList';
import { invoiceState } from '_/states/saveStates/invoice_state';
import { Invoice } from '_/types/invoice';

function InvoiceView(): JSX.Element {
  const invoices = useRecoilValue(invoiceState);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[0]);

  return (
    <div {...styles.invoiceView}>
      <InvoiceList
        invoices={invoices}
        selectedInvoice={selectedInvoice}
        onSelectInvoice={(invoice: Invoice) => {
          setSelectedInvoice(invoice);
        }}
        style={styles.invoiceListContainer}
      />
    </div>
  );
}

export default InvoiceView;
