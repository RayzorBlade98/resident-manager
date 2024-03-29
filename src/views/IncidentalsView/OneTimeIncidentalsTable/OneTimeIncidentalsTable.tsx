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
import CreateOneTimeIncidentalsModal from './CreateOneTimeIncidentalsModal/CreateOneTimeIncidentalsModal';
import '_/extensions/date/date.extension';
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
function OneTimeIncidentalsTable(): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const { oneTimeIncidentals } = useIncidentalsState();

  return (
    <>
      <CreateOneTimeIncidentalsModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Abrechnungsart</TableCell>
              <TableCell>Preis</TableCell>
              <TableCell>Rechnungsdatum</TableCell>
              <TableCell>Zahlungsdatum</TableCell>
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
            {oneTimeIncidentals.map((_incidentals) => (
              <TableRow
                key={_incidentals.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{_incidentals.name}</TableCell>
                <TableCell>{_incidentals.deductionType}</TableCell>
                <TableCell>
                  {convertCurrencyCentsToString(_incidentals.cost)}
                </TableCell>
                <TableCell>
                  {_incidentals.billingDate.toPreferredString()}
                </TableCell>
                <TableCell>
                  {_incidentals.paymentDate?.toPreferredString()}
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

export default OneTimeIncidentalsTable;
