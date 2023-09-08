import {
  FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import React from 'react';
import { DeductionType } from '_/models/incidentals/deduction_type';

interface DeductionTypeSelectProps {
  /**
   * Currently selected deduction type
   */
  value: DeductionType;

  /**
   * Callback when a deduction type is selected
   */
  onChange: (DeductionType: DeductionType) => void;
}

/**
 * Select component to choose a deduction type
 */
function DeductionTypeSelect(props: DeductionTypeSelectProps): JSX.Element {
  return (
    <FormControl fullWidth>
      <InputLabel id="deductionTypeLabel">Abrechnungsart</InputLabel>
      <Select
        required
        labelId="deductionTypeLabel"
        id="deductionType"
        label="Abrechnungsart"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value as DeductionType)}
      >
        {Object.values(DeductionType).map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DeductionTypeSelect;
