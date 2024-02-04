import React from 'react';
import SelectField from '../SelectField/SelectField';
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
    <SelectField
      required
      id="salutation"
      label="Anrede"
      value={props.value}
      onChange={props.onChange}
      values={
        Object.fromEntries(
          Object.values(Salutation).map((s) => [s, s]),
        ) as Record<Salutation, Salutation>
      }
    />
  );
}

export default SalutationSelect;
