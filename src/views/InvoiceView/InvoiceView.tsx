import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import View from '../../routes';
import { CONTENT_HEIGHT_WITHOUT_APPBAR } from '../../styles';
import { invoiceViewSelectedInvoiceSelector } from './states/invoice_view_state';
import AppBar from '_/components/shared/AppBar/AppBar';
import InvoiceInformation from '_/components/shared/InvoiceInformation/InvoiceInformation';
import invoiceState from '_/states/invoice/invoice.state';
import InvoiceList from '_/views/InvoiceView/InvoiceList/InvoiceList';

const styles = {
  grid: {
    height: CONTENT_HEIGHT_WITHOUT_APPBAR,
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
    <>
      <AppBar returnRoute={View.Main} />
      <Grid container sx={styles.grid}>
        <Grid item xs={2} sx={styles.grid}>
          <InvoiceList />
        </Grid>
        <Grid item xs={10} sx={styles.grid}>
          {selectedInvoice && <InvoiceInformation invoice={selectedInvoice} />}
        </Grid>
      </Grid>
    </>
  );
}

export default InvoiceView;
