import React from 'react';
import { Resident } from '_/types/resident';

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
    <>
      {props.resident.rent.map((rent) => (
        <p>
          {rent.dueDate.month}
          {' '}
          {rent.dueDate.year}
          {' '}
          -
          {' '}
          {rent.rent}
          {' '}
          -
          {' '}
          {String(rent.isPaid)}
        </p>
      ))}
    </>
  );
}

export default RentInformation;
