import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { residentViewSelectedResidentState } from '../states/resident_view_state';
import styles from '../styles';
import createResidentState from './states/create_resident_state';
import GenericList from '_/components/GenericComponents/GenericList/GenericList';
import GenericListElement from '_/components/GenericComponents/GenericList/GenericListElement';
import residentState from '_/states/saveStates/resident_state';
import { Resident } from '_/types/resident';
import CreateResidentModal from '_/views/ResidentView/ResidentList/CreateResidentModal/CreateResidentModal';

/**
 * Component that displays a list of provided residents
 */
function ResidentList(): JSX.Element {
  const setCreateResidentState = useSetRecoilState(createResidentState);
  const residents = useRecoilValue(residentState);
  const [selectedResident, setSelectedResident] = useRecoilState(
    residentViewSelectedResidentState,
  );

  const onCreateResident = () => {
    setCreateResidentState((state) => ({ ...state, showModal: true }));
  };

  return (
    <>
      <CreateResidentModal />
      <GenericList style={styles.residentList.container}>
        <GenericListElement
          onClick={onCreateResident}
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
