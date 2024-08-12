import { Grid } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { v4 as uuid } from 'uuid';
import { ValidationConstraint } from '../../../../../utils/validation/constraints';
import Validator from '../../../../../utils/validation/validator';
import FileSelect from '_/components/form/FileSelect/FileSelect';
import SelectField from '_/components/form/SelectField/SelectField';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import TextInputField from '_/components/form/TextInputField/TextInputField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useResident from '_/hooks/useResident/useResident';
import { DocumentType } from '_/models/resident/document';
import { Resident } from '_/models/resident/resident';
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';

interface UploadDocumentModalProps {
  /**
   * Whether to show the modal
   */
  show: boolean;

  /**
   * Callback when the modal is closed
   */
  onCloseModal: () => void;
}

/**
 * All values that can be submitted in the form
 */
export interface UploadDocumentInput {
  /**
   * Display name of the document
   */
  name: string;

  /**
   * Type of the document
   */
  type: DocumentType;

  /**
   * Path to the file
   */
  file: string;

  /**
   * Date the document is about
   */
  date: Date;
}

/**
 * Modal that contains an input form to uplaod a document
 */
function UploadDocumentModal(props: UploadDocumentModalProps): JSX.Element {
  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;

  const { addDocument } = useResident(selectedResident.id);

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<UploadDocumentInput>({
    formValidator: new Validator<UploadDocumentInput>({
      name: ValidationConstraint.Defined,
      file: ValidationConstraint.DefinedFile,
      date: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      name: undefined,
      file: undefined,
      type: DocumentType.Contract,
      date: undefined,
    },
    onSubmitSuccess: (values) => {
      const documentId = uuid();

      const fileEnding = values.file.split('.').pop();
      const documentFile = `${documentId}.${fileEnding}`;

      void window.ipcAPI.persistence.uploadDocument(values.file, documentFile, {
        type: 'resident',
        residentId: selectedResident.id,
      })
        .then(() => {
          addDocument({
            name: values.name,
            type: values.type,
            date: values.date,
            id: documentId,
          });
          props.onCloseModal();
        });
    },
    submitButtonLabel: 'Hinzufügen',
  });

  return (
    <GenericModal
      title="Dokument hinzufügen"
      show={props.show}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <TextInputField
            required
            id="name"
            label="Name"
            value={formInput.name}
            onChange={formInputSetters.name}
            errorMessage={formErrors.name}
          />
        </Grid>
        <Grid item xs={6}>
          <SelectField
            required
            id="type"
            label="Typ"
            value={formInput.type}
            onChange={formInputSetters.type}
            values={
              Object.fromEntries(
                Object.values(DocumentType).map((s) => [s, s]),
              ) as Record<DocumentType, DocumentType>
            }
          />
        </Grid>
        <Grid item xs={6}>
          <StandardDateField
            required
            id="date"
            label="Datum"
            value={formInput.date}
            onChange={formInputSetters.date}
            errorMessage={formErrors.date}
          />
        </Grid>
        <Grid item xs={12}>
          <FileSelect
            id="file"
            value={formInput.file}
            onChange={formInputSetters.file}
            errorMessage={formErrors.file}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default UploadDocumentModal;
