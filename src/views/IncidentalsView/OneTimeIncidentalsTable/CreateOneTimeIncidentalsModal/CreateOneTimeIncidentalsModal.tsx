import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import createOneTimeIncidentalsState from '../states/create_one_time_incidentals_state';
import CreateOneTimeIncidentalsButton from './CreateOneTimeIncidentalsButton/CreateOneTimeIncidentalsButton';
import CreateOneTimeIncidentalsForm from './CreateOneTimeIncidentalsForm/CreateOneTimeIncidentalsForm';
import GenericModal from '_/components/generic/GenericModal/GenericModal';

/**
 * Modal that contains an input form to create new one-time incidentals.
 */
function CreateOneTimeIncidentalsModal(): JSX.Element {
  const incidentalsCreationState = useRecoilValue(
    createOneTimeIncidentalsState,
  );
  const resetIncidentalsCreationState = useResetRecoilState(
    createOneTimeIncidentalsState,
  );

  return (
    <GenericModal
      title="Neue Nebenkosten"
      show={incidentalsCreationState.showModal}
      onClose={resetIncidentalsCreationState}
    >
      {/* Body */}
      <CreateOneTimeIncidentalsForm />
      {/* Footer */}
      <CreateOneTimeIncidentalsButton />
    </GenericModal>
  );
}

export default CreateOneTimeIncidentalsModal;
