import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import createIncidentalsState from '../states/create_incidentals_state';
import IncidentalsTableRow from './IncidentalsTableRow';
import { incidentalsState } from '_/states/saveStates/incidentals_state';
import { Incidentals } from '_/types/incidentals';

function IncidentalsTable(): JSX.Element {
  const setCreateIncidentalsState = useSetRecoilState(createIncidentalsState);
  const incidentals = useRecoilValue(incidentalsState);

  const onCreateIncidentals = () => {
    setCreateIncidentalsState((state) => ({ ...state, showModal: true }));
  };

  return (
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
          <td colSpan={5} onClick={onCreateIncidentals}>
            Neue Nebenkosten
          </td>
        </tr>
        {incidentals.map((_incidentals: Incidentals) => (
          <IncidentalsTableRow incidentals={_incidentals} />
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}

export default IncidentalsTable;
