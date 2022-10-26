import React from "react";
import { Incidentals } from "_/types/incidentals";
import { convert_int_to_currency } from "_/utils/currency";

interface IncidentalsTableRowProps {
  incidentals: Incidentals;
}

export function IncidentalsTableRow(
  props: IncidentalsTableRowProps
): JSX.Element {
  return (
    <tr key={props.incidentals.id}>
      <td>{props.incidentals.name}</td>
      <td>{props.incidentals.deductionType}</td>
      <td>{convert_int_to_currency(props.incidentals.currentPrice)}</td>
      <td>{`${props.incidentals.invoiceInterval} Monat${
        props.incidentals.invoiceInterval == 1 ? "" : "e"
      }`}</td>
      <td>
        
      </td>
    </tr>
  );
}

export default IncidentalsTableRow;
