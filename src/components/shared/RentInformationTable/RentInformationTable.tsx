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
import MonthYear from '_/extensions/date/month_year.extension';
import { Resident } from '_/models/resident/resident';

interface RentInformationTableProps {
  /**
   * Resident for which the rent information should be displayed
   */
  resident: Resident;

  /**
   * First month for which the rent information should be displayed (optional)
   */
  start?: MonthYear;

  /**
   * Last month for which the rent information should be displayed (optional)
   */
  end?: MonthYear;

  /**
   * If true the `AddRentPaymentModal` won't be rendered
   */
  disableRentPaymentModal?: boolean;
}

/**
 * Table that displays all rent informations
 */
function RentInformationTable(props: RentInformationTableProps): JSX.Element {
  const filteredRentInformation = props.resident.rentInformation.filter(
    (i) => (!props.start || i.dueDate >= props.start)
      && (!props.end || i.dueDate <= props.end),
  );

  return (
    <>
      {!props.disableRentPaymentModal && <AddRentPaymentModal />}
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
            {filteredRentInformation.map((rent) => (
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
                  <AddPaymentIcon
                    resident={props.resident}
                    rentInformation={rent}
                  />
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
