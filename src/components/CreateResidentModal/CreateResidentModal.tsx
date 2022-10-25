import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import { Resident, emptyResident } from "_/types/resident";
import { addResident } from "_/states/residentStates/all_residents_state";

interface CreateResidentModalProps {
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
    <MDBModal show={true} tabIndex="-1" staticBackdrop>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{"Neuer Mieter"}</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={props.onClose}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <form>
              <div className="row mb-4">
                <div className="col">
                  <MDBInput
                    label={"Vorname"}
                    id="typeText"
                    type="text"
                    onChange={residentUpdater("first_name")}
                  />
                </div>
                <div className="col">
                  <MDBInput
                    label={"Nachname"}
                    id="typeText"
                    type="text"
                    onChange={residentUpdater("last_name")}
                  />
                </div>
              </div>
            </form>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn onClick={onSave}>{"Erstellen"}</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default CreateResidentModal;
