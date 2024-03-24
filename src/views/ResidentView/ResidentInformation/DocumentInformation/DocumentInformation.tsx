import { Button } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { residentViewSelectedResidentState } from '../../states/resident_view_state';
import { Resident } from '_/models/resident/resident';
import landlordState from '_/states/landlord/landlord.state';
import propertyState from '_/states/property/property.state';

/**
 * Component that displays all documents linked to a resident
 */
function DocumentInformation() {
  const landlord = useRecoilValue(landlordState);
  const property = useRecoilValue(propertyState);
  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;

  return (
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
  );
}

export default DocumentInformation;
