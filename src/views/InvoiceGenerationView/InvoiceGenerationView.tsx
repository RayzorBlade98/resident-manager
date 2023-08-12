import { Box } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import MonthSelection from './MonthSelection/MonthSelection';
import OneTimeIncidentalsSelection from './OneTimeIncidentalsSelection/OneTimeIncidentalsSelection';
import RentPaymentCheck from './RentPaymentCheck/RentPaymentCheck';
import WaterMeterReadingsCheck from './WaterMeterReadingsCheck/WaterMeterReadingsCheck';
import invoiceGenerationViewState, {
  InvoiceGenerationSteps,
  isCurrentStepFinishedSelector,
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
  const isCurrentStepFinished = useRecoilValue(isCurrentStepFinishedSelector);

  const onStepChange = (step: number) => {
    setViewState((state) => ({
      ...state,
      currentStep: step as InvoiceGenerationSteps,
    }));
  };

  return (
    <Box sx={styles.view}>
      {viewState.currentStep !== STEPPER_FINISHED && (
        <GenericStepper
          steps={[
            'Abrechnungszeitraum',
            'Laufende Nebenkosten',
            'Einmalige Nebenkosten',
            'Wasserzählerstände',
            'Mietzahlungen',
          ]}
          onStepChange={onStepChange}
          canFinishStep={isCurrentStepFinished}
        >
          <MonthSelection />
          <OngoingIncidentalsSelection />
          <OneTimeIncidentalsSelection />
          <WaterMeterReadingsCheck />
          <RentPaymentCheck />
        </GenericStepper>
      )}
      {viewState.currentStep === STEPPER_FINISHED && <p>Fertig</p>}
    </Box>
  );
}

export default InvoiceGenerationView;
