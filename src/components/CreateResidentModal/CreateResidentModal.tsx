import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import GenericModal from '../GenericComponents/GenericModal/GenericModal';
import { addResident } from '_/states/saveStates/resident_state';
import { Resident, emptyResident } from '_/types/resident';

export interface CreateResidentModalProps {
  show: boolean;
  onClose: () => void;
}

function CreateResidentModal(props: CreateResidentModalProps): JSX.Element {
  const [resident, setResident] = useState<Resident>(emptyResident());

  function residentUpdater(field: string) {
    function updateResident(event: React.ChangeEvent<HTMLInputElement>): void {
      setResident({
        ...resident,
        [field]: event.target.value,
      });
    }
    return updateResident;
  }

  function onSave(): void {
    addResident(resident);
    props.onClose();
  }

  return (
    <GenericModal
      title="Neuer Mieter"
      show={props.show}
      onClose={props.onClose}
    >
      {/* Body */}
      <form>
        <div className="row mb-4">
          <div className="col">
            <TextField
              id="firstName"
              label="Vorname"
              variant="outlined"
              required
              onChange={residentUpdater('firstName')}
            />
          </div>
          <div className="col">
            <TextField
              id="lastName"
              label="Nachname"
              variant="outlined"
              required
              onChange={residentUpdater('lastName')}
            />
          </div>
        </div>
      </form>
      {/* Footer */}
      <Button variant="contained" onClick={() => onSave}>
        Erstellen
      </Button>
    </GenericModal>
  );
}

export default CreateResidentModal;
