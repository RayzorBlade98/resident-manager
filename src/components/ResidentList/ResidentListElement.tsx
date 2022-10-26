/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styles from './styles';
import { Resident } from '_/types/resident';

interface ResidentListElementProps {
  resident: Resident;
}

function ResidentListElement(props: ResidentListElementProps): JSX.Element {
  return (
    <div {...styles.residentListElementContainer}>
      {`${props.resident.firstName} ${props.resident.lastName}`}
    </div>
  );
}

export default ResidentListElement;
