import React from 'react';
import { useRecoilValue } from 'recoil';
// eslint-disable-next-line max-len
import { residentViewSelectedResidentState } from '../../states/resident_view_state';
import { MonthYearUtils } from '_/types/date';
import { Resident } from '_/types/resident';
import { convertCurrencyCentsToString } from '_/utils/currency';

/**
 * Component that displays general information about a resident
 */
function GeneralResidentInformation(): JSX.Element {
  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;
  return (
    <>
      <p>{`${selectedResident.firstName} ${selectedResident.lastName}`}</p>
      <p>{`${convertCurrencyCentsToString(selectedResident.rent[0].rent)}`}</p>
      <p>{`${MonthYearUtils.toString(selectedResident.invoiceStart)}`}</p>
    </>
  );
}

export default GeneralResidentInformation;
