import { Button, Grid, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import GenericModal from '../GenericComponents/GenericModal/GenericModal';
import { addResident } from '_/states/saveStates/resident_state';
import {
  createResident,
  CreateResidentArguments,
  CreateResidentErrors,
  validateResidentArgs,
} from '_/types/resident';
import { convertCurrencyEurosToCents } from '_/utils/currency';

export interface CreateResidentModalProps {
  show: boolean;
  onClose: () => void;
}

function CreateResidentModal(props: CreateResidentModalProps): JSX.Element {
  const [resident, setResident] = useState<CreateResidentArguments>({
    firstName: '',
    lastName: '',
    rent: null,
  });
  const [errors, setErrors] = useState<CreateResidentErrors>({});

  function residentUpdater(field: string) {
    function updateResident(event: React.ChangeEvent<HTMLInputElement>): void {
      let value: number | string = event.target.value;
      if (field === 'rent') {
        value = Number(value);
        value = convertCurrencyEurosToCents(value);
      }
      const newResident = {
        ...resident,
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
    return updateResident;
  }

  function onSave(): void {
    const newErrors = validateResidentArgs(resident) as CreateResidentErrors;
    const numberOfErrors = Object.keys(newErrors).filter(
      (k) => !!newErrors[k as keyof CreateResidentErrors],
    ).length;
    if (numberOfErrors > 0) {
      setErrors(newErrors);
      return;
    }
    addResident(createResident(resident));
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
      </Grid>

      {/* Footer */}
      <Button variant="contained" onClick={() => onSave()}>
        Erstellen
      </Button>
    </GenericModal>
  );
}

export default CreateResidentModal;
