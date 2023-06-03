import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import GenericModal from '../../../components/GenericComponents/GenericModal/GenericModal';
import createIncidentalsState from '../states/create_incidentals_state';
import CreateIncidentalsButton from './CreateIncidentalsButton/CreateIncidentalsButton';
import CreateIncidentalsForm from './CreateIncidentalsForm/CreateIncidentalsForm';

/**
 * Modal that contains an input form to create new incidentals.
 */
function CreateIncidentalsModal(): JSX.Element {
  const incidentalsCreationState = useRecoilValue(createIncidentalsState);
  const resetIncidentalsCreationState = useResetRecoilState(
    createIncidentalsState,
  );

  return (
    <GenericModal
      title="Neue Nebenkosten"
      show={incidentalsCreationState.showModal}
      onClose={resetIncidentalsCreationState}
    >
      {/* Body */}
      <CreateIncidentalsForm />
      {/* Footer */}
      <CreateIncidentalsButton />
    </GenericModal>
  );
}

export default CreateIncidentalsModal;
