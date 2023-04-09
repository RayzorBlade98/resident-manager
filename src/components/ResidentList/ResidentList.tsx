/* eslint-disable react/jsx-props-no-spreading */
import { StyleAttribute } from 'glamor';
import React, { useState } from 'react';
import CreateResidentModal from '../CreateResidentModal/CreateResidentModal';
import GenericList from '../GenericComponents/GenericList/GenericList';
// eslint-disable-next-line max-len
import GenericListElement from '../GenericComponents/GenericList/GenericListElement';
import styles from './styles';
import { Resident } from '_/types/resident';

interface ResidentListProps {
  /**
   * List of included residents
   */
  residents: Resident[];

  /**
   * Currently selected resident
   */
  selectedResident?: Resident;

  /**
   * Callback when selecting a resident
   */
  onSelectResident: (resident: Resident) => void;

  /**
   * Additional stlye of the list container
   */
  style?: StyleAttribute;
}

/**
 * Component that displays a list of provided residents
 */
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
      <GenericList style={props.style} className="residentList">
        <GenericListElement
          onClick={() => { onNewResident(); }}
          style={styles.newResidentElement}
        >
          Neuer Mieter
        </GenericListElement>
        {props.residents.map((resident: Resident) => (
          <GenericListElement
            onClick={() => {
              props.onSelectResident(resident);
            }}
            selected={resident.id === props.selectedResident?.id}
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
