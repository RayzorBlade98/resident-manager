import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { convertCurrencyCentsToString } from '../../../utils/currency/currency.utils';
import AddPaymentIcon from './AddPaymentIcon/AddPaymentIcon';
import AddRentPaymentModal from './AddRentPaymentModal/AddRentPaymentModal';
import PaymentStatusIcon from './PaymentStatusIcon/PaymentStatusIcon';
import { Resident } from '_/models/resident/resident';

interface RentInformationTableProps {
  /**
   * Resident for which the rent information should be displayed
   */
  resident: Resident
}

/**
 * Table that displays all rent informations
 */
function RentInformationTable(props: RentInformationTableProps): JSX.Element {
  return (
    <>
      <AddRentPaymentModal />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Monat</TableCell>
              <TableCell>Miete</TableCell>
              <TableCell>Nebenkosten</TableCell>
              <TableCell>Bezahlt</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.resident.rentInformation?.map((rent) => (
              <TableRow
                key={rent.dueDate.toString()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{rent.dueDate.toString()}</TableCell>
                <TableCell>{convertCurrencyCentsToString(rent.rent)}</TableCell>
                <TableCell>
                  {convertCurrencyCentsToString(rent.incidentals)}
                </TableCell>
                <TableCell>
                  <PaymentStatusIcon rentInformation={rent} />
                </TableCell>
                <TableCell>
                  <AddPaymentIcon rentInformation={rent} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default RentInformationTable;
