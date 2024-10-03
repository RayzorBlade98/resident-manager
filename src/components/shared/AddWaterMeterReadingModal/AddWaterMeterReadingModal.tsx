import { Grid } from '@mui/material';
import React from 'react';
import { ValidationConstraint } from '../../../utils/validation/constraints';
import Validator from '../../../utils/validation/validator';
import FileSelect from '_/components/form/FileSelect/FileSelect';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useResident from '_/hooks/useResident/useResident';
import { DocumentType } from '_/models/resident/document';

type AddWaterMeterReadingModalProps = {
  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Callback when the modal is closed
   */
  onCloseModal: () => void;

  /**
   * Id of the resident for which the water meter reading should be added
   */
  residentId: string;
};

/**
 * Input values of the `AddWaterMeterReadingModal`
 */
type WaterMeterReadingInput = {
  /**
   * Count of the water meter
   */
  waterMeterCount: number;

  /**
   * Date the water count was read
   */
  readingDate: Date;

  /**
   * Path to the water meter reading document
   */
  readingFile: string;
};

/**
 * Modal that provides functionality to insert a new water meter reading
 */
function AddWaterMeterReadingModal(
  props: AddWaterMeterReadingModalProps,
): JSX.Element {
  const { resident, addWaterMeterReading, addDocument } = useResident(
    props.residentId,
  );

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<WaterMeterReadingInput>({
    formValidator: new Validator<WaterMeterReadingInput>({
      waterMeterCount: ValidationConstraint.Defined,
      readingDate: ValidationConstraint.Defined,
      readingFile: ValidationConstraint.DefinedFile,
    }),
    defaultFormInput: {
      waterMeterCount: undefined,
      readingDate: new Date().toUTC(),
      readingFile: undefined,
    },
    onSubmitSuccess: (values) => {
      void window.ipcAPI.persistence
        .uploadDocument(values.readingFile, {
          type: 'resident',
          residentId: props.residentId,
        })
        .then((readingDocumentId) => {
          addDocument({
            name: `Ablesung Wasserzählerstand ${values.readingDate.toPreferredString()}`,
            type: DocumentType.WaterMeterReading,
            creationDate: values.readingDate,
            subjectDate: values.readingDate,
            id: readingDocumentId,
          });
          addWaterMeterReading({
            waterMeterCount: values.waterMeterCount,
            readingDate: values.readingDate,
            readingDocumentId,
            wasDeductedInInvoice: false,
          });
        });

      props.onCloseModal();
    },
    submitButtonLabel: 'Hinzufügen',
  });

  return (
    <GenericModal
      title="Neuer Wasserzählerstand"
      show={props.show}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <NumberTextField
            required
            id="waterMeterCount"
            label="Wasserzählerstand"
            value={formInput.waterMeterCount}
            onChange={formInputSetters.waterMeterCount}
            errorMessage={formErrors.waterMeterCount}
            onlyInteger
            min={(resident?.waterMeterReadings.at(0)?.waterMeterCount ?? 0) + 1}
          />
        </Grid>
        <Grid item xs={6}>
          <StandardDateField
            required
            id="readingDate"
            label="Ablesedatum"
            value={formInput.readingDate}
            onChange={formInputSetters.readingDate}
            errorMessage={formErrors.readingDate}
          />
        </Grid>
        <Grid item xs={12}>
          <FileSelect
            id="readingFile"
            label="Ablesung"
            value={formInput.readingFile}
            onChange={formInputSetters.readingFile}
            errorMessage={formErrors.readingFile}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default AddWaterMeterReadingModal;
