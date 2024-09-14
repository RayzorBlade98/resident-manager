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
import { AddOneTimeIncidentalsPaymentModal } from './AddOneTimeIncidentalsPaymentModal/AddOneTimeIncidentalsPaymentModal';
import CreateOneTimeIncidentalsModal from './CreateOneTimeIncidentalsModal/CreateOneTimeIncidentalsModal';
import '_/extensions/date/date.extension';
import { AddPaymentIcon } from '_/components/generic/ModalIconButton/AddPaymentIcon/AddPaymentIcon';
import { OpenDocumentButton } from '_/components/generic/buttons/OpenDocumentButton/OpenDocumentButton';
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
              <TableCell>Rechnung</TableCell>
              <TableCell>Überweisung</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={8}
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
                sx={{
                  height: '73px',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
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
                <TableCell>
                  <OpenDocumentButton
                    documentId={_incidentals.billDocumentId}
                    documentTarget={{
                      type: 'incidentals',
                      incidentalsId: _incidentals.id,
                    }}
                    tooltip="Rechnung anzeigen"
                  />
                </TableCell>
                <TableCell>
                  <OpenDocumentButton
                    documentId={_incidentals.bankTransferDocumentId}
                    documentTarget={{
                      type: 'incidentals',
                      incidentalsId: _incidentals.id,
                    }}
                    tooltip="Überweisung anzeigen"
                  />
                </TableCell>
                <TableCell>
                  <AddPaymentIcon
                    modal={(modalProps) => (
                      <AddOneTimeIncidentalsPaymentModal
                        {...modalProps}
                        incidentals={_incidentals}
                      />
                    )}
                    hidden={!!_incidentals.paymentDate}
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

export default OneTimeIncidentalsTable;
