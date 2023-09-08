import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { convertCurrencyCentsToString } from '../../../../utils/currency/currency.utils';
import Invoice from '_/models/invoice/invoice';

interface OngoingIncidentalsInvoiceInformationProps {
  /**
   * Invoice for which the ongoing incidentals information should be displayed
   */
  invoice: Invoice;
}

/**
 * Table that shows information about all ongoing incidentals of an invoice
 */
function OngoingIncidentalsInvoiceInformation(
  props: OngoingIncidentalsInvoiceInformationProps,
): JSX.Element {
  const incidentals = Object.values(
    props.invoice.ongoingIncidentalsInformation,
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Abrechnungsart</TableCell>
            <TableCell>Gesamtkosten</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidentals.map((_incidentals) => (
            <TableRow
              key={_incidentals.incidentalsId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{_incidentals.name}</TableCell>
              <TableCell>{_incidentals.deductionType}</TableCell>
              <TableCell>
                {convertCurrencyCentsToString(_incidentals.totalCost)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OngoingIncidentalsInvoiceInformation;
