import React from 'react';
import SelectField from '../SelectField/SelectField';
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
    <SelectField
      required
      id="deductionType"
      label="Abrechnungsart"
      value={props.value}
      onChange={props.onChange}
      values={
        Object.fromEntries(
          Object.values(DeductionType).map((s) => [s, s]),
        ) as Record<DeductionType, DeductionType>
      }
    />
  );
}

export default DeductionTypeSelect;
