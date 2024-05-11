import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from '@mui/material';
import React, { useState } from 'react';
import CreateParkingSpaceModal from './CreateParkingSpaceModal/CreateParkingSpaceModal';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';

const styles = {
  createParkingSpaceCell: {
    ':hover': {
      cursor: 'pointer',
    },
  },
};

/**
 * Table that displays all parking spaces
 */
function ParkingSpaceTable() {
  const [showModal, setShowModal] = useState(false);
  const parkingSpaces = usePropertyState().property.parkingSpaces;

  return (
    <>
      <CreateParkingSpaceModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={styles.createParkingSpaceCell}
                onClick={() => setShowModal(true)}
              >
                Neue Garage / Stellplatz
              </TableCell>
            </TableRow>
            {parkingSpaces.map((parkingSpace) => (
              <TableRow
                key={parkingSpace.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{parkingSpace.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ParkingSpaceTable;
