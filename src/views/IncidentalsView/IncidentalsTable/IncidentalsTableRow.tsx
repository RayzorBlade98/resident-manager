import React from 'react';
import { Incidentals } from '_/types/incidentals';
import { convertCurrencyCentsToString } from '_/utils/currency/currency';

interface IncidentalsTableRowProps {
  incidentals: Incidentals;
}

export function IncidentalsTableRow(
  props: IncidentalsTableRowProps,
): JSX.Element {
  return (
    <tr key={props.incidentals.id}>
      <td>{props.incidentals.name}</td>
      <td>{props.incidentals.deductionType}</td>
      <td>{convertCurrencyCentsToString(props.incidentals.currentPrice)}</td>
      <td>
        {`${props.incidentals.invoiceInterval} Monat${
          props.incidentals.invoiceInterval === 1 ? '' : 'e'
        }`}
      </td>
      <td />
    </tr>
  );
}

export default IncidentalsTableRow;
