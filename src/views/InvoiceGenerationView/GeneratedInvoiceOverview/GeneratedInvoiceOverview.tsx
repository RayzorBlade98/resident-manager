import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import View from '../../../routes';
import invoiceGenerationViewState from '../states/invoice_generation_view_state';
import InvoiceInformation from '_/components/shared/InvoiceInformation/InvoiceInformation';
import useInvoiceState from '_/hooks/useInvoiceState/useInvoiceState';
import Invoice from '_/models/invoice/invoice';

/**
 * Component that displays the newly generated invoice
 */
function GeneratedInvoiceOverview(): JSX.Element {
  const [viewState, setViewState] = useRecoilState(invoiceGenerationViewState);
  const navigate = useNavigate();
  const { addInvoice } = useInvoiceState();

  const onEdit = (): void => {
    setViewState((state) => ({
      ...state,
      generatedInvoice: undefined,
      currentStep: 0,
    }));
  };

  const onSave = (): void => {
    addInvoice(viewState.generatedInvoice as Invoice);
    navigate(View.Invoice);
  };

  return (
    <>
      <InvoiceInformation invoice={viewState.generatedInvoice as Invoice} />
      <Button variant="contained" onClick={onEdit}>
        Bearbeiten
      </Button>
      <Button variant="contained" onClick={onSave}>
        Abschließen
      </Button>
    </>
  );
}

export default GeneratedInvoiceOverview;
