import React, { useState } from "react";
import GenericModal from "../GenericComponents/GenericModal/GenericModal";
import {
  DeductionType,
  emptyIncidentals,
  Incidentals,
} from "_/types/incidentals";
import { addIncidentals } from "_/states/saveStates/incidentals_state";
import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { convert_currency_float_to_int } from "_/utils/currency";

export interface CreateIncidentalsModalProps {
  show: boolean;
  onClose: () => void;
}

function CreateIncidentalsModal(
  props: CreateIncidentalsModalProps
): JSX.Element {
  const [incidentals, setIncidentals] = useState<Incidentals>(
    emptyIncidentals()
  );

  function incidentalsUpdater(field: string) {
    function updateIncidentals(
      event: React.ChangeEvent<HTMLInputElement>
    ): void {
      let value: number | string = event.target.value;
      if (["currentPrice", "invoiceInterval"].includes(field)) {
        value = Number(value);
        if (field === "currentPrice")
          value = convert_currency_float_to_int(value);
      }

      setIncidentals({
        ...incidentals,
        [field]: value,
      });
    }
    return updateIncidentals;
  }

  function onSave(): void {
    addIncidentals(incidentals);
    props.onClose();
  }

  return (
    <GenericModal title="Neue Nebenkosten" {...props}>
      {/*Body*/}
      <form>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={6}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              required
              onChange={incidentalsUpdater("name")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="cost"
              label="Kosten"
              type="number"
              required
              onChange={incidentalsUpdater("currentPrice")}
              InputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="deductionType"
              select
              required
              label="Abrechnungsart"
              value={incidentals.deductionType}
              onChange={incidentalsUpdater("deductionType")}
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
            />
          </Grid>
        </Grid>
      </form>
      {/*Footer*/}
      <Button variant="contained" onClick={onSave}>
        Erstellen
      </Button>
    </GenericModal>
  );
}

export default CreateIncidentalsModal;
