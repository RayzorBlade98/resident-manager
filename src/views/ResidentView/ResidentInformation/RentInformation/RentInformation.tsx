import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { residentViewSelectedResidentState } from '../../states/resident_view_state';
import IncreaseRentModal from './IncreaseRentModal/IncreaseRentModal';
import RentInformationTable from '_/components/shared/RentInformationTable/RentInformationTable';
import { Resident } from '_/models/resident/resident';

/**
 * Component that displays rent information about a resident
 */
function RentInformation(): JSX.Element | null {
  const [showIncreaseRentModal, setShowIncreaseRentModal] = useState(false);

  const resident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;
  return (
    <>
      <IncreaseRentModal
        resident={resident}
        show={showIncreaseRentModal}
        onClose={() => setShowIncreaseRentModal(false)}
      />
      <Button onClick={() => setShowIncreaseRentModal(true)}>
        Miete erhöhen
      </Button>
      <RentInformationTable resident={resident} />
    </>
  );
}

export default RentInformation;
