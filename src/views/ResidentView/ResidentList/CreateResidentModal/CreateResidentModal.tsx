import {
  Button, Grid, InputAdornment, TextField,
} from '@mui/material';
import React, { useState } from 'react';
// eslint-disable-next-line max-len
import GenericModal from '../../../../components/GenericComponents/GenericModal/GenericModal';
// eslint-disable-next-line max-len
import MonthYearInput from '../../../../components/GenericComponents/MonthYearInput/MonthYearInput';
import { ResidentStateManager } from '_/states/saveStates/resident_state';
import { MonthYear, MonthYearUtils } from '_/types/date';
import {
  createResident,
  CreateResidentArguments,
  CreateResidentErrors,
  validateResidentArgs,
} from '_/types/resident';
import { convertCurrencyEurosToCents } from '_/utils/currency';

export interface CreateResidentModalProps {
  /**
   * Defines if the modal is currenly visible or not.
   */
  show: boolean;

  /**
   * Gets called whenever the modal is closed.
   */
  onClose: () => void;
}

/**
 * Modal that contains an input form to create a new resident.
 */
function CreateResidentModal(props: CreateResidentModalProps): JSX.Element {
  // Information of the currently created resident
  const [resident, setResident] = useState<CreateResidentArguments>({
    firstName: '',
    lastName: '',
    rent: null,
    incidentals: null,
    contractStart: MonthYearUtils.getCurrentMonthYear(),
  });
  // Error messages of the input fields
  const [errors, setErrors] = useState<CreateResidentErrors>({});

  /**
   * Creates a function that handles the input of the specified field.
   * It updates the value of the field and applies the validation on it.
   * @param field field of the resident that should be updated
   * @returns function that handles the input of the specified field.
   */
  function residentUpdater(field: string):
  | ((event: React.ChangeEvent<HTMLInputElement>) => void)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((value: any) => void) {
    /**
     * Updates the value of the specified field of the resident
     * @param value value that should be applied
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function updateResident(value: any): void {
      const newResident = {
        ...resident,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [field]: value,
      };
      setResident(newResident);
      setErrors({
        ...errors,
        [field]: validateResidentArgs(
          newResident,
          field as keyof CreateResidentErrors,
        ),
      });
    }

    /**
     * Parses the changed value from the `React.ChangeEvent` and updates the specified field with it.
     * @param event input event of the input component
     */
    function updateResidentWithChangeEvent(
      event: React.ChangeEvent<HTMLInputElement>,
    ): void {
      let value: number | string = event.target.value;
      if (['rent', 'incidentals'].includes(field)) {
        value = convertCurrencyEurosToCents(Number(value));
      }
      updateResident(value);
    }

    // Input for this component doesn't need to be parsed
    if (field === 'contractStart') return updateResident;

    return updateResidentWithChangeEvent;
  }

  /**
   * Handles the saving of the new resident that is triggered whenever the modal is closed.
   */
  function onSave(): void {
    // Validate input
    const newErrors = validateResidentArgs(resident) as CreateResidentErrors;
    const numberOfErrors = Object.keys(newErrors).filter(
      (k) => !!newErrors[k as keyof CreateResidentErrors],
    ).length;

    if (numberOfErrors > 0) {
      // Invalid input(s)
      setErrors(newErrors);
      return;
    }

    // Creates new resident and closes the modal
    ResidentStateManager.addResident(createResident(resident));
    props.onClose();
  }

  return (
    <GenericModal
      title="Neuer Mieter"
      show={props.show}
      onClose={props.onClose}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <TextField
            id="firstName"
            label="Vorname"
            variant="outlined"
            required
            onChange={residentUpdater('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName || ''}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="lastName"
            label="Nachname"
            variant="outlined"
            required
            onChange={residentUpdater('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName || ''}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="rent"
            label="Miete"
            type="number"
            required
            onChange={residentUpdater('rent')}
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            }}
            error={!!errors.rent}
            helperText={errors.rent || ''}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="incidentals"
            label="Nebenkosten"
            type="number"
            required
            onChange={residentUpdater('incidentals')}
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            }}
            error={!!errors.incidentals}
            helperText={errors.incidentals || ''}
          />
        </Grid>
        <Grid item xs={6}>
          <MonthYearInput
            id="contractStart"
            label="Vertragsbeginn"
            priorMonthChoices={6}
            futureMonthChoices={6}
            onChange={
              residentUpdater('contractStart') as (value: MonthYear) => void
            }
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <Button variant="contained" onClick={() => onSave()}>
        Erstellen
      </Button>
    </GenericModal>
  );
}

export default CreateResidentModal;
