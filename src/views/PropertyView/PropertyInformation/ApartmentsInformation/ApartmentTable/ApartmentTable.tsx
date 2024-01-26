import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import propertyState from '_/states/property/property.state';

function ApartmentTable() {
  const apartments = useRecoilValue(propertyState).apartments;

  return (
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
          {apartments.map((apartment) => (
            <TableRow
              key={`${apartment.floor}-${apartment.location}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{apartment.floor}</TableCell>
              <TableCell>{apartment.location}</TableCell>
              <TableCell>{apartment.rooms}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ApartmentTable;
