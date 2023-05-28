import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import GenericModal from '../../../../components/GenericComponents/GenericModal/GenericModal';
import createResidentState from '../states/create_resident_state';
import CreateResidentButton from './CreateResidentButton/CreateResidentButton';
import CreateResidentForm from './CreateResidentForm/CreateResidentForm';

/**
 * Modal that contains an input form to create a new resident.
 */
function CreateResidentModal(): JSX.Element {
  const residentCreationState = useRecoilValue(createResidentState);
  const resetResidentCreationState = useResetRecoilState(createResidentState);

  return (
    <GenericModal
      title="Neuer Mieter"
      show={residentCreationState.showModal}
      onClose={resetResidentCreationState}
    >
      {/* Body */}
      <CreateResidentForm />
      {/* Footer */}
      <CreateResidentButton />
    </GenericModal>
  );
}

export default CreateResidentModal;
