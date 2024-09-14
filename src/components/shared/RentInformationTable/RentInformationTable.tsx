import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useMemo } from 'react';
import { convertCurrencyCentsToString } from '../../../utils/currency/currency.utils';
import RentInformationUtils from '../../../utils/rent/rent.utils';
import AddRentPaymentModal from './AddRentPaymentModal/AddRentPaymentModal';
import PaymentStatusIcon from './PaymentStatusIcon/PaymentStatusIcon';
import { AddPaymentIcon } from '_/components/generic/ModalIconButton/AddPaymentIcon/AddPaymentIcon';
import { OpenDocumentButton } from '_/components/generic/buttons/OpenDocumentButton/OpenDocumentButton';
import MonthYear from '_/extensions/date/month_year.extension';
import { PaymentStatus } from '_/models/resident/rent';
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
}

/**
 * Table that displays all rent informations
 */
function RentInformationTable(props: RentInformationTableProps): JSX.Element {
  const filteredRentInformation = useMemo(
    () => props.resident.rentInformation.filter(
      (i) => (!props.start || i.dueDate >= props.start)
          && (!props.end || i.dueDate <= props.end),
    ),
    [props],
  );

  return (
    <TableContainer sx={{ height: '90%' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Monat</TableCell>
            <TableCell>Miete</TableCell>
            <TableCell>Nebenkosten</TableCell>
            <TableCell>Bezahlt</TableCell>
            <TableCell>Überweisung</TableCell>
            <TableCell>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRentInformation.map((rent) => (
            <TableRow
              key={`${props.resident.id}-${rent.dueDate.toString()}`}
              sx={{
                height: '73px',
                '&:last-child td, &:last-child th': { border: 0 },
              }}
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
                <OpenDocumentButton
                  documentId={rent.bankTransferDocumentId}
                  documentTarget={{
                    type: 'resident',
                    residentId: props.resident.id,
                  }}
                  tooltip="Überweisung anzeigen"
                />
              </TableCell>
              <TableCell>
                <AddPaymentIcon
                  modal={(modalProps) => (
                    <AddRentPaymentModal
                      {...modalProps}
                      resident={props.resident}
                      rentInformation={rent}
                    />
                  )}
                  hidden={
                    RentInformationUtils.getPaymentStatus(rent)
                    !== PaymentStatus.Unpaid
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RentInformationTable;
