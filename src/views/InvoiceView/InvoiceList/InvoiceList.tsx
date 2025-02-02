import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { invoiceViewSelectedInvoiceSelector } from '../states/invoice_view_state';
import CreateInvoiceModal from './CreateInvoiceModal/CreateInvoiceModal';
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
  const [showModal, setShowModal] = useState(false);

  const invoices = useRecoilValue(invoiceState);
  const [selectedInvoice, setSelectedInvoice] = useRecoilState(
    invoiceViewSelectedInvoiceSelector,
  );

  return (
    <>
      <CreateInvoiceModal showModal={showModal} onCloseModal={() => setShowModal(false)} />
      <Box sx={styles.box}>
        <List sx={styles.list}>
          <ListItemButton
            onClick={() => setShowModal(true)}
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
    </>
  );
}

export default InvoiceList;
