import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import createOngoingIncidentalsState from '../states/create_ongoing_incidentals_state';
import CreateOngoingIncidentalsButton from './CreateOngoingIncidentalsButton/CreateOngoingIncidentalsButton';
import CreateOngoingIncidentalsForm from './CreateOngoingIncidentalsForm/CreateOngoingIncidentalsForm';
import GenericModal from '_/components/generic/GenericModal/GenericModal';

/**
 * Modal that contains an input form to create new ongoing incidentals.
 */
function CreateOngoingIncidentalsModal(): JSX.Element {
  const incidentalsCreationState = useRecoilValue(
    createOngoingIncidentalsState,
  );
  const resetIncidentalsCreationState = useResetRecoilState(
    createOngoingIncidentalsState,
  );

  return (
    <GenericModal
      title="Neue Nebenkosten"
      show={incidentalsCreationState.showModal}
      onClose={resetIncidentalsCreationState}
    >
      {/* Body */}
      <CreateOngoingIncidentalsForm />
      {/* Footer */}
      <CreateOngoingIncidentalsButton />
    </GenericModal>
  );
}

export default CreateOngoingIncidentalsModal;
