import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { convertCurrencyCentsToString } from '../../../../utils/currency/currency.utils';
import { AddOngoingIncidentalsPaymentModal } from '../AddOngoingIncidentalsPaymentModal/AddOngoingIncidentalsPaymentModal';
import { AddPaymentIcon } from '_/components/generic/ModalIconButton/AddPaymentIcon/AddPaymentIcon';
import { OpenDocumentButton } from '_/components/generic/buttons/OpenDocumentButton/OpenDocumentButton';
import { OngoingIncidentals } from '_/models/incidentals/ongoing_incidentals';

type OngoingIncidentalsTableRowProps = {
  incidentals: OngoingIncidentals;
};

export function OngoingIncidentalsTableRow(
  props: OngoingIncidentalsTableRowProps,
) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <TableRow
        key={props.incidentals.id}
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          '& > *': { borderBottom: collapsed ? 0 : undefined },
        }}
      >
        <TableCell>
          {props.incidentals.costs.length > 0 && (
            <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{props.incidentals.name}</TableCell>
        <TableCell>{props.incidentals.deductionType}</TableCell>
        <TableCell>
          {props.incidentals.costs.length > 0
            ? convertCurrencyCentsToString(props.incidentals.costs[0].cost)
            : ''}
        </TableCell>
        <TableCell>
          {`${props.incidentals.invoiceInterval} Monat${
            props.incidentals.invoiceInterval === 1 ? '' : 'e'
          }`}
        </TableCell>
        <TableCell>
          <AddPaymentIcon
            modal={(modalProps) => (
              <AddOngoingIncidentalsPaymentModal
                {...modalProps}
                incidentals={props.incidentals}
              />
            )}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={collapsed} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Zahlungen
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Abschlagsdatum</TableCell>
                    <TableCell>Preis</TableCell>
                    <TableCell>Zahlungsdatum</TableCell>
                    <TableCell>Rechnung</TableCell>
                    <TableCell>Überweisung</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.incidentals.costs.map((payment) => (
                    <TableRow
                      key={payment.dueDate.toString()}
                      sx={{
                        height: '53px',
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell>{payment.dueDate.toString()}</TableCell>
                      <TableCell>
                        {convertCurrencyCentsToString(payment.cost)}
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate.toPreferredString()}
                      </TableCell>
                      <TableCell>
                        <OpenDocumentButton
                          documentId={payment.billDocumentId}
                          documentTarget={{
                            type: 'incidentals',
                            incidentalsId: props.incidentals.id,
                          }}
                          tooltip="Rechnung anzeigen"
                        />
                      </TableCell>
                      <TableCell>
                        <OpenDocumentButton
                          documentId={payment.bankTransferDocumentId}
                          documentTarget={{
                            type: 'incidentals',
                            incidentalsId: props.incidentals.id,
                          }}
                          tooltip="Überweisung anzeigen"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
