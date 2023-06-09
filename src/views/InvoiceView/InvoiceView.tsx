import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { invoiceViewSelectedInvoiceSelector } from './states/invoice_view_state';
import invoiceState from '_/states/invoice/invoice.state';
import InvoiceInformation from '_/views/InvoiceView/InvoiceInformation/InvoiceInformation';
import InvoiceList from '_/views/InvoiceView/InvoiceList/InvoiceList';

const styles = {
  grid: {
    height: '100%',
  },
};

function InvoiceView(): JSX.Element {
  const invoices = useRecoilValue(invoiceState);
  const [selectedInvoice, setSelectedInvoice] = useRecoilState(
    invoiceViewSelectedInvoiceSelector,
  );

  useEffect(() => {
    // Select first resident on start
    if (invoices.length > 0) {
      setSelectedInvoice(invoices[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container sx={styles.grid}>
      <Grid item xs={2} sx={styles.grid}>
        <InvoiceList />
      </Grid>
      <Grid item xs={10} sx={styles.grid}>
        {selectedInvoice && <InvoiceInformation />}
      </Grid>
    </Grid>
  );
}

export default InvoiceView;
