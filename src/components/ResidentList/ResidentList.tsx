/* eslint-disable react/jsx-props-no-spreading */
import { StyleAttribute } from 'glamor';
import React, { useState } from 'react';
import CreateResidentModal from '../CreateResidentModal/CreateResidentModal';
import ResidentListElement from './ResidentListElement';
import styles from './styles';
import { Resident } from '_/types/resident';

interface ResidentListProps {
  residents: Resident[];
  selectedResident: Resident;
  onSelectResident: (resident: Resident) => void;
  containerStyle?: StyleAttribute;
}

function ResidentList(props: ResidentListProps): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);

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

      <div {...{ ...styles.residentListContainer, ...props.containerStyle }}>
        <div {...styles.newResidentDiv} onClick={onNewResident}>
          Neuer Mieter
        </div>
        <hr className="hr" />
        {props.residents.map((resident: Resident) => (
          <>
            <ResidentListElement
              resident={resident}
              selected={resident.id === props.selectedResident.id}
              onSelectResident={props.onSelectResident}
              key={resident.id}
            />
            {resident.id !== props.residents.slice(-1)[0].id && (
              <hr className="hr" />
            )}
          </>
        ))}
      </div>
    </>
  );
}

export default ResidentList;
