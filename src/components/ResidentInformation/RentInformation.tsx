import { Icon } from '@mui/material';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { Resident } from '_/types/resident';
import { convertCurrencyCentsToString } from '_/utils/currency';

interface RentInformationProps {
  /**
   * Resident for which the information should be displayed
   */
  resident: Resident;
}

/**
 * Component that displays rent information about a resident
 */
function RentInformation(props: RentInformationProps): JSX.Element {
  return (
    <MDBTable hover>
      <MDBTableHead>
        <tr>
          <th scope="col">Monat</th>
          <th scope="col">Miete</th>
          <th scope="col">Bezahlt</th>
          <th scope="col">Aktionen</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {[...props.resident.rent].reverse().map((rent) => (
          <tr key={uuid()}>
            <td>{`${rent.dueDate.month} ${rent.dueDate.year}`}</td>
            <td>{convertCurrencyCentsToString(rent.rent)}</td>
            <td>
              {rent.isPaid ? (
                <Icon
                  baseClassName="fa-regular"
                  className="fa-circle-check"
                  color="success"
                />
              ) : (
                <Icon
                  baseClassName="fa-regular"
                  className="fa-circle-xmark"
                  color="error"
                />
              )}
            </td>
            <td />
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}

export default RentInformation;
