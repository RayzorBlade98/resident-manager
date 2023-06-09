import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { convertCurrencyCentsToString } from '../../../../../utils/currency/currency.utils';
import AddPaymentIcon from './AddPaymentIcon/AddPaymentIcon';
import PaymentStatusIcon from './PaymentStatusIcon/PaymentStatusIcon';
import { residentViewSelectedResidentState } from '_/views/ResidentView/states/resident_view_state';

/**
 * Table that displays all rent informations
 */
function RentInformationTable(): JSX.Element {
  const rentInformation = useRecoilValue(
    residentViewSelectedResidentState,
  )?.rent;

  return (
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
          {rentInformation?.map((rent) => (
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
  );
}

export default RentInformationTable;
