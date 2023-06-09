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
import createIncidentalsState from '../states/create_incidentals_state';
import incidentalsState from '_/states/incidentals/incidentals.state';

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
function IncidentalsTable(): JSX.Element {
  const setCreateIncidentalsState = useSetRecoilState(createIncidentalsState);
  const incidentals = useRecoilValue(incidentalsState);

  const onCreateIncidentals = () => {
    setCreateIncidentalsState((state) => ({ ...state, showModal: true }));
  };

  return (
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
              <TableCell>{_incidentals.deductionType}</TableCell>
              <TableCell>
                {convertCurrencyCentsToString(_incidentals.currentPrice)}
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
  );
}

export default IncidentalsTable;
