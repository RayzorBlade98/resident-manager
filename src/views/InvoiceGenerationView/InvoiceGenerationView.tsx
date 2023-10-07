import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import View from '../../routes';
import { CONTENT_HEIGHT_WITHOUT_APPBAR } from '../../styles';
import GeneratedInvoiceOverview from './GeneratedInvoiceOverview/GeneratedInvoiceOverview';
import MonthSelection from './MonthSelection/MonthSelection';
import OneTimeIncidentalsSelection from './OneTimeIncidentalsSelection/OneTimeIncidentalsSelection';
import RentPaymentCheck from './RentPaymentCheck/RentPaymentCheck';
import WaterMeterReadingsCheck from './WaterMeterReadingsCheck/WaterMeterReadingsCheck';
import invoiceGenerationViewState, {
  InvoiceGenerationSteps,
  isCurrentStepFinishedSelector,
  residentsForInvoiceSelector,
} from './states/invoice_generation_view_state';
import GenericStepper, {
  STEPPER_FINISHED,
} from '_/components/generic/GenericStepper/GenericStepper';
import AppBar from '_/components/shared/AppBar/AppBar';
import MonthYear from '_/extensions/date/month_year.extension';
import propertyState from '_/states/property/property.state';
import waterCostsState from '_/states/waterCosts/waterCosts.state';
import generateInvoice from '_/utils/invoice_generation/invoice.generator';
import OngoingIncidentalsSelection from '_/views/InvoiceGenerationView/OngoingIncidentalsSelection/OngoingIncidentalsSelection';

const styles = {
  view: {
    height: CONTENT_HEIGHT_WITHOUT_APPBAR,
  },
};

function InvoiceGenerationView() {
  const [viewState, setViewState] = useRecoilState(invoiceGenerationViewState);
  const resetViewState = useResetRecoilState(invoiceGenerationViewState);
  const isCurrentStepFinished = useRecoilValue(isCurrentStepFinishedSelector);

  const residents = useRecoilValue(residentsForInvoiceSelector);
  const property = useRecoilValue(propertyState);
  const waterCosts = useRecoilValue(waterCostsState);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    resetViewState();
  }, []);

  const onStepChange = (step: number) => {
    // Generate invoice if stepper is finished
    if (step === STEPPER_FINISHED) {
      const invoice = generateInvoice({
        start: viewState.formValidation.formInput.invoiceStart as MonthYear,
        end: viewState.formValidation.formInput.invoiceEnd as MonthYear,
        residents,
        includedOngoingIncidentals: viewState.selectedOngoingIncidentals,
        includedOneTimeIncidentals: viewState.selectedOneTimeIncidentals,
        property,
        waterCosts,
      });
      setViewState((state) => ({
        ...state,
        generatedInvoice: invoice,
      }));
    }

    setViewState((state) => ({
      ...state,
      currentStep: step as InvoiceGenerationSteps,
    }));
  };

  return (
    <>
      <AppBar returnRoute={View.Invoice} />
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
        {viewState.currentStep === STEPPER_FINISHED && (
          <GeneratedInvoiceOverview />
        )}
      </Box>
    </>
  );
}

export default InvoiceGenerationView;
