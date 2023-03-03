/* eslint-disable react/jsx-no-useless-fragment */
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import React from 'react';

export interface GenericModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'lg' | 'xl';
}

export function GenericModal(
  props: React.PropsWithChildren<GenericModalProps>,
): JSX.Element {
  const children = React.Children.toArray(props.children);
  if (children.length !== 2) {
    throw new Error(
      'Modal needs exactly two children: The body and footer content',
    );
  }
  return (
    <>
      {props.show && (
        <MDBModal show tabIndex="-1" staticBackdrop>
          <MDBModalDialog size={props.size}>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>{props.title}</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={props.onClose}
                />
              </MDBModalHeader>
              <MDBModalBody>{children[0]}</MDBModalBody>
              <MDBModalFooter>{children[1]}</MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}
    </>
  );
}

export default GenericModal;
