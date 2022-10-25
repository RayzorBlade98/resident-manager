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
        {props.resident.first_name + " " + props.resident.last_name}
      </div>
    </>
  );
}

export default ResidentListElement;
