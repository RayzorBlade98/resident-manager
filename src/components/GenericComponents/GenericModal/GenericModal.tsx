import React from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

export interface GenericModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
}

export function GenericModal(
  props: React.PropsWithChildren<GenericModalProps>
): JSX.Element {
  const children = React.Children.toArray(props.children);
  if (children.length != 2)
    throw "Modal needs exactly two children: The body content and the footer content";
  return (
    <MDBModal show={true} tabIndex="-1" staticBackdrop>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{props.title}</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={props.onClose}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>{children[0]}</MDBModalBody>
          <MDBModalFooter>{children[1]}</MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default GenericModal;
