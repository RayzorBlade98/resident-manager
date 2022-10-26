import React from "react";
import { Resident } from "_/types/resident";
import styles from "./styles";

interface ResidentListElementProps {
  resident: Resident;
}

function ResidentListElement(props: ResidentListElementProps): JSX.Element {
  return (
    <>
      <div {...styles.residentListElementContainer}>
        {props.resident.firstName + " " + props.resident.lastName}
      </div>
    </>
  );
}

export default ResidentListElement;
