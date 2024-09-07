import { Grid } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { ValidationConstraint } from '../../../../../utils/validation/constraints';
import Validator from '../../../../../utils/validation/validator';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useResident from '_/hooks/useResident/useResident';
import { DocumentType } from '_/models/document';
import { Resident } from '_/models/resident/resident';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';
import { applyHistoryToResident } from '_/utils/resident/applyHistoryToResident/applyHistoryToResident';
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';

/**
 * All values that can be submitted in the form
 */
interface GenerateContractInput {
  /**
   * First month for which the contract should be applied
   */
  contractStart: MonthYear;
}

interface GenerateContractModalProps {
  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
}

/**
 * Modal that contains an input form to generate a new contract.
 */
function GenerateContractModal(props: GenerateContractModalProps) {
  const landlord = useRecoilValue(landlordState);
  const property = useRecoilValue(propertyState);
  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;
  const { addDocument, extendRentInformation } = useResident(
    selectedResident.id,
  );

  const {
    formInput,
    formInputSetters,
    formErrors,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<GenerateContractInput>({
    formValidator: new Validator({
      contractStart: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      contractStart: undefined,
    },
    submitButtonLabel: 'Generieren',
    onSubmitSuccess: (values) => {
      const residentForContract = extendRentInformation(values.contractStart);
      void window.ipcAPI.documentGeneration
        .generateContractPdf({
          contractStart: values.contractStart,
          landlord,
          property,
          resident: applyHistoryToResident(
            residentForContract,
            values.contractStart,
          ),
        })
        .then((documentId) => {
          addDocument({
            id: documentId,
            type: DocumentType.Contract,
            creationDate: new Date(),
            subjectDate: values.contractStart,
            name: `Mietvertrag ${values.contractStart.toString()}`,
          });
          props.onClose();
        });
    },
  });

  return (
    <GenericModal
      title="Vertrag Generierung"
      show={props.show}
      onClose={() => {
        props.onClose();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <MonthYearDateField
            required
            id="contractStart"
            label="Vertragsbeginn"
            value={formInput.contractStart}
            onChange={formInputSetters.contractStart}
            errorMessage={formErrors.contractStart}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default GenerateContractModal;
