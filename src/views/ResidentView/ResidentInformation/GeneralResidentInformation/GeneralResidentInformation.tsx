import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { convertCurrencyCentsToString } from '../../../../utils/currency/currency.utils';
import { convertNameToString } from '../../../../utils/name/name.utils';
import { residentViewSelectedResidentState } from '../../states/resident_view_state';
import EditResidentModal from './EditResidentModal/EditResidentModal';
import { Resident } from '_/models/resident/resident';

/**
 * Component that displays general information about a resident
 */
function GeneralResidentInformation(): JSX.Element {
  const [showEditModal, setShowEditModal] = useState(false);

  const selectedResident = useRecoilValue(
    residentViewSelectedResidentState,
  ) as Resident;

  return (
    <>
      <EditResidentModal
        resident={selectedResident}
        showModal={showEditModal}
        onCloseModal={() => setShowEditModal(false)}
      />
      {selectedResident.contractResidents.map((contractResident) => (
        <p>{convertNameToString(contractResident.name, true)}</p>
      ))}
      <p>
        {convertCurrencyCentsToString(selectedResident.rentInformation[0].rent)}
      </p>
      <p>{selectedResident.contractStart.toString()}</p>
      <Button onClick={() => setShowEditModal(true)}>Bearbeiten</Button>
    </>
  );
}

export default GeneralResidentInformation;
