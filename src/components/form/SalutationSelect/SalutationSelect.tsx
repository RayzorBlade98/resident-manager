import {
  FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import React from 'react';
import { Salutation } from '_/models/name';

interface SalutationSelectProps {
  /**
   * Currently selected salutation
   */
  value: Salutation;

  /**
   * Callback when a salutation is selected
   */
  onChange: (salutation: Salutation) => void;
}

/**
 * Select component to choose a salutation
 */
function SalutationSelect(props: SalutationSelectProps): JSX.Element {
  return (
    <FormControl fullWidth>
      <InputLabel id="salutationLabel">Anrede</InputLabel>
      <Select
        required
        fullWidth
        labelId="salutationLabel"
        id="salutation"
        label="Anrede"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value as Salutation)}
      >
        {Object.values(Salutation).map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SalutationSelect;
