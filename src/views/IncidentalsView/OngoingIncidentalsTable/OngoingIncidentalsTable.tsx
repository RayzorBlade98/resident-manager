import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import CreateOngoingIncidentalsModal from './CreateOngoingIncidentalsModal/CreateOngoingIncidentalsModal';
import { OngoingIncidentalsTableRow } from './OngoingIncidentalsTableRow/OngoingIncidentalsTableRow';
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
      <CreateOngoingIncidentalsModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
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
                colSpan={6}
                onClick={() => setShowModal(true)}
                align="center"
                sx={styles.createIncidentalsCell}
              >
                Neue Nebenkosten
              </TableCell>
            </TableRow>
            {ongoingIncidentals.map((incidentals) => (
              <OngoingIncidentalsTableRow incidentals={incidentals} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default OngoingIncidentalsTable;
