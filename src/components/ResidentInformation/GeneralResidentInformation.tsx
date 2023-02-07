import React from 'react';
import { MonthYearUtils } from '_/types/date';
import { Resident } from '_/types/resident';
import { convertCurrencyCentsToString } from '_/utils/currency';

interface GeneralResidentInformationProps {
  /**
   * Resident for which the information should be displayed
   */
  resident: Resident;
}

/**
 * Component that displays general information about a resident
 */
function GeneralResidentInformation(
  props: GeneralResidentInformationProps,
): JSX.Element {
  return (
    <>
      <p>{`${props.resident.firstName} ${props.resident.lastName}`}</p>
      <p>{`${convertCurrencyCentsToString(props.resident.rent[0].rent)}`}</p>
      <p>{`${MonthYearUtils.toString(props.resident.invoiceStart)}`}</p>
    </>
  );
}

export default GeneralResidentInformation;
