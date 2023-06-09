import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { invoiceViewSelectedInvoiceSelector } from '../states/invoice_view_state';
import currentViewState, { View } from '_/states/current_view.state';
import invoiceState from '_/states/invoice/invoice.state';
import { Invoice } from '_/types/invoice';

const styles = {
  box: {
    height: '100%',
  },
  list: {
    height: '100%',
    overflowY: 'auto',
    padding: 0,
    borderRight: 1,
    borderColor: 'divider',
  },
  listItemButton: {
    height: '11.03%',
  },
};

/**
 * Component that displays a list of all invoices
 */
function InvoiceList(): JSX.Element {
  const invoices = useRecoilValue(invoiceState);
  const [selectedInvoice, setSelectedInvoice] = useRecoilState(
    invoiceViewSelectedInvoiceSelector,
  );
  const setCurrentView = useSetRecoilState(currentViewState);

  return (
    <Box sx={styles.box}>
      <List sx={styles.list}>
        <ListItemButton
          onClick={() => setCurrentView(View.InvoiceGeneration)}
          sx={styles.listItemButton}
        >
          <ListItemText primary="Neue Abrechnung" />
        </ListItemButton>
        <Divider />
        {invoices.map((invoice: Invoice, i) => (
          <>
            <ListItemButton
              selected={invoice.id === selectedInvoice?.id}
              onClick={() => setSelectedInvoice(invoice)}
              key={invoice.id}
              sx={styles.listItemButton}
            >
              <ListItemText
                primary={`${invoice.start.toString()} - ${invoice.end.toString()}`} // eslint-disable-line max-len
              />
            </ListItemButton>
            {i !== invoices.length - 1 && <Divider />}
          </>
        ))}
      </List>
    </Box>
  );
}

export default InvoiceList;
