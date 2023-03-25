import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import GenericModal from '../GenericComponents/GenericModal/GenericModal';
import { IncidentalsStateManager } from '_/states/saveStates/incidentals_state';
import {
  createIncidentals,
  CreateIncidentalsArguments,
  CreateIncidentalsErrors,
  DeductionType,
  validateIncidentalsArgs,
} from '_/types/incidentals';
import { convertCurrencyEurosToCents } from '_/utils/currency';

export interface CreateIncidentalsModalProps {
  show: boolean;
  onClose: () => void;
}

function CreateIncidentalsModal(
  props: CreateIncidentalsModalProps,
): JSX.Element {
  const [incidentals, setIncidentals] = useState<CreateIncidentalsArguments>({
    name: '',
    currentPrice: null,
    deductionType: DeductionType.PerApartment,
    invoiceInterval: null,
  });
  const [errors, setErrors] = useState<CreateIncidentalsErrors>({});

  function incidentalsUpdater(field: string) {
    function updateIncidentals(
      event: React.ChangeEvent<HTMLInputElement>,
    ): void {
      let value: number | string = event.target.value;
      if (['currentPrice', 'invoiceInterval'].includes(field)) {
        value = Number(value);
        if (field === 'currentPrice') {
          value = convertCurrencyEurosToCents(value);
        }
      }

      const newIncidentals = {
        ...incidentals,
        [field]: value,
      };
      setIncidentals(newIncidentals);
      setErrors({
        ...errors,
        [field]: validateIncidentalsArgs(
          newIncidentals,
          field as keyof CreateIncidentalsErrors,
        ),
      });
    }
    return updateIncidentals;
  }

  function onSave(): void {
    const newErrors = validateIncidentalsArgs(
      incidentals,
    ) as CreateIncidentalsErrors;
    const numberOfErrors = Object.keys(newErrors).filter(
      (k) => !!newErrors[k as keyof CreateIncidentalsErrors],
    ).length;
    if (numberOfErrors > 0) {
      setErrors(newErrors);
      return;
    }
    IncidentalsStateManager.addIncidentals(createIncidentals(incidentals));
    props.onClose();
  }

  return (
    <GenericModal
      title="Neue Nebenkosten"
      show={props.show}
      onClose={props.onClose}
    >
      {/* Body */}
      <form>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={6}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              required
              onChange={incidentalsUpdater('name')}
              error={!!errors.name}
              helperText={errors.name || ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="cost"
              label="Kosten"
              type="number"
              required
              onChange={incidentalsUpdater('currentPrice')}
              InputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
              error={!!errors.currentPrice}
              helperText={errors.currentPrice || ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="deductionType"
              select
              required
              label="Abrechnungsart"
              value={incidentals.deductionType}
              onChange={incidentalsUpdater('deductionType')}
              error={!!errors.deductionType}
              helperText={errors.deductionType || ''}
            >
              {Object.values(DeductionType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Abrechnungszeitraum"
              id="invoiceInterval"
              type="number"
              required
              onChange={incidentalsUpdater('invoiceInterval')}
              error={!!errors.invoiceInterval}
              helperText={errors.invoiceInterval || ''}
            />
          </Grid>
        </Grid>
      </form>
      {/* Footer */}
      <Button variant="contained" onClick={() => onSave()}>
        Erstellen
      </Button>
    </GenericModal>
  );
}

export default CreateIncidentalsModal;
