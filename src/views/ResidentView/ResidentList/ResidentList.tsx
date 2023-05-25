import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
// eslint-disable-next-line max-len
import { residentViewSelectedResidentState } from '../states/resident_view_state';
import styles from '../styles';
// eslint-disable-next-line max-len
import GenericList from '_/components/GenericComponents/GenericList/GenericList';
// eslint-disable-next-line max-len
import GenericListElement from '_/components/GenericComponents/GenericList/GenericListElement';
import residentState from '_/states/saveStates/resident_state';
import { Resident } from '_/types/resident';
// eslint-disable-next-line max-len
import CreateResidentModal from '_/views/ResidentView/ResidentList/CreateResidentModal/CreateResidentModal';

/**
 * Component that displays a list of provided residents
 */
function ResidentList(): JSX.Element {
  const residents = useRecoilValue(residentState);
  const [selectedResident, setSelectedResident] = useRecoilState(
    residentViewSelectedResidentState,
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      {showModal && (
        <CreateResidentModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      <GenericList style={styles.residentList.container}>
        <GenericListElement
          onClick={() => setShowModal(true)}
          style={styles.residentList.newResident}
        >
          Neuer Mieter
        </GenericListElement>
        {residents.map((resident: Resident) => (
          <GenericListElement
            onClick={() => setSelectedResident(resident)}
            selected={resident === selectedResident}
            key={resident.id}
          >
            {`${resident.firstName} ${resident.lastName}`}
          </GenericListElement>
        ))}
      </GenericList>
    </>
  );
}

export default ResidentList;
