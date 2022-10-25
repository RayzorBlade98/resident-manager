import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import allResidentsState from "_/states/residentStates/all_residents_state";
import { Resident } from "_/types/resident";
import CreateResidentModal from "../CreateResidentModal/CreateResidentModal";
import ResidentListElement from "./ResidentListElement";
import styles from "./styles";

function ResidentList(): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);
  const all_residents: Resident[] = useRecoilValue(allResidentsState);

  function onNewResident(): void {
    setShowModal(true);
  }

  return (
    <>
      {showModal && (
        <CreateResidentModal
          show={showModal}
          onClose={() => setShowModal(false)}
        ></CreateResidentModal>
      )}

      <div {...styles.residentListContainer}>
        <div {...styles.newResidentDiv} onClick={onNewResident}>
          Neuer Mieter
        </div>
        <hr className="hr" />
        {all_residents.map((resident: Resident) => (
          <>
            <ResidentListElement resident={resident} key={resident.id} />
            {resident.id !== all_residents.slice(-1)[0].id && (
              <hr className="hr" />
            )}
          </>
        ))}
      </div>
    </>
  );
}

export default ResidentList;
