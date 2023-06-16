import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { convertCurrencyCentsToString } from '../../../utils/currency/currency.utils';
import CreateOneTimeIncidentalsModal from './CreateOneTimeIncidentalsModal/CreateOneTimeIncidentalsModal';
import createOneTimeIncidentalsState from './states/create_one_time_incidentals_state';
import { oneTimeIncidentalsSelector } from '_/states/incidentals/incidentals.state';
import '_/extensions/date/date.extension';

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
  const setCreateIncidentalsState = useSetRecoilState(
    createOneTimeIncidentalsState,
  );
  const incidentals = useRecoilValue(oneTimeIncidentalsSelector);

  const onCreateIncidentals = () => {
    setCreateIncidentalsState((state) => ({ ...state, showModal: true }));
  };

  return (
    <>
      <CreateOneTimeIncidentalsModal />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Preis</TableCell>
              <TableCell>Rechnungsdatum</TableCell>
              <TableCell>Zahlungsdatum</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={5}
                onClick={onCreateIncidentals}
                align="center"
                sx={styles.createIncidentalsCell}
              >
                Neue Nebenkosten
              </TableCell>
            </TableRow>
            {incidentals.map((_incidentals) => (
              <TableRow
                key={_incidentals.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{_incidentals.name}</TableCell>
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
