import { Button } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { convertCurrencyCentsToString } from '../../../../utils/currency/currency.utils';
import { convertNameToString } from '../../../../utils/name/name.utils';
import { residentViewSelectedResidentState } from '../../states/resident_view_state';
import { Resident } from '_/models/resident/resident';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';

/**
 * Component that displays general information about a resident
 */
function GeneralResidentInformation(): JSX.Element {
  const landlord = useRecoilValue(landlordState);
  const property = useRecoilValue(propertyState);
  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;

  return (
    <>
      {selectedResident.contractResidents.map((contractResident) => (
        <p>{convertNameToString(contractResident.name, true)}</p>
      ))}
      <p>
        {convertCurrencyCentsToString(selectedResident.rentInformation[0].rent)}
      </p>
      <p>{selectedResident.contractStart.toString()}</p>
      <Button
        onClick={() => {
          void window.ipcAPI.generateContractPdf({
            landlord,
            property,
            resident: selectedResident,
          });
        }}
      >
        Vertrag generieren
      </Button>
    </>
  );
}

export default GeneralResidentInformation;
