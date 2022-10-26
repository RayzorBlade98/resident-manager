import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import CreateIncidentalsModal from '../CreateIncidentalsModal/CreateIncidentalsModal'; // eslint-disable-line max-len
import IncidentalsTableRow from './IncidentalsTableRow';
import { Incidentals } from '_/types/incidentals';

interface IncidentalsTableProps {
  incidentals: Incidentals[];
}

function IncidentalsTable(props: IncidentalsTableProps): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      {showModal && (
        <CreateIncidentalsModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      <MDBTable hover>
        <MDBTableHead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Abrechnungsart</th>
            <th scope="col">Preis</th>
            <th scope="col">Abrechnungszeitraum</th>
            <th scope="col">Aktionen</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          <tr>
            <td colSpan={5} onClick={() => setShowModal(true)}>
              Neue Nebenkosten
            </td>
          </tr>
          {props.incidentals.map((incidentals: Incidentals) => (
            <IncidentalsTableRow incidentals={incidentals} />
          ))}
        </MDBTableBody>
      </MDBTable>
    </>
  );
}

export default IncidentalsTable;
