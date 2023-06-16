import { Box } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import MonthSelection from './MonthSelection/MonthSelection';
import invoiceGenerationViewState, {
  isCurrentStepFinished,
} from './states/invoice_generation_view_state';
import GenericStepper, {
  STEPPER_FINISHED,
} from '_/components/generic/GenericStepper/GenericStepper';
import OngoingIncidentalsSelection from '_/views/InvoiceGenerationView/OngoingIncidentalsSelection/OngoingIncidentalsSelection';

const styles = {
  view: {
    height: '100%',
  },
};

function InvoiceGenerationView() {
  const [viewState, setViewState] = useRecoilState(invoiceGenerationViewState);

  const onStepChange = (step: number) => {
    setViewState((state) => ({
      ...state,
      currentStep: step,
    }));
  };

  return (
    <Box sx={styles.view}>
      {viewState.currentStep !== STEPPER_FINISHED && (
        <GenericStepper
          steps={['Schritt 1', 'Schritt 2', 'Schritt 3']}
          onStepChange={onStepChange}
          canFinishStep={isCurrentStepFinished()}
        >
          <MonthSelection />
          <OngoingIncidentalsSelection />
          <div>Schritt 3</div>
        </GenericStepper>
      )}
      {viewState.currentStep === STEPPER_FINISHED && <p>Fertig</p>}
    </Box>
  );
}

export default InvoiceGenerationView;
