/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import CreateResidentModal from '../CreateResidentModal/CreateResidentModal';
import ResidentListElement from './ResidentListElement';
import styles from './styles';
import residentsState, {
  ResidentState,
} from '_/states/saveStates/resident_state';
import { Resident } from '_/types/resident';

function ResidentList(): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);
  const residents = useRecoilValue<ResidentState>(residentsState);

  function onNewResident(): void {
    setShowModal(true);
  }

  return (
    <>
      {showModal && (
        <CreateResidentModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      <div {...styles.residentListContainer}>
        <div {...styles.newResidentDiv} onClick={onNewResident}>
          Neuer Mieter
        </div>
        <hr className="hr" />
        {residents.map((resident: Resident) => (
          <>
            <ResidentListElement resident={resident} key={resident.id} />
            {resident.id !== residents.slice(-1)[0].id && <hr className="hr" />}
          </>
        ))}
      </div>
    </>
  );
}

export default ResidentList;
