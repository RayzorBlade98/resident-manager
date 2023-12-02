import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import { convertCurrencyCentsToString } from '../../../utils/currency/currency.utils';
import CreateOngoingIncidentalsModal from './CreateOngoingIncidentalsModal/CreateOngoingIncidentalsModal';
import useIncidentalsState from '_/hooks/useIncidentalsState/useIncidentalsState';

const styles = {
  createIncidentalsCell: {
    ':hover': {
      cursor: 'pointer',
    },
  },
};

/**
 * Table that displays all incidentals
 */
function OngoingIncidentalsTable(): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const { ongoingIncidentals } = useIncidentalsState();

  return (
    <>
      <CreateOngoingIncidentalsModal showModal={showModal} onCloseModal={() => setShowModal(false)} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Abrechnungsart</TableCell>
              <TableCell>Preis</TableCell>
              <TableCell>Abrechnungszeitraum</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={5}
                onClick={() => setShowModal(true)}
                align="center"
                sx={styles.createIncidentalsCell}
              >
                Neue Nebenkosten
              </TableCell>
            </TableRow>
            {ongoingIncidentals.map((_incidentals) => (
              <TableRow
                key={_incidentals.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{_incidentals.name}</TableCell>
                <TableCell>{_incidentals.deductionType}</TableCell>
                <TableCell>
                  {convertCurrencyCentsToString(_incidentals.costs[0].cost)}
                </TableCell>
                <TableCell>
                  {`${_incidentals.invoiceInterval} Monat${
                    _incidentals.invoiceInterval === 1 ? '' : 'e'
                  }`}
                </TableCell>
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default OngoingIncidentalsTable;
