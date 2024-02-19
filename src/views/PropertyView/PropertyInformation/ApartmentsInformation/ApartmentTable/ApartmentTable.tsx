import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from '@mui/material';
import React, { useState } from 'react';
import CreateApartmentModal from './CreateApartmentModal/CreateApartmentModal';
import usePropertyState from '_/hooks/usePropertyState/usePropertyState';

const styles = {
  createApartmentCell: {
    ':hover': {
      cursor: 'pointer',
    },
  },
};

/**
 * Table that displays all apartments
 */
function ApartmentTable() {
  const [showModal, setShowModal] = useState(false);
  const apartments = usePropertyState().property.apartments;

  return (
    <>
      <CreateApartmentModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Geschoss</TableCell>
              <TableCell>Lage</TableCell>
              <TableCell>Zimmer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={6}
                onClick={() => setShowModal(true)}
                align="center"
                sx={styles.createApartmentCell}
              >
                Neue Wohnung
              </TableCell>
            </TableRow>
            {apartments.map((apartment) => (
              <TableRow
                key={`${apartment.floor}-${apartment.location}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{apartment.floor}</TableCell>
                <TableCell>{apartment.location}</TableCell>
                <TableCell>{apartment.rooms.generic}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ApartmentTable;
