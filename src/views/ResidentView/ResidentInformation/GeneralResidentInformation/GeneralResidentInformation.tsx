import React from 'react';
import { useRecoilValue } from 'recoil';
import { convertCurrencyCentsToString } from '../../../../utils/currency/currency.utils';
import { residentViewSelectedResidentState } from '../../states/resident_view_state';
import { Resident } from '_/types/resident';

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
      <p>{selectedResident.invoiceStart.toString()}</p>
    </>
  );
}

export default GeneralResidentInformation;
