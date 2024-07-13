import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import View from '../../../routes';
import { invoiceViewSelectedInvoiceSelector } from '../states/invoice_view_state';
import Invoice from '_/models/invoice/invoice';
import invoiceState from '_/states/invoice/invoice.state';

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
  const navigate = useNavigate();

  return (
    <Box sx={styles.box}>
      <List sx={styles.list}>
        <ListItemButton
          onClick={() => navigate(View.InvoiceGeneration)}
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
                primary={`${invoice.start.toString()} - ${invoice.end.toString()}`}
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
